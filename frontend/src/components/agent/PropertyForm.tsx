"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabaseClient'
import { CldUploadWidget } from 'next-cloudinary'
import { useRouter } from 'next/navigation'

interface PropertyFormData {
    title: string
    price: string
    description: string
    location_name: string
    location_city: string
    bedrooms: number
    bathrooms: number
    area_sqft: number
    status: string
}

export default function PropertyForm({ agentId, initialData }: { agentId: string, initialData?: any }) {
    const router = useRouter()
    const [images, setImages] = useState<string[]>(initialData?.images?.map((img: any) => img.image_url) || [])
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>({
        defaultValues: initialData ? {
            title: initialData.title,
            price: initialData.price,
            description: initialData.description,
            location_name: initialData.location?.name,
            location_city: initialData.location?.city,
            bedrooms: initialData.bedrooms,
            bathrooms: initialData.bathrooms,
            area_sqft: initialData.area_sqft,
            status: initialData.status
        } : {}
    })

    const onSubmit = async (data: PropertyFormData) => {
        setLoading(true)
        try {
            // 1. Location Logic (Same as before)
            let location_id;
            const { data: existingLoc } = await supabase
                .from('locations')
                .select('id')
                .ilike('name', data.location_name)
                .ilike('city', data.location_city)
                .maybeSingle() // Safer than single()

            if (existingLoc) {
                location_id = existingLoc.id
            } else {
                const { data: newLoc, error: locError } = await supabase
                    .from('locations')
                    .insert([{ name: data.location_name, city: data.location_city }])
                    .select()
                    .single()
                if (locError) throw locError
                location_id = newLoc.id
            }

            // 2. Insert or Update Property
            const propertyPayload = {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price),
                status: data.status,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                area_sqft: data.area_sqft,
                location_id,
                agent_id: agentId, // Ensure ownership remains
                // slug: keep existing if update, else generate? 
                // We won't update slug for now to preserve SEO URLs
            }

            let currentPropertyId = initialData?.property_id || initialData?.id;

            if (currentPropertyId) {
                // UPDATE MODE
                const { error: updateError } = await supabase
                    .from('properties')
                    .update(propertyPayload)
                    .eq('property_id', currentPropertyId)

                if (updateError) throw updateError
            } else {
                // INSERT MODE
                const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4)

                const { data: newProp, error: insertError } = await supabase
                    .from('properties')
                    .insert([{ ...propertyPayload, slug, is_featured: false, is_boosted: false }])
                    .select()
                    .single()

                if (insertError) throw insertError
                currentPropertyId = newProp.property_id || newProp.id
            }

            // 3. Handle Images (Sync Strategy)
            if (currentPropertyId) {
                // Delete existing images mapped to this property
                await supabase.from('property_images').delete().eq('property_id', currentPropertyId)

                // Insert all current images
                if (images.length > 0) {
                    const imageInserts = images.map((url, index) => ({
                        property_id: currentPropertyId,
                        image_url: url,
                        caption: `${data.title} - Image ${index + 1}`,
                        is_cover: index === 0,
                        display_order: index
                    }))

                    const { error: imgError } = await supabase
                        .from('property_images')
                        .insert(imageInserts)

                    if (imgError) throw imgError
                }
            }

            router.push('/agent/dashboard')
        } catch (error: any) {
            console.error("Form Submission Error:", error)
            alert("Failed to save property: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto bg-white p-10 shadow-sm border border-stone-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Property Title</label>
                    <input {...register('title', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black font-serif text-xl" placeholder="e.g. The Glass House" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Price (KES)</label>
                    <input type="number" {...register('price', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" placeholder="85000000" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400">Description</label>
                <textarea {...register('description', { required: true })} rows={6} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black resize-none" placeholder="Describe the architectural highlights..." />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Bedrooms</label>
                    <input type="number" {...register('bedrooms', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Bathrooms</label>
                    <input type="number" {...register('bathrooms', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Area (Sq Ft)</label>
                    <input type="number" {...register('area_sqft', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Status</label>
                    <select {...register('status')} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black">
                        <option value="for_sale">For Sale</option>
                        <option value="for_rent">For Rent</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Location Name</label>
                    <input {...register('location_name', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" placeholder="e.g. Karen" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">City</label>
                    <input {...register('location_city', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" placeholder="e.g. Nairobi" />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-stone-400">Gallery Images</label>
                <CldUploadWidget
                    uploadPreset="luxe_estate_unsigned"
                    onSuccess={(result: any) => {
                        setImages(prev => [...prev, result.info.secure_url])
                    }}
                >
                    {({ open }) => {
                        return (
                            <div
                                onClick={() => open()}
                                className="border-2 border-dashed border-stone-300 p-10 text-center cursor-pointer hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                            >
                                <p className="uppercase tracking-widest text-xs">Click to Upload Images</p>
                            </div>
                        );
                    }}
                </CldUploadWidget>

                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {images.map((img, i) => (
                            <div key={i} className="relative aspect-square">
                                <img src={img} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                    className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-4 uppercase tracking-[0.3em] hover:bg-[#E91E63] transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : (initialData ? 'Update Listing' : 'Publish Listing')}
            </button>
        </form>
    )
}
