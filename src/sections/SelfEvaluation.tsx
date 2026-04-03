import { motion } from 'framer-motion';
import { Star, TrendingUp, Minus } from 'lucide-react';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';

export function SelfEvaluation() {
    const { t, language } = useLanguage();

    const getRatingIcon = (rating: string) => {
        switch (rating) {
            case 'good':
                return { icon: Star, color: 'text-green-400', bg: 'bg-green-400/10' };
            case 'fair':
                return { icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
            default:
                return { icon: Minus, color: 'text-gray-400', bg: 'bg-gray-400/10' };
        }
    };

    const getRatingLabel = (rating: string) => {
        const labels = {
            good: { en: 'Good', vi: 'Tốt' },
            fair: { en: 'Fair', vi: 'Khá' },
            average: { en: 'Average', vi: 'Trung bình' },
        };
        return labels[rating as keyof typeof labels]?.[language] || rating;
    };

    return (
        <section id="evaluation" className="section max-w-5xl mx-auto">
            <SectionHeader
                title={t(content.evaluation.title)}
                subtitle={t(content.evaluation.subtitle)}
                gradient
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {['good', 'fair', 'average'].map((rating) => {
                    const count = content.evaluation.criteria.filter(
                        (c) => c.rating === rating
                    ).length;
                    const { icon: Icon, color, bg } = getRatingIcon(rating);
                    return (
                        <GlassCard key={rating} className="p-4 text-center">
                            <div className={`inline-flex p-3 rounded-xl ${bg} mb-2`}>
                                <Icon size={20} className={color} />
                            </div>
                            <p className="text-2xl font-bold text-text-primary">{count}</p>
                            <p className={`text-sm ${color}`}>{getRatingLabel(rating)}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Criteria Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {content.evaluation.criteria.map((criterion, index) => {
                    const { icon: Icon, color, bg } = getRatingIcon(criterion.rating);
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard className="p-5 h-full" glow="orange">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-text-primary">
                                        {t(criterion.name)}
                                    </h3>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg}`}>
                                        <Icon size={14} className={color} />
                                        <span className={`text-xs font-medium ${color}`}>
                                            {getRatingLabel(criterion.rating)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {t(criterion.comment)}
                                </p>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
