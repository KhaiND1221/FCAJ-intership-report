import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const location = useLocation();

    return (
        <nav className="breadcrumb">
            <Link to="/" className="hover:text-accent-orange">
                <Home size={16} />
            </Link>

            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-text-muted" />
                    {item.path && location.pathname !== item.path ? (
                        <Link to={item.path} className="hover:text-accent-orange">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-text-primary">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
