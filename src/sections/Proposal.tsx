import { motion } from 'framer-motion';
import { Target, Shield, Cloud, Zap } from 'lucide-react';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';

export function Proposal() {
    const { t } = useLanguage();

    const icons = [Target, Shield, Cloud, Zap];

    return (
        <section id="proposal" className="section max-w-5xl mx-auto">
            <SectionHeader
                title={t(content.proposal.title)}
                subtitle={t(content.proposal.subtitle)}
                gradient
            />

            {/* Overview */}
            <GlassCard className="p-8 mb-8" glow="orange">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                    {content.proposal.subtitle.en.split(' - ')[0]}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                    {t(content.proposal.overview)}
                </p>
            </GlassCard>

            {/* Objectives */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                {content.proposal.objectives.map((objective, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="p-6 h-full" glow="cyan">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-accent-orange/10">
                                        <Icon size={24} className="text-accent-orange" />
                                    </div>
                                    <p className="text-text-primary">{t(objective)}</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Architecture Diagram Placeholder */}
            <GlassCard className="p-8 mb-8" glow="orange">
                <h3 className="text-xl font-semibold text-text-primary mb-6">
                    Architecture
                </h3>
                <div className="bg-surface-secondary rounded-xl p-12 border border-white/5 flex items-center justify-center">
                    <div className="text-center">
                        <Cloud size={64} className="mx-auto text-text-muted mb-4" />
                        <p className="text-text-muted text-sm">
                            Architecture diagram placeholder
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* AWS Services */}
            <GlassCard className="p-8" glow="cyan">
                <h3 className="text-xl font-semibold text-text-primary mb-6">
                    AWS Services Used
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {content.proposal.services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-orange/30 transition-colors"
                        >
                            <p className="font-semibold text-accent-orange text-sm mb-1">
                                {service.name}
                            </p>
                            <p className="text-xs text-text-muted">{t(service.purpose)}</p>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>
        </section>
    );
}
