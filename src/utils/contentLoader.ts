// Content loader utility for loading Markdown files
// Markdown files are stored in /content/ folder with language suffix (e.g., home.en.md, home.vi.md)

const contentModules = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true });

export function loadContent(path: string, language: 'en' | 'vi'): string {
    // Try language-specific file first
    const langPath = `/content/${path}.${language}.md`;
    const fallbackPath = `/content/${path}.en.md`;

    if (contentModules[langPath]) {
        return contentModules[langPath] as string;
    }

    // Fallback to English if translation not available
    if (contentModules[fallbackPath]) {
        return contentModules[fallbackPath] as string;
    }

    // Return placeholder if file not found
    return `# Content Not Found\n\nThe content for **${path}** is not available yet. Please create the file at \`content/${path}.${language}.md\`.`;
}

// Helper to list all available content files
export function listContentFiles(): string[] {
    return Object.keys(contentModules).map(path =>
        path.replace('/content/', '').replace(/\.(en|vi)\.md$/, '')
    ).filter((value, index, self) => self.indexOf(value) === index);
}
