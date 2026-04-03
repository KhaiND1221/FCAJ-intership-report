import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { ReactNode } from 'react';

type AdmonitionType = 'note' | 'warning' | 'danger' | 'tip';

interface AdmonitionProps {
    type: AdmonitionType;
    title?: string;
    children: ReactNode;
}

const config = {
    note: {
        icon: Info,
        defaultTitle: 'Note',
        className: 'admonition-note',
        iconColor: 'text-admonition-note',
    },
    warning: {
        icon: AlertTriangle,
        defaultTitle: 'Warning',
        className: 'admonition-warning',
        iconColor: 'text-admonition-warning',
    },
    danger: {
        icon: AlertCircle,
        defaultTitle: 'Danger',
        className: 'admonition-danger',
        iconColor: 'text-admonition-danger',
    },
    tip: {
        icon: Lightbulb,
        defaultTitle: 'Tip',
        className: 'admonition-tip',
        iconColor: 'text-admonition-tip',
    },
};

export function Admonition({ type, title, children }: AdmonitionProps) {
    const { icon: Icon, defaultTitle, className, iconColor } = config[type];

    return (
        <div className={className}>
            <div className={`admonition-title ${iconColor}`}>
                <Icon size={18} />
                <span>{title || defaultTitle}</span>
            </div>
            <div className="text-text-secondary text-sm">{children}</div>
        </div>
    );
}
