// Section icons for navigation and headers
import {
    BookOpen,
    Lightbulb,
    Calendar,
    Wrench,
    CheckSquare,
    MessageCircle,
    Home,
    FolderOpen
} from 'lucide-react';

export const sectionIcons = {
    home: Home,
    worklog: BookOpen,
    proposal: Lightbulb,
    events: Calendar,
    workshop: Wrench,
    evaluation: CheckSquare,
    feedback: MessageCircle,
    default: FolderOpen,
};

interface SectionHeaderProps {
    icon: keyof typeof sectionIcons;
    title: string;
    gradient?: boolean;
}

export function SectionHeader({ icon, title, gradient = true }: SectionHeaderProps) {
    const Icon = sectionIcons[icon] || sectionIcons.default;

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${gradient ? 'bg-gradient-to-br from-accent-orange to-amber-500' : 'bg-accent-orange'} text-white shadow-lg`}>
                <Icon size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
    );
}

// Gradient section title with underline
export function GradientTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
            {children}
        </h1>
    );
}

// Gradient card wrapper
export function GradientCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative">{children}</div>
        </div>
    );
}
