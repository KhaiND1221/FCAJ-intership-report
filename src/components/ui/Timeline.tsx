import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimelineItem {
    week: number;
    title: { en: string; vi: string };
    description: { en: string; vi: string };
    highlights: { en: string[]; vi: string[] };
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
    const { t, language } = useLanguage();

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line" />

            {/* Timeline items */}
            <div className="space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.week}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative pl-10"
                    >
                        {/* Timeline dot */}
                        <div
                            className={`timeline-dot ${expandedWeek === item.week ? 'scale-125' : ''} transition-transform`}
                            style={{ top: '1.25rem' }}
                        />

                        {/* Card */}
                        <div
                            className={`
                glass-hover rounded-xl cursor-pointer
                ${expandedWeek === item.week ? 'border-accent-orange/30' : ''}
              `}
                            onClick={() => setExpandedWeek(expandedWeek === item.week ? null : item.week)}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-accent-orange font-mono text-sm font-semibold">
                                        W{String(item.week).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-semibold text-text-primary">
                                        {t(item.title)}
                                    </h3>
                                </div>
                                <button className="text-text-muted hover:text-text-primary transition-colors">
                                    {expandedWeek === item.week ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                            </div>

                            {/* Expanded content */}
                            <motion.div
                                initial={false}
                                animate={{
                                    height: expandedWeek === item.week ? 'auto' : 0,
                                    opacity: expandedWeek === item.week ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 space-y-3">
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {t(item.description)}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.highlights[language].map((highlight, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 text-xs font-medium rounded-full bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
