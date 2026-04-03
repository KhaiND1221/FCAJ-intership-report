
export interface EventData {
    id: string;
    title: string;
    date: string;
    location: string;
    role: string;
    content: string;
    takeaways: string[];
}

// Eagerly load all event markdown files
const eventModules = import.meta.glob('/content/events/*.md', { as: 'raw', eager: true });

export function loadEvents(language: 'en' | 'vi'): EventData[] {
    const events: EventData[] = [];

    // Filter files for the requested language
    const relevantPaths = Object.keys(eventModules).filter((path) =>
        path.endsWith(`.${language}.md`)
    );

    // Sort by filename to ensure order (01, 02, 03...)
    relevantPaths.sort();

    for (const path of relevantPaths) {
        const rawContent = eventModules[path] as string;
        const event = parseEventMarkdown(rawContent);
        // Use filename as ID (e.g., "01-aws-community-day")
        const id = path.split('/').pop()?.replace(`.${language}.md`, '') || 'unknown';

        events.push({ ...event, id });
    }

    return events;
}

function parseEventMarkdown(content: string): Omit<EventData, 'id'> {
    const lines = content.split('\n');
    let title = '';
    let date = '';
    let location = '';
    let role = '';
    let descriptionLines: string[] = [];
    let takeaways: string[] = [];

    let section: 'meta' | 'content' | 'takeaways' = 'meta';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('# ')) {
            title = line.substring(2).trim();
            continue;
        }

        if (line.startsWith('**Date:**')) {
            date = line.replace('**Date:**', '').trim();
            continue;
        }

        if (line.startsWith('**Location:**')) {
            location = line.replace('**Location:**', '').trim();
            continue;
        }

        if (line.startsWith('**Role:**')) {
            role = line.replace('**Role:**', '').trim();
            // After role, we assume content starts
            section = 'content';
            continue;
        }

        if (line.startsWith('## Key Takeaways')) {
            section = 'takeaways';
            continue;
        }

        // Processing based on section
        if (section === 'takeaways') {
            if (line.startsWith('- ')) {
                takeaways.push(line.substring(2).trim());
            }
        } else if (section === 'content') {
            if (line !== '') {
                descriptionLines.push(line);
            }
        }
    }

    return {
        title,
        date,
        location,
        role,
        content: descriptionLines.join('\n\n'),
        takeaways
    };
}
