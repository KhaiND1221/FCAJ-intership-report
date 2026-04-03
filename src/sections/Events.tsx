import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Award } from 'lucide-react';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';

export function Events() {
    const { t } = useLanguage();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <section id="events" className="section max-w-5xl mx-auto">
            <SectionHeader
                title={t(content.events.title)}
                subtitle={t(content.events.subtitle)}
                gradient
            />

            <div className="grid md:grid-cols-2 gap-6">
                {content.events.list.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard className="p-6 h-full" glow="orange">
                            {/* Event title */}
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                {t(event.name)}
                            </h3>

                            {/* Meta info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Calendar size={14} className="text-accent-orange" />
                                    {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <MapPin size={14} className="text-accent-cyan" />
                                    {t(event.location)}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={14} className="text-accent-orange" />
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.role.en === 'Presenter' || event.role.en === 'Speaker'
                                                ? 'bg-accent-orange/20 text-accent-orange'
                                                : 'bg-accent-cyan/20 text-accent-cyan'
                                            }`}
                                    >
                                        {t(event.role)}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-text-muted leading-relaxed">
                                {t(event.description)}
                            </p>

                            {/* Highlight badge for speaker roles */}
                            {(event.role.en === 'Presenter' || event.role.en === 'Speaker') && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-accent-orange">
                                    <Award size={14} />
                                    <span>Speaking Role</span>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
