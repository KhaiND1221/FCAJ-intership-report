import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useParams } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';
import { loadWorkshopSection, loadWorkshopIndex } from '../utils/contentLoader';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ChevronRight } from 'lucide-react';

// ─── Workshop Section Tree ────────────────────────────────────────────────────

interface WorkshopSection {
    id: string;
    folderName: string;
    en: string;
    vi: string;
    children?: WorkshopSection[];
}

const WORKSHOP_SECTIONS: WorkshopSection[] = [
    {
        id: '4.1-Workshop-overview',
        folderName: '4.1-Workshop-overview',
        en: '4.1 Overview',
        vi: '4.1 Tổng Quan',
    },
    {
        id: '4.2-Prerequiste',
        folderName: '4.2-Prerequiste',
        en: '4.2 Prerequisites',
        vi: '4.2 Điều Kiện Tiên Quyết',
    },
    {
        id: '4.3-Foundation-Setup',
        folderName: '4.3-Foundation-Setup',
        en: '4.3 Foundation Setup',
        vi: '4.3 Thiết Lập Nền Tảng',
        children: [
            { id: '4.3.1-Amplify-Init', folderName: '4.3-Foundation-Setup/4.3.1-Amplify-Init', en: '4.3.1 Amplify Gen 2', vi: '4.3.1 Khởi tạo Amplify' },
            { id: '4.3.2-Cognito-Auth', folderName: '4.3-Foundation-Setup/4.3.2-Cognito-Auth', en: '4.3.2 Cognito Auth', vi: '4.3.2 Xác thực Cognito' },
            { id: '4.3.3-S3-Storage', folderName: '4.3-Foundation-Setup/4.3.3-S3-Storage', en: '4.3.3 S3 Storage', vi: '4.3.3 Lưu Trữ S3' }
        ]
    },
    {
        id: '4.4-Monitoring-Setup',
        folderName: '4.4-Monitoring-Setup',
        en: '4.4 Data Layer',
        vi: '4.4 Tầng Dữ Liệu',
        children: [
            { id: '4.4.1-AppSync', folderName: '4.4-Monitoring-Setup/4.4.1-AppSync', en: '4.4.1 AppSync GraphQL', vi: '4.4.1 Schema AppSync' },
            { id: '4.4.2-DynamoDB', folderName: '4.4-Monitoring-Setup/4.4.2-DynamoDB', en: '4.4.2 DynamoDB Tables', vi: '4.4.2 Bảng DynamoDB' }
        ]
    },
    {
        id: '4.5-Processing-Setup',
        folderName: '4.5-Processing-Setup',
        en: '4.5 Compute & AI',
        vi: '4.5 Compute & AI',
        children: [
            { id: '4.5.1-Bedrock', folderName: '4.5-Processing-Setup/4.5.1-Bedrock', en: '4.5.1 Bedrock Qwen3-VL', vi: '4.5.1 Bedrock Qwen3-VL' },
            { id: '4.5.2-AIEngine', folderName: '4.5-Processing-Setup/4.5.2-AIEngine', en: '4.5.2 aiEngine Lambda', vi: '4.5.2 Lambda aiEngine' },
            { id: '4.5.3-ProcessNutrition', folderName: '4.5-Processing-Setup/4.5.3-ProcessNutrition', en: '4.5.3 processNutrition Lambda', vi: '4.5.3 Lambda processNutrition' },
            { id: '4.5.4-ResizeImage', folderName: '4.5-Processing-Setup/4.5.4-ResizeImage', en: '4.5.4 resizeImage Lambda', vi: '4.5.4 Lambda resizeImage' }
        ]
    },
    {
        id: '4.6-Automation-Setup',
        folderName: '4.6-Automation-Setup',
        en: '4.6 API & Social',
        vi: '4.6 API & Xã Hội',
        children: [
            { id: '4.6.1-FriendRequest', folderName: '4.6-Automation-Setup/4.6.1-FriendRequest', en: '4.6.1 friendRequest Lambda', vi: '4.6.1 Lambda friendRequest' },
            { id: '4.6.2-Realtime-Subscriptions', folderName: '4.6-Automation-Setup/4.6.2-Realtime-Subscriptions', en: '4.6.2 Realtime Subscriptions', vi: '4.6.2 Subscriptions Thời Gian Thực' }
        ]
    },
    {
        id: '4.7-Dashboard-Setup',
        folderName: '4.7-Dashboard-Setup',
        en: '4.7 Frontend',
        vi: '4.7 Frontend',
        children: [
            { id: '4.7.1-ReactNative', folderName: '4.7-Dashboard-Setup/4.7.1-ReactNative', en: '4.7.1 Expo Setup', vi: '4.7.1 Thiết lập Expo' },
            { id: '4.7.2-UIComponents', folderName: '4.7-Dashboard-Setup/4.7.2-UIComponents', en: '4.7.2 UI Components', vi: '4.7.2 Giao diện UI' },
            { id: '4.7.3-Voice-Camera', folderName: '4.7-Dashboard-Setup/4.7.3-Voice-Camera', en: '4.7.3 Voice & Camera', vi: '4.7.3 Giọng Nói & Camera' }
        ]
    },
    {
        id: '4.8-Verify-Setup',
        folderName: '4.8-Verify-Setup',
        en: '4.8 ECS Deployment',
        vi: '4.8 Triển Khai ECS',
        children: [
            { id: '4.8.1-VPC-ECR', folderName: '4.8-Verify-Setup/4.8.1-VPC-ECR', en: '4.8.1 VPC & ECR', vi: '4.8.1 VPC & ECR' },
            { id: '4.8.2-Fargate-ALB', folderName: '4.8-Verify-Setup/4.8.2-Fargate-ALB', en: '4.8.2 Fargate & ALB', vi: '4.8.2 Fargate & ALB' }
        ]
    },
    {
        id: '4.9-Use-CDK',
        folderName: '4.9-Use-CDK',
        en: '4.9 CI/CD',
        vi: '4.9 CI/CD',
    },
    {
        id: '4.10-Cleanup',
        folderName: '4.10-Cleanup',
        en: '4.10 Cleanup',
        vi: '4.10 Dọn Dẹp',
    },
    {
        id: '4.11-Appendices',
        folderName: '4.11-Appendices',
        en: '4.11 Appendices',
        vi: '4.11 Phụ Lục',
        children: [
            { id: '4.11.1-Budget-Breakdown', folderName: '4.11-Appendices/4.11.1-Budget-Breakdown', en: '4.11.1 Budget Breakdown', vi: '4.11.1 Chi Tiết Ngân Sách' },
            { id: '4.11.2-IAM-Policies', folderName: '4.11-Appendices/4.11.2-IAM-Policies', en: '4.11.2 IAM Policies', vi: '4.11.2 IAM Policies' },
            { id: '4.11.3-Troubleshooting', folderName: '4.11-Appendices/4.11.3-Troubleshooting', en: '4.11.3 Troubleshooting', vi: '4.11.3 Xử Lý Lỗi' },
            { id: '4.11.4-Prompt-Templates', folderName: '4.11-Appendices/4.11.4-Prompt-Templates', en: '4.11.4 Prompt Templates', vi: '4.11.4 Prompt Templates' }
        ]
    },
];

