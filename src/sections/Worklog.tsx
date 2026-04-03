import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Timeline } from '../components/ui/Timeline';

export function Worklog() {
    const { t } = useLanguage();

    return (
        <section id="worklog" className="section max-w-4xl mx-auto">
            <SectionHeader
                title={t(content.worklog.title)}
                subtitle={t(content.worklog.subtitle)}
                gradient
            />

            <Timeline items={content.worklog.weeks} />
        </section>
    );
}
