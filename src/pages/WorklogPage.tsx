import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';

// Worklog overview page - links to individual weeks
export function WorklogPage() {
    const { language } = useLanguage();

    const weeks = [
        { week: 1, task: { en: 'Getting familiar with AWS and basic AWS services', vi: 'Làm quen với AWS và các dịch vụ cơ bản' } },
        { week: 2, task: { en: 'Doing task A...', vi: 'Thực hiện task A...' } },
        { week: 3, task: { en: 'Doing task B...', vi: 'Thực hiện task B...' } },
        { week: 4, task: { en: 'Doing task C...', vi: 'Thực hiện task C...' } },
        { week: 5, task: { en: 'Doing task D...', vi: 'Thực hiện task D...' } },
        { week: 6, task: { en: 'Doing task E...', vi: 'Thực hiện task E...' } },
        { week: 7, task: { en: 'Doing task G...', vi: 'Thực hiện task G...' } },
        { week: 8, task: { en: 'Doing task H...', vi: 'Thực hiện task H...' } },
        { week: 9, task: { en: 'Doing task I...', vi: 'Thực hiện task I...' } },
        { week: 10, task: { en: 'Doing task L...', vi: 'Thực hiện task L...' } },
        { week: 11, task: { en: 'Doing task M...', vi: 'Thực hiện task M...' } },
        { week: 12, task: { en: 'Doing task N...', vi: 'Thực hiện task N...' } },
    ];

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: 'Worklog' }]} />

                <SectionHeader icon="worklog" title="WORKLOG" />

                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm mb-12">
                    <p className="text-text-secondary mb-6 text-lg leading-relaxed">
                        {language === 'en'
                            ? 'On this page, you will need to introduce your worklog. How did you complete it? How many weeks did you take to complete the program? What did you do in those weeks?'
                            : 'Trên trang này, bạn cần giới thiệu nhật ký làm việc của mình. Bạn đã hoàn thành nó như thế nào? Bạn mất bao nhiêu tuần để hoàn thành chương trình? Bạn đã làm gì trong những tuần đó?'}
                    </p>

                    <p className="text-text-secondary text-lg leading-relaxed">
                        {language === 'en'
                            ? 'Typically, and as a standard, a worklog is carried out over about 3 months (throughout the internship period) with weekly contents as follows:'
                            : 'Thông thường, và theo tiêu chuẩn, nhật ký làm việc được thực hiện trong khoảng 3 tháng (suốt thời gian thực tập) với nội dung hàng tuần như sau:'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {weeks.map((item) => (
                        <Link
                            key={item.week}
                            to={`/worklog/week-${item.week}`}
                            className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Decorative Background Icon */}
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                </svg>
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="week-badge">
                                        {item.week}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-accent-orange group-hover:bg-accent-orange group-hover:text-white transition-colors duration-300">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-accent-orange transition-colors">
                                    {language === 'en' ? `Week ${item.week}` : `Tuần ${item.week}`}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                    {item.task[language]}
                                </p>

                                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-accent-orange opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    {language === 'en' ? 'View Details' : 'Xem Chi Tiết'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
}

// Individual week page - loads from Markdown
export function WeekWorklogPage({ weekNumber }: { weekNumber: number }) {
    const { language } = useLanguage();

    // Load markdown content for this week
    const formattedWeekNumber = weekNumber < 10 ? `0${weekNumber}` : `${weekNumber}`;
    const content = loadContent(`worklog/week-${formattedWeekNumber}`, language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: 'Worklog', path: '/worklog' },
                        { label: `${language === 'en' ? 'Week' : 'Tuần'} ${weekNumber}` },
                    ]}
                />

                <SectionHeader
                    icon="worklog"
                    title={language === 'en' ? `WEEK ${weekNumber} WORKLOG` : `NHẬT KÝ TUẦN ${weekNumber}`}
                />

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
}

// Export individual week pages
export function Week1Page() { return <WeekWorklogPage weekNumber={1} />; }
export function Week2Page() { return <WeekWorklogPage weekNumber={2} />; }
export function Week3Page() { return <WeekWorklogPage weekNumber={3} />; }
export function Week4Page() { return <WeekWorklogPage weekNumber={4} />; }
export function Week5Page() { return <WeekWorklogPage weekNumber={5} />; }
export function Week6Page() { return <WeekWorklogPage weekNumber={6} />; }
export function Week7Page() { return <WeekWorklogPage weekNumber={7} />; }
export function Week8Page() { return <WeekWorklogPage weekNumber={8} />; }
export function Week9Page() { return <WeekWorklogPage weekNumber={9} />; }
export function Week10Page() { return <WeekWorklogPage weekNumber={10} />; }
export function Week11Page() { return <WeekWorklogPage weekNumber={11} />; }
export function Week12Page() { return <WeekWorklogPage weekNumber={12} />; }
