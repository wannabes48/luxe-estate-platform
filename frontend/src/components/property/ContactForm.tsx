/* src/components/ContactForm.tsx */
"use client"
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { submitInquiry } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// 1. Define Validation Schema (Aligned with Django model)
const inquirySchema = z.object({
  full_name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(), // Made optional to avoid the SQLite NOT NULL error
  message: z.string().min(10, 'Tell us more about your interest'),
  hp_field: z.string().optional(),
})

type InquiryData = z.infer<typeof inquirySchema>

export default function ContactForm({ propertyId }: { propertyId?: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InquiryData>({
    resolver: zodResolver(inquirySchema),
  });

  // 2. Optimized Submit Logic using Server Action
  const onSubmit = async (data: InquiryData) => {
    if (data.hp_field) return; // Honeypot check

    // Convert Zod data to FormData for the Server Action
    const formData = new FormData();
    formData.append('propertyId', propertyId || '');
    formData.append('name', data.full_name);
    formData.append('email', data.email);
    formData.append('message', data.message);

    const result = await submitInquiry(formData);

    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      alert(result.error || "Submission failed. Please check your connection.");
    }
  }

  return (
    <div className="relative min-h-[450px]">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Invisible honeypot field */}
            <input {...register('hp_field')} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="relative border-b border-stone-300 pb-2 focus-within:border-[#E91E63] transition-colors">
              <input
                {...register('full_name')}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none font-serif text-lg placeholder:text-stone-400"
              />
              {errors.full_name && <span className="text-red-500 text-[10px] uppercase absolute -bottom-5 left-0">{errors.full_name.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="relative border-b border-stone-300 pb-2 focus-within:border-[#E91E63] transition-colors">
                <input 
                   {...register('email')} 
                   placeholder="Email Address" 
                   className="w-full bg-transparent outline-none font-sans uppercase text-xs tracking-widest" 
                />
                {errors.email && <span className="text-red-500 text-[10px] uppercase absolute -bottom-5 left-0">{errors.email.message}</span>}
              </div>
              <div className="relative border-b border-stone-300 pb-2 focus-within:border-[#E91E63] transition-colors">
                <input 
                   {...register('phone')} 
                   placeholder="Phone Number (Optional)" 
                   className="w-full bg-transparent outline-none font-sans uppercase text-xs tracking-widest" 
                />
              </div>
            </div>

            <div className="relative border-b border-stone-300 pb-2 focus-within:border-[#E91E63] transition-colors pt-4">
              <textarea
                {...register('message')}
                placeholder="How can we assist you?"
                rows={3}
                className="w-full bg-transparent outline-none font-sans text-sm resize-none"
              />
              {errors.message && <span className="text-red-500 text-[10px] uppercase absolute -bottom-5 left-0">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-[#E91E63] transition-all duration-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting...' : 'Send Inquiry'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="contact-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="1.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </div>
            <h4 className="font-serif text-3xl mb-3 text-[#0D0D0D]">Request Received</h4>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
              Your inquiry has been logged. Our concierge will contact you shortly.
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="mt-10 text-[10px] uppercase tracking-widest text-stone-400 hover:text-black underline underline-offset-8 transition-all"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}