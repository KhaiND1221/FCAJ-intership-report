import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';

export function FeedbackPage() {
    const { language } = useLanguage();

    // Load markdown content based on language  
    const content = loadContent('feedback', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[{ label: language === 'en' ? 'Sharing and Feedback' : 'Chia Sẻ và Phản Hồi' }]}
                />

                <SectionHeader
                    icon="feedback"
                    title={language === 'en' ? 'SHARING AND FEEDBACK' : 'CHIA SẺ VÀ PHẢN HỒI'}
                />

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <MarkdownRenderer content={content} />
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <div className="flex justify-center items-center gap-6 mb-4">
                        <img src="./FCJ-logo.png" alt="FCJ" className="h-10" />
                    </div>
                    <p className="text-text-muted text-sm">
                        © 2026 Nguyen Dinh Khai. First Cloud AI Journey Internship Report.
                    </p>
                </div>
            </div>
        </AnimatedPage>
    );
}
