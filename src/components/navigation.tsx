"use client"

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  const navItems = [
    { label: 'L\'étude', href: '/' },
    { label: 'Comment ça marche', href: '/#how-it-works' },
    { label: 'À propos', href: '/about' },
  ]
  
  return (
    <>
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-full px-6 py-3 shadow-lg"
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-deep-black tracking-tight">
              Digital Needs
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-graphite hover:text-deep-black transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:block">
              <Link
                href="/"
                className="px-6 py-2 rounded-full bg-electric-green text-deep-black text-sm font-medium hover:bg-electric-green/90 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] inline-block"
              >
                Participer
              </Link>
            </div>
            
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5 text-deep-black" />
            </button>
          </div>
        </motion.div>
      </nav>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-3xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-8 border-l border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-deep-black" />
              </button>
              
              <div className="flex flex-col gap-6 mt-16">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-semibold text-deep-black hover:text-electric-green transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="pt-6"
                >
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-8 py-4 rounded-full bg-electric-green text-deep-black text-lg font-medium hover:bg-electric-green/90 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] inline-block text-center"
                  >
                    Participer à l'étude
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}