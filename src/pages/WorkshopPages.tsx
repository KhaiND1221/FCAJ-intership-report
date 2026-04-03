import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Admonition } from '../components/ui/Admonition';
import { CodeBlock } from '../components/ui/CodeBlock';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { SectionHeader } from '../components/SectionHeader';

export function WorkshopPage() {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: 'Workshop' }]} />

                <SectionHeader icon="workshop" title={language === 'en' ? 'Technical Workshop' : 'Workshop Kỹ Thuật'} />

                <p className="text-xl text-accent-orange mb-6 ml-1">
                    NeuraX Shield - AI-Powered Cloud Security
                </p>

                <Admonition type="note" title={language === 'en' ? 'About this Workshop' : 'Về Workshop này'}>
                    {language === 'en'
                        ? 'This workshop guides you through building NeuraX Shield, an AI-powered security platform on AWS. You will learn to deploy serverless architecture, integrate ML models, and build a monitoring dashboard.'
                        : 'Workshop này hướng dẫn bạn xây dựng NeuraX Shield, một nền tảng bảo mật được hỗ trợ bởi AI trên AWS. Bạn sẽ học cách triển khai kiến trúc serverless, tích hợp các mô hình ML và xây dựng một dashboard giám sát.'}
                </Admonition>

                <section className="mt-8">
                    <h2 className="section-title">{language === 'en' ? 'Contents' : 'Mục Lục'}</h2>
                    <div className="card bg-content-surface">
                        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                            <li>
                                <Link to="/workshop/overview" className="text-accent-orange hover:underline">
                                    {language === 'en' ? 'Overview & Prerequisites' : 'Tổng Quan & Điều Kiện'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/workshop/setup" className="text-accent-orange hover:underline">
                                    {language === 'en' ? 'Environment Setup' : 'Cài Đặt Môi Trường'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/workshop/implementation" className="text-accent-orange hover:underline">
                                    {language === 'en' ? 'Implementation' : 'Triển Khai'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/workshop/cleanup" className="text-accent-orange hover:underline">
                                    {language === 'en' ? 'Clean Up' : 'Dọn Dẹp'}
                                </Link>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="section-title">{language === 'en' ? 'Architecture Overview' : 'Tổng Quan Kiến Trúc'}</h2>
                    <div className="card bg-content-surface text-center py-12">
                        <p className="text-text-muted">
                            {language === 'en'
                                ? '[Architecture diagram will be added here]'
                                : '[Sơ đồ kiến trúc sẽ được thêm vào đây]'}
                        </p>
                    </div>
                </section>

                <Admonition type="tip" title={language === 'en' ? 'Time Required' : 'Thời Gian Cần Thiết'}>
                    {language === 'en'
                        ? 'This workshop takes approximately 2-3 hours to complete. Make sure you have an AWS account with appropriate permissions.'
                        : 'Workshop này mất khoảng 2-3 giờ để hoàn thành. Hãy đảm bảo bạn có tài khoản AWS với quyền phù hợp.'}
                </Admonition>
            </div>
        </AnimatedPage>
    );
}

export function WorkshopOverviewPage() {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: 'Workshop', path: '/workshop' },
                        { label: language === 'en' ? 'Overview' : 'Tổng Quan' },
                    ]}
                />

                <SectionHeader icon="workshop" title={language === 'en' ? 'Overview & Prerequisites' : 'Tổng Quan & Điều Kiện Tiên Quyết'} />

                <section>
                    <h2 className="section-title">{language === 'en' ? 'Prerequisites' : 'Điều Kiện Tiên Quyết'}</h2>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary mb-6">
                        <li>{language === 'en' ? 'AWS Account with admin access' : 'Tài khoản AWS với quyền admin'}</li>
                        <li>{language === 'en' ? 'AWS CLI configured' : 'AWS CLI đã được cấu hình'}</li>
                        <li>{language === 'en' ? 'Node.js 18+ installed' : 'Node.js 18+ đã được cài đặt'}</li>
                        <li>{language === 'en' ? 'Basic knowledge of AWS services' : 'Kiến thức cơ bản về các dịch vụ AWS'}</li>
                    </ul>
                </section>

                <Admonition type="warning" title={language === 'en' ? 'Cost Warning' : 'Cảnh Báo Chi Phí'}>
                    {language === 'en'
                        ? 'This workshop creates AWS resources that may incur charges. Make sure to complete the Clean Up section to avoid ongoing costs.'
                        : 'Workshop này tạo ra các tài nguyên AWS có thể phát sinh phí. Hãy đảm bảo hoàn thành phần Dọn Dẹp để tránh chi phí phát sinh.'}
                </Admonition>
            </div>
        </AnimatedPage>
    );
}

