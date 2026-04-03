import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:border-accent-orange/30 transition-all duration-200"
            title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
        >
            <Languages size={18} className="text-accent-orange" />
            <span className="text-sm font-medium">
                {language === 'en' ? 'EN' : 'VI'}
            </span>
        </motion.button>
    );
}