// ─── Flat map for quick lookup by route id ────────────────────────────────────
function flattenSections(sections: WorkshopSection[]): Map<string, WorkshopSection> {
    const map = new Map<string, WorkshopSection>();
    for (const s of sections) {
        map.set(s.id, s);
        if (s.children) {
            for (const c of s.children) map.set(c.id, c);
        }
    }
    return map;
}
const SECTION_MAP = flattenSections(WORKSHOP_SECTIONS);

// ─── Workshop Main Page ───────────────────────────────────────────────────────

export function WorkshopPage() {
    const { language } = useLanguage();
    const content = loadWorkshopIndex(language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: 'Workshop' }]} />
                <SectionHeader icon="workshop" title={language === 'en' ? 'Technical Workshop' : 'Workshop Kỹ Thuật'} />

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm mt-6">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
}

// ─── Workshop Section Page (dynamic) ─────────────────────────────────────────

export function WorkshopSectionPage() {
    const { language } = useLanguage();
    const params = useParams<{ sectionId: string; subId?: string }>();

    // Build compound key from URL params
    const routeId = params.subId
        ? `${params.sectionId}/${params.subId}`
        : params.sectionId ?? '';

    const sectionMeta = SECTION_MAP.get(routeId);
    const folderName = sectionMeta?.folderName ?? routeId;

    const content = loadWorkshopSection(folderName, language);

    // Breadcrumb
    const parentId = params.subId ? params.sectionId : undefined;
    const parentMeta = parentId ? SECTION_MAP.get(parentId) : undefined;
    const crumbs = [
        { label: 'Workshop', path: '/workshop' },
        ...(parentMeta ? [{ label: language === 'en' ? parentMeta.en : parentMeta.vi, path: `/workshop/${parentId}` }] : []),
        { label: sectionMeta ? (language === 'en' ? sectionMeta.en : sectionMeta.vi) : routeId },
    ];

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={crumbs} />
                <SectionHeader icon="workshop" title={sectionMeta ? (language === 'en' ? sectionMeta.en : sectionMeta.vi) : routeId} />

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm mt-6">
                    <MarkdownRenderer content={content} />
                </div>

                {/* Child section links if this section has children */}
                {sectionMeta?.children && sectionMeta.children.length > 0 && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm mt-6">
                        <h3 className="section-title mb-4">{language === 'en' ? 'Sub-sections' : 'Các Mục Con'}</h3>
                        <ul className="space-y-3">
                            {sectionMeta.children.map((child, i) => (
                                <li key={child.id}>
                                    <Link
                                        to={`/workshop/${child.id}`}
                                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent-orange/30 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-accent-orange font-mono text-sm font-semibold group-hover:bg-accent-orange group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-gray-700 group-hover:text-accent-orange transition-colors">
                                            {language === 'en' ? child.en : child.vi}
                                        </span>
                                        <ChevronRight size={18} className="ml-auto text-gray-400 group-hover:text-accent-orange transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
}

// ─── Legacy exports (kept for backward compatibility) ─────────────────────────
export { WorkshopPage as WorkshopOverviewPage };
export { WorkshopSectionPage as WorkshopSetupPage };
export { WorkshopSectionPage as WorkshopImplementationPage };
export { WorkshopSectionPage as WorkshopCleanupPage };