export function WorkshopSetupPage() {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: 'Workshop', path: '/workshop' },
                        { label: language === 'en' ? 'Setup' : 'Cài Đặt' },
                    ]}
                />

                <SectionHeader icon="workshop" title={language === 'en' ? 'Environment Setup' : 'Cài Đặt Môi Trường'} />

                <section>
                    <h2 className="section-title">{language === 'en' ? 'Step 1: Install AWS CDK' : 'Bước 1: Cài Đặt AWS CDK'}</h2>
                    <p className="text-text-secondary mb-4">
                        {language === 'en'
                            ? 'First, install the AWS Cloud Development Kit (CDK) globally:'
                            : 'Đầu tiên, cài đặt AWS Cloud Development Kit (CDK) toàn cục:'}
                    </p>
                    <CodeBlock
                        code={`# Install AWS CDK globally
npm install -g aws-cdk

# Verify installation
cdk --version`}
                        language="bash"
                        filename="terminal"
                    />
                </section>

                <section className="mt-8">
                    <h2 className="section-title">{language === 'en' ? 'Step 2: Initialize Project' : 'Bước 2: Khởi Tạo Dự Án'}</h2>
                    <CodeBlock
                        code={`# Create project directory
mkdir neurax-shield && cd neurax-shield

# Initialize CDK project
cdk init app --language typescript

# Install dependencies
npm install @aws-cdk/aws-lambda @aws-cdk/aws-apigateway`}
                        language="bash"
                        filename="terminal"
                    />
                </section>

                <Admonition type="tip">
                    {language === 'en'
                        ? 'Make sure your AWS credentials are configured correctly by running `aws sts get-caller-identity`'
                        : 'Hãy đảm bảo AWS credentials của bạn được cấu hình đúng bằng cách chạy `aws sts get-caller-identity`'}
                </Admonition>
            </div>
        </AnimatedPage>
    );
}

export function WorkshopImplementationPage() {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: 'Workshop', path: '/workshop' },
                        { label: language === 'en' ? 'Implementation' : 'Triển Khai' },
                    ]}
                />

                <SectionHeader icon="workshop" title={language === 'en' ? 'Implementation' : 'Triển Khai'} />

                <section>
                    <h2 className="section-title">{language === 'en' ? 'Create Lambda Function' : 'Tạo Lambda Function'}</h2>
                    <p className="text-text-secondary mb-4">
                        {language === 'en'
                            ? 'Create the threat detection Lambda function:'
                            : 'Tạo Lambda function phát hiện mối đe dọa:'}
                    </p>
                    <CodeBlock
                        code={`// lib/lambda/threat-detector.ts
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
  
  return { statusCode: 200, body: 'Processed' };
};`}
                        language="typescript"
                        filename="threat-detector.ts"
                    />
                </section>

                <section className="mt-8">
                    <h2 className="section-title">{language === 'en' ? 'Deploy Stack' : 'Triển Khai Stack'}</h2>
                    <CodeBlock
                        code={`# Deploy to AWS
cdk deploy

# This will create:
# - Lambda function
# - API Gateway
# - DynamoDB table
# - IAM roles`}
                        language="bash"
                        filename="terminal"
                    />
                </section>
            </div>
        </AnimatedPage>
    );
}

export function WorkshopCleanupPage() {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: 'Workshop', path: '/workshop' },
                        { label: language === 'en' ? 'Clean Up' : 'Dọn Dẹp' },
                    ]}
                />

                <SectionHeader icon="workshop" title={language === 'en' ? 'Clean Up Resources' : 'Dọn Dẹp Tài Nguyên'} />

                <Admonition type="danger" title={language === 'en' ? 'Important' : 'Quan Trọng'}>
                    {language === 'en'
                        ? 'To avoid incurring charges, make sure to delete all resources created during this workshop.'
                        : 'Để tránh phát sinh chi phí, hãy đảm bảo xóa tất cả tài nguyên được tạo trong workshop này.'}
                </Admonition>

                <section className="mt-6">
                    <h2 className="section-title">{language === 'en' ? 'Destroy CDK Stack' : 'Hủy CDK Stack'}</h2>
                    <CodeBlock
                        code={`# Destroy all resources
cdk destroy

# Confirm when prompted`}
                        language="bash"
                        filename="terminal"
                    />
                </section>

                <section className="mt-8">
                    <h2 className="section-title">{language === 'en' ? 'Verify Cleanup' : 'Xác Nhận Dọn Dẹp'}</h2>
                    <p className="text-text-secondary mb-4">
                        {language === 'en'
                            ? 'Verify in AWS Console that all resources are deleted:'
                            : 'Xác nhận trong AWS Console rằng tất cả tài nguyên đã được xóa:'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                        <li>Lambda functions</li>
                        <li>API Gateway</li>
                        <li>DynamoDB tables</li>
                        <li>CloudWatch logs</li>
                        <li>IAM roles</li>
                    </ul>
                </section>
            </div>
        </AnimatedPage>
    );
}
