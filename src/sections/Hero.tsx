import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { profile } from '../data/profile';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';

export function Hero() {
    const { t } = useLanguage();

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-8"
        >
            {/* Background gradient orbs */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Profile Image Placeholder */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-8"
                >
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent-orange to-accent-cyan p-1">
                        <div className="w-full h-full rounded-full bg-surface-secondary flex items-center justify-center">
                            <span className="text-4xl font-bold gradient-text">
                                {profile.nickname.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Greeting */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-text-secondary mb-2"
                >
                    {t(content.hero.greeting)}
                </motion.p>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-4xl md:text-6xl font-bold mb-4 gradient-text"
                >
                    {profile.name}
                </motion.h1>

                {/* Role & Company */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6"
                >
                    <p className="text-xl md:text-2xl text-text-primary font-medium">
                        {t(profile.role)}
                    </p>
                    <p className="text-text-secondary">
                        Team {profile.team} @ {t(profile.company)}
                    </p>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-lg text-text-muted max-w-xl mx-auto mb-8"
                >
                    {t(content.hero.tagline)}
                </motion.p>

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-10"
                >
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                        <Calendar size={16} className="text-accent-orange" />
                        <span className="text-sm text-text-secondary">
                            {profile.duration.start} - {profile.duration.end}
                        </span>
                    </div>
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                        <MapPin size={16} className="text-accent-orange" />
                        <span className="text-sm text-text-secondary">
                            {t(profile.university.name)}
                        </span>
                    </div>
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                        <Mail size={16} className="text-accent-orange" />
                        <span className="text-sm text-text-secondary">
                            {profile.contact.email}
                        </span>
                    </div>
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                        <Phone size={16} className="text-accent-orange" />
                        <span className="text-sm text-text-secondary">
                            {profile.contact.phone}
                        </span>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        document.getElementById('worklog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-accent-orange to-yellow-500 text-surface-primary font-semibold rounded-xl shadow-glow-orange hover:shadow-lg transition-all duration-300"
                >
                    {t(content.hero.cta)}
                </motion.button>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="text-text-muted"
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
