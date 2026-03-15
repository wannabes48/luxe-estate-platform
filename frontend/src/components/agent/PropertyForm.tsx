"use client"
import { useState, useEffect } from 'react'
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





export default function PropertyForm({ agentId, initialData }: { agentId: string, initialData?: any }) {
    const router = useRouter()
    const [images, setImages] = useState<string[]>(initialData?.images?.map((img: any) => img.image_url) || [])
    const [loading, setLoading] = useState(false)
    const [selectedEco, setSelectedEco] = useState<string[]>(initialData?.eco_features || []);
    const [featuresList, setFeaturesList] = useState<{id: string, label: string}[]>([]);
    
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

    useEffect(() => {
        async function loadMasterList() {
            const { data } = await supabase.from('eco_master_list').select('id, label');
            if (data) setFeaturesList(data);
        }
        loadMasterList();
    }, []);

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
                eco_features: finalEcoFeatures, 
                green_score: finalGreenScore            
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
                // 1. Fetch current images from the DB for this property
                const { data: existingImages } = await supabase
                    .from('property_images')
                    .select('image_url')
                    .eq('property_id', currentPropertyId);

                const existingUrls = existingImages?.map(img => img.image_url) || [];

                // 2. Identify images to DELETE (In DB but not in our current state)
                const urlsToDelete = existingUrls.filter(url => !images.includes(url));
    
                if (urlsToDelete.length > 0) {
                    await supabase
                        .from('property_images')
                        .delete()
                        .eq('property_id', currentPropertyId)
                        .in('image_url', urlsToDelete);
                }

                // 3. Identify images to INSERT (In our current state but not in DB)
                const urlsToInsert = images.filter(url => !existingUrls.includes(url));

                if (urlsToInsert.length > 0) {
                    const imageInserts = urlsToInsert.map((url, index) => ({
                        property_id: currentPropertyId,
                        image_url: url, // These are the Cloudinary URLs from CldUploadWidget
                        caption: `${data.title} - Image`,
                        display_order: existingUrls.length + index 
                    }));

                    const { error: imgError } = await supabase
                        .from('property_images')
                        .insert(imageInserts);

                    if (imgError) throw imgError;
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featuresList.map((feature) => (
                    <button
                        key={feature.id}
                        type="button"
                        onClick={() => toggleFeature(feature.id)}
                        className={`text-left px-4 py-3 text-xs border ${
                            selectedEco.includes(feature.id) 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-white border-stone-200 text-stone-500'
                        } rounded transition-all w-full`}
                    >
                        {selectedEco.includes(feature.id) ? '✓ ' : '+ '} {feature.label}
                    </button>
                ))}
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