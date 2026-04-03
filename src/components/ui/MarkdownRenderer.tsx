import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-slate max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Custom code block rendering
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code className="bg-content-surface px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <CodeBlock
                                code={String(children).replace(/\n$/, '')}
                                language={match[1]}
                            />
                        );
                    },
                    // Custom image rendering
                    img({ src, alt }) {
                        return (
                            <img
                                src={src}
                                alt={alt || ''}
                                className="content-image max-w-full"
                            />
                        );
                    },
                    // Custom table rendering
                    table({ children }) {
                        return <table className="content-table">{children}</table>;
                    },
                    // Custom link rendering
                    a({ href, children }) {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="text-accent-orange hover:underline"
                            >
                                {children}
                            </a>
                        );
                    },
                    // Headings
                    h1({ children }) {
                        return <h1 className="text-3xl font-bold text-text-primary mb-4">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="section-title">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="text-lg font-semibold text-text-primary mt-6 mb-3">{children}</h3>;
                    },
                    // Paragraphs
                    p({ children }) {
                        return <p className="text-text-secondary leading-relaxed mb-4">{children}</p>;
                    },
                    // Lists
                    ul({ children }) {
                        return <ul className="list-disc list-inside mb-4 space-y-1 text-text-secondary">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="list-decimal list-inside mb-4 space-y-1 text-text-secondary">{children}</ol>;
                    },
                    // Blockquote for admonitions
                    blockquote({ children }) {
                        return (
                            <blockquote className="admonition-note">
                                {children}
                            </blockquote>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
