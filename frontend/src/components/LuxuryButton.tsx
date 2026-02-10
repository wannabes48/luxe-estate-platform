import React from 'react'

type Props = {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  onClick?: () => void
}

export const LuxuryButton: React.FC<Props> = ({ children, variant = 'primary', onClick }) => {
  const styles =
    variant === 'primary'
      ? 'bg-luxury-charcoal text-white hover:bg-luxury-gold'
      : 'border border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white'

  return (
    <button
      onClick={onClick}
      className={`${styles} px-8 py-3 uppercase tracking-widest-luxury text-xs transition-all duration-500 ease-out`}
    >
      {children}
    </button>
  )
}

export default LuxuryButton
