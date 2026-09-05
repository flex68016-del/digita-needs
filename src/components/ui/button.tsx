"use client"

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-deep-black text-white hover:bg-deep-black/90 active:scale-[0.98] focus:ring-electric-green",
      secondary: "bg-white text-deep-black border border-gray-200 hover:bg-gray-50 active:scale-[0.98] focus:ring-electric-green",
      ghost: "text-deep-black hover:bg-gray-100 active:scale-[0.98] focus:ring-electric-green"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    }
    
    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

export { Button }