/* src/components/property/InquiryForm.tsx */
"use client"
import React, { useRef, useState } from 'react'
import { submitInquiry } from '@/app/actions'
import { useFormStatus } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function InquiryForm({ propertyId }: { propertyId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await submitInquiry(formData);
    
    if (result.success) {
      setIsSuccess(true);
      formRef.current?.reset();
    } else {
      alert(result.error || "Submission failed. Please check your connection.");
    }
  }

  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            ref={formRef}
            action={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <input type="hidden" name="propertyId" value={propertyId} />
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Full Name</label>
              <input name="name" type="text" className="w-full border-b border-stone-300 py-2 focus:border-luxury-gold outline-none bg-transparent" required />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Email Address</label>
              <input name="email" type="email" className="w-full border-b border-stone-300 py-2 focus:border-luxury-gold outline-none bg-transparent" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Message</label>
              <textarea name="message" rows={4} className="w-full border-b border-stone-300 py-2 focus:border-luxury-gold outline-none resize-none bg-transparent" placeholder="I am interested in..." />
            </div>

            <SubmitButton />
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6">
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </div>
            <h4 className="font-serif text-2xl mb-2 text-luxury-charcoal">Request Received</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              Your inquiry has been logged. <br /> Our concierge will contact you shortly.
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="mt-8 text-[10px] uppercase tracking-widest text-stone-400 hover:text-luxury-charcoal underline underline-offset-8"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-4 bg-[#0D0D0D] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E91E63] transition-all duration-500 disabled:opacity-50"
    >
      {pending ? 'Transmitting...' : 'Send Inquiry'}
    </button>
  );
}