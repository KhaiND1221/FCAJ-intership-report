import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { content } from '../data/content';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { CodeBlock } from '../components/ui/CodeBlock';

export function Workshop() {
    const { t, language } = useLanguage();
    const [activeSection, setActiveSection] = useState('overview');

    const workshopContent = {
        overview: {
            title: { en: 'Overview', vi: 'Tổng quan' },
            content: {
                en: `NeuraX Shield is an AI-powered security platform designed to protect AWS infrastructure in real-time. This workshop will guide you through building and deploying the complete solution.

**What you'll learn:**
- Setting up serverless infrastructure on AWS
- Implementing real-time threat detection with ML
- Building a monitoring dashboard
- Best practices for cloud security`,
                vi: `NeuraX Shield là nền tảng bảo mật được hỗ trợ bởi AI, được thiết kế để bảo vệ cơ sở hạ tầng AWS theo thời gian thực. Workshop này sẽ hướng dẫn bạn xây dựng và triển khai giải pháp hoàn chỉnh.

**Bạn sẽ học:**
- Thiết lập cơ sở hạ tầng serverless trên AWS
- Triển khai phát hiện mối đe dọa thời gian thực với ML
- Xây dựng dashboard giám sát
- Best practices cho bảo mật cloud`,
            },
        },
        prerequisites: {
            title: { en: 'Prerequisites', vi: 'Điều kiện tiên quyết' },
            items: [
                { en: 'AWS Account with admin access', vi: 'Tài khoản AWS với quyền admin' },
                { en: 'AWS CLI configured', vi: 'AWS CLI đã được cấu hình' },
                { en: 'Node.js 18+ installed', vi: 'Node.js 18+ đã được cài đặt' },
                { en: 'Basic knowledge of AWS services', vi: 'Kiến thức cơ bản về các dịch vụ AWS' },
            ],
        },
        step1: {
            title: { en: 'Step 1: Environment Setup', vi: 'Bước 1: Cài đặt Môi trường' },
            description: {
                en: 'First, we need to set up our development environment and configure AWS credentials.',
                vi: 'Đầu tiên, chúng ta cần thiết lập môi trường phát triển và cấu hình AWS credentials.',
            },
            code: `# Install AWS CDK globally
npm install -g aws-cdk

# Create project directory
mkdir neurax-shield && cd neurax-shield

# Initialize CDK project
cdk init app --language typescript

# Install dependencies
npm install @aws-cdk/aws-lambda @aws-cdk/aws-apigateway @aws-cdk/aws-dynamodb`,
        },
        step2: {
            title: { en: 'Step 2: Lambda Functions', vi: 'Bước 2: Lambda Functions' },
            description: {
                en: 'Create the Lambda function that will process security events.',
                vi: 'Tạo Lambda function để xử lý các sự kiện bảo mật.',
            },
            code: `// lib/lambda/threat-detector.ts
import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: Handler = async (event) => {
  const { source, eventType, severity } = event;
  
  // Analyze threat using ML model
  const threatScore = await analyzeThreat(event);
  
  // Store in DynamoDB
  await dynamodb.put({
    TableName: process.env.TABLE_NAME!,
    Item: {
      id: Date.now().toString(),
      source,
      eventType,
      severity,
      threatScore,
      timestamp: new Date().toISOString(),
    },
  }).promise();
  
  // Trigger alert if high severity
  if (threatScore > 0.8) {
    await triggerAlert(event);
  }
  
  return { statusCode: 200, body: 'Processed' };
};`,
        },
        step3: {
            title: { en: 'Step 3: API Gateway', vi: 'Bước 3: API Gateway' },
            description: {
                en: 'Set up the API Gateway to expose our security endpoints.',
                vi: 'Thiết lập API Gateway để public các endpoint bảo mật.',
            },
            code: `// lib/neurax-shield-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class NeuraxShieldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const threatDetector = new lambda.Function(this, 'ThreatDetector', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'threat-detector.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'SecurityApi', {
      restApiName: 'NeuraX Shield API',
      description: 'Security monitoring API',
    });

    // Add endpoints
    const threats = api.root.addResource('threats');
    threats.addMethod('POST', new apigateway.LambdaIntegration(threatDetector));
  }
}`,
        },
        cleanup: {
            title: { en: 'Clean Up', vi: 'Dọn dẹp' },
            description: {
                en: 'To avoid incurring charges, delete all resources when done.',
                vi: 'Để tránh phát sinh chi phí, hãy xóa tất cả tài nguyên khi hoàn thành.',
            },
            code: `# Destroy all resources
cdk destroy

# Verify in AWS Console that all resources are deleted:
# - Lambda functions
# - API Gateway
# - DynamoDB tables
# - CloudWatch logs
# - IAM roles`,
        },
    };

    type WorkshopSectionKey = keyof typeof workshopContent;

    const renderContent = (sectionId: string) => {
        const section = workshopContent[sectionId as WorkshopSectionKey];
        if (!section) return null;

        if (sectionId === 'overview') {
            return (
                <div className="prose prose-invert max-w-none">
                    <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {workshopContent.overview.content[language]}
                    </div>
                </div>
            );
        }

        if (sectionId === 'prerequisites') {
            return (
                <div className="space-y-3">
                    {workshopContent.prerequisites.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-400 shrink-0" />
                            <span className="text-text-secondary">{item[language]}</span>
                        </div>
                    ))}
                    <div className="mt-6 p-4 rounded-xl bg-accent-orange/10 border border-accent-orange/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="text-accent-orange shrink-0 mt-0.5" />
                            <p className="text-sm text-text-secondary">
                                {language === 'en'
                                    ? 'Make sure you have all prerequisites before continuing. The workshop assumes familiarity with basic AWS concepts.'
                                    : 'Hãy đảm bảo bạn có tất cả điều kiện tiên quyết trước khi tiếp tục. Workshop giả định bạn đã quen thuộc với các khái niệm AWS cơ bản.'}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        const stepContent = section as {
            title: { en: string; vi: string };
            description: { en: string; vi: string };
            code: string;
        };

        return (
            <div className="space-y-4">
                <p className="text-text-secondary">{stepContent.description[language]}</p>
                <CodeBlock
                    code={stepContent.code}
                    language={sectionId === 'cleanup' ? 'bash' : 'typescript'}
                    filename={
                        sectionId === 'step1'
                            ? 'terminal'
                            : sectionId === 'step2'
                                ? 'threat-detector.ts'
                                : sectionId === 'step3'
                                    ? 'neurax-shield-stack.ts'
                                    : 'cleanup.sh'
                    }
                />
            </div>
        );
    };

    const getIcon = (sectionId: string) => {
        switch (sectionId) {
            case 'overview':
                return BookOpen;
            case 'cleanup':
                return Trash2;
            default:
                return Terminal;
        }
    };

    return (
        <section id="workshop" className="section max-w-6xl mx-auto">
            <SectionHeader
                title={t(content.workshop.title)}
                subtitle={t(content.workshop.subtitle)}
                gradient
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Table of Contents */}
                <div className="lg:w-64 shrink-0">
                    <GlassCard className="p-4 lg:sticky lg:top-8">
                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                            {language === 'en' ? 'Contents' : 'Mục lục'}
                        </h3>
                        <nav className="space-y-1">
                            {content.workshop.toc.map((item) => {
                                const Icon = getIcon(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left
                      transition-all duration-200
                      ${activeSection === item.id
                                                ? 'bg-accent-orange/10 text-accent-orange'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                            }
                    `}
                                    >
                                        <Icon size={16} />
                                        {t(item.label)}
                                    </button>
                                );
                            })}
                        </nav>
                    </GlassCard>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GlassCard className="p-8" glow="orange">
                            <h2 className="text-2xl font-bold text-text-primary mb-6">
                                {t(workshopContent[activeSection as WorkshopSectionKey].title)}
                            </h2>
                            {renderContent(activeSection)}
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
