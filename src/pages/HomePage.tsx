import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { profile } from '../data/profile';
import { AnimatedPage } from '../components/AnimatedPage';

import { BookOpen, FileText, Calendar, Presentation, ClipboardCheck, MessageSquare, ChevronRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export function HomePage() {
    const { language } = useLanguage();

    const content = loadContent('home', language);

    const reportSections = [
        {
            path: '/worklog',
            label: { en: '1. Worklog', vi: '1. Nhật Ký' },
            icon: <BookOpen size={24} />
        },
        {
            path: '/proposal',
            label: { en: '2. Proposal', vi: '2. Đề Xuất' },
            icon: <FileText size={24} />
        },
        {
            path: '/events',
            label: { en: '3. Events Participated', vi: '3. Sự Kiện Tham Gia' },
            icon: <Calendar size={24} />
        },
        {
            path: '/workshop',
            label: { en: '4. Workshop', vi: '4. Workshop' },
            icon: <Presentation size={24} />
        },
        {
            path: '/evaluation',
            label: { en: '5. Self-Assessment', vi: '5. Tự Đánh Giá' },
            icon: <ClipboardCheck size={24} />
        },
        {
            path: '/feedback',
            label: { en: '6. Sharing and Feedback', vi: '6. Chia Sẻ và Phản Hồi' },
            icon: <MessageSquare size={24} />
        },
    ];

    return (
        <AnimatedPage>
            <div className="page-container">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="page-title bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {language === 'en' ? 'INTERNSHIP REPORT' : 'BÁO CÁO THỰC TẬP'}
                    </h1>
                    <p className="text-lg text-accent-orange mt-2 font-medium">
                        First Cloud AI Journey @ AWS Vietnam
                    </p>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col gap-12">

                    {/* Top Section: Profile & Info */}
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                        {/* 1. Profile Photo */}
                        <div className="w-full lg:w-1/3 flex-shrink-0">
                            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-accent-orange/30 transition-transform hover:scale-[1.01] duration-300">
                                <img
                                    src={`${import.meta.env.BASE_URL}profile.png`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* 2. Student Info - Auto Height, No Scrollbar */}
                        <div className="w-full lg:w-2/3">
                            <div className="h-full bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-accent-orange/10 transition-colors duration-500" />
                                <div className="relative z-10">
                                    <MarkdownRenderer content={content} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Report Content Grid */}
                    <div className="flex flex-col gap-6">
                        <SectionHeader
                            icon="default"
                            title={language === 'en' ? 'Report Content' : 'Nội Dung Báo Cáo'}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reportSections.map((section) => (
                                <Link key={section.path} to={section.path} className="group relative overflow-hidden">
                                    <div className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-accent-orange/30 transition-all duration-300 flex items-center gap-4 group-hover:-translate-y-1 h-full">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent-orange/10 group-hover:text-accent-orange transition-colors duration-300 shrink-0">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-accent-orange transition-colors text-base">
                                                {section.label[language]}
                                            </h3>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-accent-orange" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AnimatedPage>
    );
}
