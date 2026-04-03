export type Language = 'en' | 'vi';

export interface BilingualText {
    en: string;
    vi: string;
}

export const content = {
    hero: {
        greeting: {
            en: 'Hello, I\'m',
            vi: 'Xin chào, tôi là',
        },
        tagline: {
            en: 'Building the future of Cloud AI at AWS Vietnam',
            vi: 'Xây dựng tương lai của Cloud AI tại AWS Việt Nam',
        },
        cta: {
            en: 'View My Journey',
            vi: 'Xem Hành Trình',
        },
    },
    worklog: {
        title: {
            en: 'Weekly Worklog',
            vi: 'Nhật Ký Công Việc',
        },
        subtitle: {
            en: '12 weeks of intensive learning and building',
            vi: '12 tuần học tập và xây dựng chuyên sâu',
        },
        weeks: [
            {
                week: 1,
                title: { en: 'Onboarding & Setup', vi: 'Tiếp nhận & Cài đặt' },
                description: {
                    en: 'Completed AWS environment setup, met the NeuraX team, and familiarized with internal tools and processes.',
                    vi: 'Hoàn thành cài đặt môi trường AWS, gặp gỡ đội NeuraX và làm quen với các công cụ, quy trình nội bộ.',
                },
                highlights: { en: ['AWS Account Setup', 'Team Introduction', 'Development Environment'], vi: ['Cài đặt tài khoản AWS', 'Giới thiệu đội', 'Môi trường phát triển'] },
            },
            {
                week: 2,
                title: { en: 'Cloud Fundamentals', vi: 'Nền tảng Cloud' },
                description: {
                    en: 'Deep dive into AWS core services: EC2, S3, Lambda. Started working on initial project requirements.',
                    vi: 'Tìm hiểu sâu về các dịch vụ AWS cốt lõi: EC2, S3, Lambda. Bắt đầu làm việc với yêu cầu dự án ban đầu.',
                },
                highlights: { en: ['EC2 & S3 Mastery', 'Lambda Functions', 'Project Scoping'], vi: ['Thành thạo EC2 & S3', 'Lambda Functions', 'Định phạm vi dự án'] },
            },
            {
                week: 3,
                title: { en: 'Architecture Design', vi: 'Thiết kế Kiến trúc' },
                description: {
                    en: 'Designed the initial system architecture for NeuraX Shield. Created architecture diagrams and documentation.',
                    vi: 'Thiết kế kiến trúc hệ thống ban đầu cho NeuraX Shield. Tạo sơ đồ kiến trúc và tài liệu.',
                },
                highlights: { en: ['System Design', 'Architecture Diagrams', 'Technical Documentation'], vi: ['Thiết kế hệ thống', 'Sơ đồ kiến trúc', 'Tài liệu kỹ thuật'] },
            },
            {
                week: 4,
                title: { en: 'Backend Development', vi: 'Phát triển Backend' },
                description: {
                    en: 'Started implementing the backend services using AWS Lambda and API Gateway.',
                    vi: 'Bắt đầu triển khai các dịch vụ backend sử dụng AWS Lambda và API Gateway.',
                },
                highlights: { en: ['API Gateway', 'Lambda Integration', 'DynamoDB Setup'], vi: ['API Gateway', 'Tích hợp Lambda', 'Cài đặt DynamoDB'] },
            },
            {
                week: 5,
                title: { en: 'AI/ML Integration', vi: 'Tích hợp AI/ML' },
                description: {
                    en: 'Integrated machine learning models with AWS SageMaker for threat detection capabilities.',
                    vi: 'Tích hợp các mô hình học máy với AWS SageMaker cho khả năng phát hiện mối đe dọa.',
                },
                highlights: { en: ['SageMaker Setup', 'Model Deployment', 'Inference Pipeline'], vi: ['Cài đặt SageMaker', 'Triển khai mô hình', 'Pipeline suy luận'] },
            },
            {
                week: 6,
                title: { en: 'Security Implementation', vi: 'Triển khai Bảo mật' },
                description: {
                    en: 'Implemented IAM policies, security groups, and encryption for the platform.',
                    vi: 'Triển khai các chính sách IAM, nhóm bảo mật và mã hóa cho nền tảng.',
                },
                highlights: { en: ['IAM Policies', 'VPC Security', 'Data Encryption'], vi: ['Chính sách IAM', 'Bảo mật VPC', 'Mã hóa dữ liệu'] },
            },
            {
                week: 7,
                title: { en: 'Frontend Development', vi: 'Phát triển Frontend' },
                description: {
                    en: 'Built the dashboard interface for monitoring and managing the security platform.',
                    vi: 'Xây dựng giao diện dashboard để giám sát và quản lý nền tảng bảo mật.',
                },
                highlights: { en: ['React Dashboard', 'Real-time Monitoring', 'Data Visualization'], vi: ['Dashboard React', 'Giám sát thời gian thực', 'Trực quan hóa dữ liệu'] },
            },
            {
                week: 8,
                title: { en: 'Testing & QA', vi: 'Kiểm thử & QA' },
                description: {
                    en: 'Comprehensive testing including unit tests, integration tests, and security audits.',
                    vi: 'Kiểm thử toàn diện bao gồm unit test, integration test và audit bảo mật.',
                },
                highlights: { en: ['Unit Testing', 'Integration Tests', 'Security Audits'], vi: ['Unit Testing', 'Integration Tests', 'Audit bảo mật'] },
            },
            {
                week: 9,
                title: { en: 'Performance Optimization', vi: 'Tối ưu Hiệu suất' },
                description: {
                    en: 'Optimized system performance, reduced latency, and improved cost efficiency.',
                    vi: 'Tối ưu hiệu suất hệ thống, giảm độ trễ và cải thiện hiệu quả chi phí.',
                },
                highlights: { en: ['Latency Reduction', 'Cost Optimization', 'Caching Strategies'], vi: ['Giảm độ trễ', 'Tối ưu chi phí', 'Chiến lược cache'] },
            },
            {
                week: 10,
                title: { en: 'Documentation', vi: 'Tài liệu' },
                description: {
                    en: 'Created comprehensive documentation for the project including API docs and user guides.',
                    vi: 'Tạo tài liệu toàn diện cho dự án bao gồm tài liệu API và hướng dẫn người dùng.',
                },
                highlights: { en: ['API Documentation', 'User Guides', 'Architecture Docs'], vi: ['Tài liệu API', 'Hướng dẫn người dùng', 'Tài liệu kiến trúc'] },
            },
            {
                week: 11,
                title: { en: 'Deployment & CI/CD', vi: 'Triển khai & CI/CD' },
                description: {
                    en: 'Set up CI/CD pipelines and deployed the application to production environment.',
                    vi: 'Thiết lập pipeline CI/CD và triển khai ứng dụng lên môi trường production.',
                },
                highlights: { en: ['CodePipeline', 'Production Deployment', 'Monitoring Setup'], vi: ['CodePipeline', 'Triển khai Production', 'Thiết lập giám sát'] },
            },
            {
                week: 12,
                title: { en: 'Final Review & Handover', vi: 'Đánh giá & Bàn giao' },
                description: {
                    en: 'Final project review, knowledge transfer sessions, and internship conclusion.',
                    vi: 'Đánh giá dự án cuối cùng, các buổi chuyển giao kiến thức và kết thúc thực tập.',
                },
                highlights: { en: ['Project Presentation', 'Knowledge Transfer', 'Final Report'], vi: ['Thuyết trình dự án', 'Chuyển giao kiến thức', 'Báo cáo cuối cùng'] },
            },
        ],
    },
    proposal: {
        title: {
            en: 'Project Proposal',
            vi: 'Đề Xuất Dự Án',
        },
        subtitle: {
            en: 'NeuraX Shield - AI-Powered Cloud Security Platform',
            vi: 'NeuraX Shield - Nền tảng Bảo mật Cloud được Hỗ trợ bởi AI',
        },
        overview: {
            en: 'NeuraX Shield is an intelligent cloud security platform that leverages AI/ML to detect, analyze, and respond to security threats in real-time across AWS infrastructure.',
            vi: 'NeuraX Shield là nền tảng bảo mật cloud thông minh sử dụng AI/ML để phát hiện, phân tích và phản hồi các mối đe dọa bảo mật theo thời gian thực trên hạ tầng AWS.',
        },
        objectives: [
            {
                en: 'Real-time threat detection using machine learning models',
                vi: 'Phát hiện mối đe dọa thời gian thực sử dụng mô hình học máy',
            },
            {
                en: 'Automated incident response and remediation',
                vi: 'Phản hồi sự cố tự động và khắc phục',
            },
            {
                en: 'Comprehensive security dashboard with analytics',
                vi: 'Dashboard bảo mật toàn diện với phân tích',
            },
            {
                en: 'Cost-effective serverless architecture',
                vi: 'Kiến trúc serverless tiết kiệm chi phí',
            },
        ],
        services: [
            { name: 'AWS Lambda', purpose: { en: 'Serverless compute', vi: 'Tính toán serverless' } },
            { name: 'Amazon SageMaker', purpose: { en: 'ML model hosting', vi: 'Lưu trữ mô hình ML' } },
            { name: 'Amazon DynamoDB', purpose: { en: 'NoSQL database', vi: 'Cơ sở dữ liệu NoSQL' } },
            { name: 'Amazon API Gateway', purpose: { en: 'API management', vi: 'Quản lý API' } },
            { name: 'Amazon CloudWatch', purpose: { en: 'Monitoring & logging', vi: 'Giám sát & ghi log' } },
            { name: 'AWS IAM', purpose: { en: 'Access management', vi: 'Quản lý truy cập' } },
        ],
    },
    events: {
        title: {
            en: 'Events Participated',
            vi: 'Sự Kiện Tham Gia',
        },
        subtitle: {
            en: 'Workshops and seminars during the internship',
            vi: 'Các workshop và hội thảo trong quá trình thực tập',
        },
        list: [
            {
                name: { en: 'AWS Cloud Practitioner Workshop', vi: 'Workshop AWS Cloud Practitioner' },
                date: '2026-01-15',
                location: { en: 'AWS Office, HCMC', vi: 'Văn phòng AWS, TP.HCM' },
                role: { en: 'Participant', vi: 'Người tham gia' },
                description: { en: 'Comprehensive introduction to AWS cloud services and best practices.', vi: 'Giới thiệu toàn diện về các dịch vụ AWS cloud và best practices.' },
            },
            {
                name: { en: 'AI/ML on AWS Bootcamp', vi: 'Bootcamp AI/ML trên AWS' },
                date: '2026-02-01',
                location: { en: 'Virtual', vi: 'Trực tuyến' },
                role: { en: 'Participant', vi: 'Người tham gia' },
                description: { en: 'Hands-on training with SageMaker, Bedrock, and other AI services.', vi: 'Đào tạo thực hành với SageMaker, Bedrock và các dịch vụ AI khác.' },
            },
            {
                name: { en: 'Security Best Practices Seminar', vi: 'Hội thảo Best Practices Bảo mật' },
                date: '2026-02-20',
                location: { en: 'AWS Office, HCMC', vi: 'Văn phòng AWS, TP.HCM' },
                role: { en: 'Presenter', vi: 'Diễn giả' },
                description: { en: 'Presented NeuraX Shield architecture and security implementation strategies.', vi: 'Trình bày kiến trúc NeuraX Shield và chiến lược triển khai bảo mật.' },
            },
            {
                name: { en: 'FCJ Community Meetup', vi: 'Họp mặt Cộng đồng FCJ' },
                date: '2026-03-10',
                location: { en: 'Tech Hub, HCMC', vi: 'Tech Hub, TP.HCM' },
                role: { en: 'Speaker', vi: 'Diễn giả' },
                description: { en: 'Shared internship experience and project learnings with the FCJ community.', vi: 'Chia sẻ kinh nghiệm thực tập và bài học dự án với cộng đồng FCJ.' },
            },
        ],
    },
    workshop: {
        title: {
            en: 'Technical Workshop',
            vi: 'Workshop Kỹ Thuật',
        },
        subtitle: {
            en: 'Step-by-step guide to building NeuraX Shield',
            vi: 'Hướng dẫn từng bước xây dựng NeuraX Shield',
        },
        toc: [
            { id: 'overview', label: { en: 'Overview', vi: 'Tổng quan' } },
            { id: 'prerequisites', label: { en: 'Prerequisites', vi: 'Điều kiện tiên quyết' } },
            { id: 'architecture', label: { en: 'Architecture', vi: 'Kiến trúc' } },
            { id: 'step1', label: { en: 'Step 1: Setup', vi: 'Bước 1: Cài đặt' } },
            { id: 'step2', label: { en: 'Step 2: Lambda', vi: 'Bước 2: Lambda' } },
            { id: 'step3', label: { en: 'Step 3: API', vi: 'Bước 3: API' } },
            { id: 'step4', label: { en: 'Step 4: ML', vi: 'Bước 4: ML' } },
            { id: 'cleanup', label: { en: 'Clean Up', vi: 'Dọn dẹp' } },
        ],
    },
    evaluation: {
        title: {
            en: 'Self Evaluation',
            vi: 'Tự Đánh Giá',
        },
        subtitle: {
            en: 'Honest assessment of my performance and growth',
            vi: 'Đánh giá trung thực về hiệu suất và sự phát triển',
        },
        criteria: [
            { name: { en: 'Technical Knowledge', vi: 'Kiến thức Kỹ thuật' }, rating: 'good', comment: { en: 'Strong understanding of AWS services and cloud architecture', vi: 'Hiểu biết sâu về các dịch vụ AWS và kiến trúc cloud' } },
            { name: { en: 'Learning Ability', vi: 'Khả năng Học hỏi' }, rating: 'good', comment: { en: 'Quick to adapt to new technologies and frameworks', vi: 'Nhanh chóng thích nghi với các công nghệ và framework mới' } },
            { name: { en: 'Proactivity', vi: 'Chủ động' }, rating: 'good', comment: { en: 'Consistently took initiative on tasks and improvements', vi: 'Luôn chủ động trong công việc và cải tiến' } },
            { name: { en: 'Discipline', vi: 'Kỷ luật' }, rating: 'good', comment: { en: 'Met all deadlines and followed processes diligently', vi: 'Đáp ứng tất cả deadline và tuân thủ quy trình' } },
            { name: { en: 'Communication', vi: 'Giao tiếp' }, rating: 'fair', comment: { en: 'Clear technical communication, improving soft skills', vi: 'Giao tiếp kỹ thuật rõ ràng, đang cải thiện kỹ năng mềm' } },
            { name: { en: 'Teamwork', vi: 'Làm việc nhóm' }, rating: 'good', comment: { en: 'Collaborated effectively with team members', vi: 'Hợp tác hiệu quả với các thành viên trong nhóm' } },
            { name: { en: 'Problem Solving', vi: 'Giải quyết vấn đề' }, rating: 'good', comment: { en: 'Analytical approach to debugging and optimization', vi: 'Tiếp cận phân tích để debug và tối ưu hóa' } },
            { name: { en: 'Project Contribution', vi: 'Đóng góp Dự án' }, rating: 'good', comment: { en: 'Delivered core features and documentation', vi: 'Hoàn thành các tính năng cốt lõi và tài liệu' } },
        ],
    },
    feedback: {
        title: {
            en: 'Sharing & Feedback',
            vi: 'Chia Sẻ & Phản Hồi',
        },
        subtitle: {
            en: 'Personal reflections on the FCJ program',
            vi: 'Suy nghĩ cá nhân về chương trình FCJ',
        },
        feeling: {
            en: 'The First Cloud AI Journey has been an incredibly transformative experience. Working with cutting-edge AWS technologies while being mentored by industry experts has accelerated my growth as an engineer significantly.',
            vi: 'Chương trình First Cloud AI Journey là một trải nghiệm biến đổi đáng kinh ngạc. Làm việc với các công nghệ AWS tiên tiến trong khi được hướng dẫn bởi các chuyên gia trong ngành đã đẩy nhanh sự phát triển của tôi với tư cách là một kỹ sư.',
        },
        satisfaction: {
            en: 'Extremely satisfied with the program structure, mentorship quality, and hands-on project opportunities. The balance between learning and contributing was perfect.',
            vi: 'Cực kỳ hài lòng với cấu trúc chương trình, chất lượng hướng dẫn và cơ hội dự án thực tế. Sự cân bằng giữa học tập và đóng góp là hoàn hảo.',
        },
        improvement: {
            en: 'Could benefit from more cross-team collaboration opportunities and extended networking events with AWS partners.',
            vi: 'Có thể được hưởng lợi từ nhiều cơ hội hợp tác liên nhóm hơn và các sự kiện networking mở rộng với các đối tác AWS.',
        },
        recommend: {
            en: 'Absolutely! This program offers real-world experience with industry-leading cloud technologies, excellent mentorship, and a clear path to becoming a cloud professional.',
            vi: 'Chắc chắn rồi! Chương trình này cung cấp kinh nghiệm thực tế với các công nghệ cloud hàng đầu trong ngành, hướng dẫn xuất sắc và con đường rõ ràng để trở thành chuyên gia cloud.',
        },
    },
};
