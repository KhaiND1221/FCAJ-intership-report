import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'orange' | 'cyan' | 'none';
}

export function GlassCard({
    children,
    className = '',
    hover = true,
    glow = 'none',
    ...props
}: GlassCardProps) {
    const glowClasses = {
        orange: 'hover:shadow-glow-orange hover:border-accent-orange/30',
        cyan: 'hover:shadow-glow-cyan hover:border-accent-cyan/30',
        none: '',
    };

    return (
        <motion.div
            className={`
        relative overflow-hidden rounded-2xl
        bg-surface-card backdrop-blur-[16px]
        border border-white/10
        shadow-glass
        ${hover ? `transition-all duration-300 hover:-translate-y-1 ${glowClasses[glow]}` : ''}
        ${className}
      `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            {...props}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
