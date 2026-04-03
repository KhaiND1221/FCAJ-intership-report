import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, MapPin, User } from 'lucide-react';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';
import { loadEvents } from '../utils/eventLoader';

export function EventsPage() {
    const { language } = useLanguage();

    // Load events from Markdown files
    const events = loadEvents(language);

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[{ label: language === 'en' ? 'Events Participated' : 'Sự Kiện Tham Gia' }]}
                />

                <SectionHeader icon="events" title={language === 'en' ? 'EVENTS PARTICIPATED' : 'SỰ KIỆN THAM GIA'} />

                <div className="space-y-8 mt-6">
                    {events.map((event, index) => (
                        <div key={event.id} className="card-static">
                            <h2 className="section-title">
                                {language === 'en' ? `Event ${index + 1}: ` : `Sự kiện ${index + 1}: `}
                                {event.title}
                            </h2>

                            {/* Event Details Table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="content-table">
                                    <tbody>
                                        <tr>
                                            <td className="font-medium w-32 bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-accent-orange" />
                                                    {language === 'en' ? 'Time' : 'Thời gian'}
                                                </div>
                                            </td>
                                            <td>{formatDate(event.date)}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-accent-orange" />
                                                    {language === 'en' ? 'Location' : 'Địa điểm'}
                                                </div>
                                            </td>
                                            <td>{event.location}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-accent-orange" />
                                                    {language === 'en' ? 'Role' : 'Vai trò'}
                                                </div>
                                            </td>
                                            <td>{event.role}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Main Content */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-text-primary mb-2">
                                    {language === 'en' ? 'Main Content' : 'Nội dung chính'}
                                </h3>
                                <div className="text-text-secondary whitespace-pre-line">
                                    {event.content}
                                </div>
                            </div>

                            {/* Key Takeaways */}
                            <div>
                                <h3 className="font-semibold text-text-primary mb-2">
                                    {language === 'en' ? 'Key Takeaways / Personal Contributions' : 'Bài học / Đóng góp cá nhân'}
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-text-secondary">
                                    {event.takeaways.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
}
