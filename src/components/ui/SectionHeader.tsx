import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    gradient?: boolean;
}

export function SectionHeader({ title, subtitle, gradient = false }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
        >
            <h2
                className={`section-title ${gradient ? 'gradient-text' : 'text-text-primary'}`}
            >
                {title}
            </h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </motion.div>
    );
}
