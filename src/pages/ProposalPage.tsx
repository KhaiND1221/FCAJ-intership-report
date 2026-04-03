import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';

export function ProposalPage() {
    const { language } = useLanguage();

    // Load markdown content based on language
    const content = loadContent('proposal', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[{ label: language === 'en' ? 'Proposal' : 'Đề Xuất' }]}
                />

                <SectionHeader icon="proposal" title="PROPOSAL" />

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
}
