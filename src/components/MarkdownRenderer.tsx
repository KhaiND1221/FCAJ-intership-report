import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MermaidChart({ chart }: { chart: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        async function renderChart() {
            try {
                const mermaidModule = await import('mermaid');
                const mermaid = mermaidModule.default || mermaidModule;
                
                if (!mermaid || !mermaid.initialize) {
                    throw new Error("Mermaid object is invalid");
                }
                
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose',
                });

                const id = 'mermaid-' + Math.random().toString(36).substring(2, 9);
                const { svg } = await mermaid.render(id, chart);
                
                if (isMounted && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (e) {
                console.error('Mermaid rendering failed', e);
                if (isMounted) {
                    setError('Failed to render diagram.');
                }
            }
        }
        
        renderChart();
        
        return () => {
            isMounted = false;
        };
    }, [chart]);

    if (error) {
        return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">{error}</div>;
    }

    return <div ref={containerRef} className="mermaid-chart my-6 flex justify-center w-full overflow-x-auto" />;
}

function CopyableCodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block relative rounded-xl overflow-hidden my-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center bg-gray-800 text-gray-300 px-4 py-2.5 text-xs font-mono border-b border-gray-700">
                <span className="font-semibold uppercase tracking-wider">{language || 'code'}</span>
                <button
                    onClick={handleCopy}
                    className="hover:text-white hover:bg-gray-700 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 focus:outline-none"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span className="text-green-500 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="text-[13px] sm:text-sm code-highlighter-wrapper">
                <SyntaxHighlighter
                    language={language === 'json' ? 'javascript' : language || 'javascript'}
                    style={coldarkDark}
                    customStyle={{ margin: 0, padding: '1.25rem', background: '#111827', borderRadius: '0' }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                // Headings with proper styling
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-accent-orange after:to-amber-400 after:rounded">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6 pb-2 border-b border-gray-200">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">{children}</h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-3">{children}</h4>
                ),

                // Paragraphs
                p: ({ children }) => (
                    <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
                ),

                // Strong/Bold text
                strong: ({ children }) => (
                    <strong className="font-semibold text-text-primary">{children}</strong>
                ),

                // Links - internal vs external
                a: ({ href, children }) => {
                    const isInternal = href?.startsWith('/');
                    if (isInternal) {
                        return (
                            <Link to={href || '#'} className="text-accent-orange hover:underline">
                                {children}
                            </Link>
                        );
                    }
                    return (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-orange hover:underline"
                        >
                            {children}
                        </a>
                    );
                },

                // Unordered lists
                ul: ({ children, ...props }) => {
                    // Check if this is a nested list by looking at the depth
                    const isNested = props.node?.position?.start?.column && props.node.position.start.column > 1;
                    return (
                        <ul className={`space-y-2 mb-4 text-text-secondary pl-6 ${isNested ? 'list-[circle] mt-2' : 'list-disc'}`}>
                            {children}
                        </ul>
                    );
                },

                // Ordered lists
                ol: ({ children }) => (
                    <ol className="list-decimal space-y-2 mb-4 text-text-secondary pl-6">
                        {children}
                    </ol>
                ),

                // List items
                li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,

                // Horizontal rule
                hr: () => <hr className="my-8 border-gray-200" />,

                // Tables with nice styling
                table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                        <table className="content-table">{children}</table>
                    </div>
                ),
                thead: ({ children }) => <thead>{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr>{children}</tr>,
                th: ({ children }) => <th>{children}</th>,
                td: ({ children }) => <td className="text-text-secondary">{children}</td>,

                // Code blocks
                code: ({ className, children }) => {
                    const isInline = !className;
                    const match = /language-(\w+)/.exec(className || '');
                    const isMermaid = match && match[1] === 'mermaid';

                    if (isMermaid) {
                        return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
                    }

                    if (isInline) {
                        return (
                            <code className="bg-gray-100 text-rose-600 px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                            </code>
                        );
                    }
                    
                    const language = match ? match[1] : '';
                    const codeString = String(children).replace(/\n$/, '');
                    
                    return <CopyableCodeBlock language={language} code={codeString} />;
                },

                // Blockquotes for admonitions
                blockquote: ({ children }) => (
                    <blockquote className="admonition-note">{children}</blockquote>
                ),

                // Images
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt || ''}
                        className="content-image max-w-full h-auto mx-auto"
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
