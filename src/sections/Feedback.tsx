import { motion } from 'framer-motion';
import { Heart, Star, Lightbulb, ThumbsUp, Quote } from 'lucide-react';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';

export function Feedback() {
    const { t, language } = useLanguage();

    const feedbackItems = [
        {
            icon: Heart,
            title: { en: 'Feelings', vi: 'Cảm nhận' },
            content: content.feedback.feeling,
            color: 'text-pink-400',
            bg: 'bg-pink-400/10',
        },
        {
            icon: Star,
            title: { en: 'Satisfaction', vi: 'Mức độ hài lòng' },
            content: content.feedback.satisfaction,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
        },
        {
            icon: Lightbulb,
            title: { en: 'Areas for Improvement', vi: 'Cải thiện' },
            content: content.feedback.improvement,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            icon: ThumbsUp,
            title: { en: 'Recommendation', vi: 'Giới thiệu' },
            content: content.feedback.recommend,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
        },
    ];

    return (
        <section id="feedback" className="section max-w-5xl mx-auto pb-32">
            <SectionHeader
                title={t(content.feedback.title)}
                subtitle={t(content.feedback.subtitle)}
                gradient
            />

            {/* Featured Quote */}
            <GlassCard className="p-8 mb-8 relative overflow-visible" glow="orange">
                <Quote
                    size={48}
                    className="absolute -top-4 -left-4 text-accent-orange/20"
                />
                <p className="text-xl text-text-primary leading-relaxed italic">
                    {t(content.feedback.feeling)}
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-orange to-yellow-400 flex items-center justify-center">
                        <span className="text-sm font-bold text-surface-primary">KHAI</span>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary text-sm">
                            Nguyen Dinh Khai
                        </p>
                        <p className="text-xs text-text-muted">FCJ Intern 2026</p>
                    </div>
                </div>
            </GlassCard>

            {/* Feedback Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {feedbackItems.slice(1).map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="p-6 h-full" glow="cyan">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${item.bg}`}>
                                        <Icon size={20} className={item.color} />
                                    </div>
                                    <h3 className="font-semibold text-text-primary">
                                        {item.title[language]}
                                    </h3>
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {t(item.content)}
                                </p>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
            >
                <div className="inline-flex items-center gap-4 p-6 rounded-2xl glass">
                    <img
                        src="./FCJ-logo.png"
                        alt="FCJ Logo"
                        className="h-12 object-contain"
                    />
                    <div className="h-8 w-px bg-white/20" />
                    <img
                        src="./NeuraX_logo_white.png"
                        alt="NeuraX Logo"
                        className="h-8 object-contain"
                    />
                </div>
                <p className="mt-6 text-text-muted text-sm">
                    {language === 'en'
                        ? '© 2026 Nguyen Dinh Khai. First Cloud AI Journey Internship Report.'
                        : '© 2026 Nguyen Dinh Khai. Báo cáo Thực tập First Cloud AI Journey.'}
                </p>
            </motion.div>
        </section>
    );
}
