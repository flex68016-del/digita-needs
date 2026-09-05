"use client"

import { motion } from 'motion/react'
import { forwardRef, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
    
    const variants = {
      default: "bg-white border border-gray-100",
      outlined: "bg-white border-2 border-gray-200",
      elevated: "bg-white shadow-lg shadow-gray-100"
    }
    
    const hoverStyles = hover ? "hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1" : ""
    
    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className || ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = "Card"

export { Card }