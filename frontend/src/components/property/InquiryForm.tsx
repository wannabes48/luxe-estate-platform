"use client"
import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InquiryFormProps {
  propertyId: string;
  propertyName?: string;
}

export default function InquiryForm({ propertyId, propertyName }: InquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault(); // Stop page reload
    } else {
      console.error("Event object is missing preventDefault!");
      return;
    }

    setIsSubmitting(true);

    // 1. Extract data from the form
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 2. Prepare payload for API
    const submission = {
      property_id: propertyId,
      full_name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      phone: formData.get('phone'),
      property_name: propertyName // Pass property name for email context
    };

    try {
      // 3. Submit to Server-Side API (Bypasses RLS)
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      console.log("SUCCESSFULLY SUBMITTED VIA API", result);

      // 4. Success State
      setIsSuccess(true);
      formRef.current?.reset();

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (err: any) {
      console.error("Submission Error:", err.message);
      alert("Failed to send inquiry: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={(e) => handleSubmit(e)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Full Name</label>
              <input name="name" type="text" className="w-full border-b border-stone-300 py-2 focus:border-[#D4AF37] outline-none bg-transparent" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Email Address</label>
              <input name="email" type="email" className="w-full border-b border-stone-300 py-2 focus:border-[#D4AF37] outline-none bg-transparent" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Phone (Optional)</label>
              <input name="phone" type="tel" className="w-full border-b border-stone-300 py-2 focus:border-[#D4AF37] outline-none bg-transparent" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Message</label>
              <textarea name="message" rows={4} className="w-full border-b border-stone-300 py-2 focus:border-[#D4AF37] outline-none resize-none bg-transparent" placeholder={`I am interested in ${propertyName || 'this property'}...`} required />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0D0D0D] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting...' : 'Send Inquiry'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </div>
            <h4 className="font-serif text-2xl mb-2 text-[#0D0D0D]">Request Received</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              Your inquiry has been logged. <br /> Our concierge will contact you shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-8 text-[10px] uppercase tracking-widest text-stone-400 hover:text-[#0D0D0D] underline underline-offset-8"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}