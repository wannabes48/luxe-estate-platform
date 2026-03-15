"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabaseClient'
import { CldUploadWidget } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import { calculateGreenScore } from '@/utils/greenScoreCalculator'

interface PropertyFormData {
    title: string
    price: string
    description: string
    location_name: string
    location_city: string
    bedrooms: number
    bathrooms: number
    sq_ft: number
    status: string
    eco_features: string[] 
}

const ECO_FEATURE_OPTIONS = [
    { id: 'solar_panel', label: 'Solar Power System' },
    { id: 'water_harvesting', label: 'Rainwater Harvesting' },
    { id: 'borehole', label: 'Private Borehole' },
    { id: 'biogas', label: 'Biogas Digester' },
    { id: 'smart_meter', label: 'Smart Energy Meters' },
    { id: 'natural_lighting', label: 'Optimized Natural Lighting' },
    { id: 'eco_materials', label: 'Sustainable Building Materials' }
]

export default function PropertyForm({ agentId, initialData }: { agentId: string, initialData?: any }) {
    const router = useRouter()
    const [images, setImages] = useState<string[]>(initialData?.images?.map((img: any) => img.image_url) || [])
    const [loading, setLoading] = useState(false)
    const [selectedEco, setSelectedEco] = useState<string[]>(initialData?.eco_features || []);
    
    // 1. Added setValue to the useForm destructuring
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<PropertyFormData>({
        defaultValues: initialData ? {
            title: initialData.title,
            price: initialData.price,
            description: initialData.description,
            location_name: initialData.location?.name,
            location_city: initialData.location?.city,
            bedrooms: initialData.bedrooms,
            bathrooms: initialData.bathrooms,
            sq_ft: initialData.sq_ft,
            status: initialData.status,
            eco_features: initialData.eco_features || [], 
        } : {
            eco_features: [] 
        }
    })

    // 2. Sync logic for the custom Multi-select dropdown
    const toggleFeature = (id: string) => {
        const updated = selectedEco.includes(id)
            ? selectedEco.filter(item => item !== id)
            : [...selectedEco, id];
        
        setSelectedEco(updated);
        // This is the missing piece that ensures data hits onSubmit
        setValue('eco_features', updated); 
    };

    const onSubmit = async (data: PropertyFormData) => {
        console.log("Submitting with EcoFeatures:", data.eco_features);
        setLoading(true)

        const finalEcoFeatures = selectedEco || []; 
        const finalGreenScore = calculateGreenScore(finalEcoFeatures);

        console.log("FINAL PAYLOAD ECO:", finalEcoFeatures);
        
        try {
            // Location Logic
            let location_id;
            const { data: existingLoc } = await supabase
                .from('locations')
                .select('id')
                .ilike('name', data.location_name)
                .ilike('city', data.location_city)
                .maybeSingle()

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

            // Green Score Calculation
            const selectedEcoFeatures = data.eco_features || []; 
            const greenScore = calculateGreenScore(selectedEcoFeatures);

            // Prepare Payload
            const propertyPayload = {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price),
                status: data.status,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                sq_ft: data.sq_ft, // Fixed mapping
                location_id,
                agent_id: agentId,
                eco_features: selectedEcoFeatures, 
                green_score: greenScore            
            }

            let currentPropertyId = initialData?.property_id || initialData?.id;

            if (currentPropertyId) {
                const { error: updateError } = await supabase
                    .from('properties')
                    .update(propertyPayload)
                    .eq('property_id', currentPropertyId)
                if (updateError) throw updateError
            } else {
                const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4)
                const { data: newProp, error: insertError } = await supabase
                    .from('properties')
                    .insert([{ ...propertyPayload, slug, is_featured: false, is_boosted: false }])
                    .select()
                    .single()

                if (insertError) throw insertError
                currentPropertyId = newProp.property_id || newProp.id
            }

            // Image Sync Strategy
            if (currentPropertyId) {
                await supabase.from('property_images').delete().eq('property_id', currentPropertyId)
                if (images.length > 0) {
                    const imageInserts = images.map((url, index) => ({
                        property_id: currentPropertyId,
                        image_url: url,
                        caption: `${data.title} - Image ${index + 1}`,
                        is_cover: index === 0,
                        display_order: index
                    }))
                    const { error: imgError } = await supabase.from('property_images').insert(imageInserts)
                    if (imgError) throw imgError
                }
            }

            router.push('/agent/dashboard')
        } catch (error: any) {
            console.error("Submission Error:", error)
            alert("Error: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto bg-white p-10 shadow-sm border border-stone-100">
            {/* Header / Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Property Title</label>
                    <input {...register('title', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black font-serif text-xl" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">Price (KES)</label>
                    <input type="number" {...register('price', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400">Description</label>
                <textarea {...register('description', { required: true })} rows={6} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black resize-none" />
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
                    <input type="number" {...register('sq_ft', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
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
                    <input {...register('location_name', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400">City</label>
                    <input {...register('location_city', { required: true })} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-black" />
                </div>
            </div>

            {/* --- CUSTOM MULTI-SELECT DROPDOWN --- */}
            <div className="space-y-4 p-6 bg-[#FAFAFA] border border-stone-200">
                <div className="border-b border-stone-200 pb-2">
                    <h4 className="font-serif text-lg text-stone-900">Sustainability Profile</h4>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Select all eco-friendly features available</p>
                </div>
                
                <div className="space-y-4">
                    {/* Selected "Pills" */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-white border border-stone-100 rounded-lg">
                        {selectedEco.length === 0 && <span className="text-stone-300 text-xs italic p-1">No features selected yet...</span>}
                        {selectedEco.map(id => (
                            <div key={id} className="bg-emerald-600 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                {ECO_FEATURE_OPTIONS.find(o => o.id === id)?.label}
                                <button type="button" onClick={() => toggleFeature(id)} className="hover:text-black font-bold">×</button>
                            </div>
                        ))}
                    </div>

                    {/* Selection Dropdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ECO_FEATURE_OPTIONS.map((feature) => (
                            <button
                                key={feature.id}
                                type="button"
                                onClick={() => toggleFeature(feature.id)}
                                className={`text-left px-4 py-3 text-xs tracking-wider transition-all border ${
                                    selectedEco.includes(feature.id) 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' 
                                    : 'bg-white border-stone-200 text-stone-500 hover:border-black'
                                }`}
                            >
                                {selectedEco.includes(feature.id) ? '✓ ' : '+ '} {feature.label}
                            </button>
                        ))}
                    </div>
                    {/* Hidden input to ensure register works with current selection */}
                    <input type="hidden" {...register('eco_features')} />
                </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-stone-400">Gallery</label>
                <CldUploadWidget uploadPreset="luxe_estate_unsigned" onSuccess={(res: any) => setImages(prev => [...prev, res.info.secure_url])}>
                    {({ open }) => (
                        <div onClick={() => open()} className="border-2 border-dashed border-stone-300 p-12 text-center cursor-pointer hover:border-black transition-all">
                            <p className="uppercase tracking-[0.4em] text-[10px] text-stone-400">Upload Media</p>
                        </div>
                    )}
                </CldUploadWidget>
                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="relative aspect-square border border-stone-100">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-5 uppercase tracking-[0.4em] text-xs hover:bg-emerald-900 transition-all disabled:opacity-50">
                {loading ? 'Processing...' : (initialData ? 'Update Architectural Listing' : 'Publish to Inventory')}
            </button>
        </form>
    )
}