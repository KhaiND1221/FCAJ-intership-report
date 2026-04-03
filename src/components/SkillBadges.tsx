// Skills/Tags badges component
import {
    Cloud,
    Database,
    Shield,
    Server,
    Code,
    Cpu,
    Globe,
    Lock,
    Zap
} from 'lucide-react';

interface Skill {
    name: string;
    icon: React.ReactNode;
    color: string;
}

const skills: Skill[] = [
    { name: 'AWS', icon: <Cloud size={14} />, color: 'bg-orange-500' },
    { name: 'EC2', icon: <Server size={14} />, color: 'bg-amber-500' },
    { name: 'S3', icon: <Database size={14} />, color: 'bg-green-500' },
    { name: 'Lambda', icon: <Zap size={14} />, color: 'bg-purple-500' },
    { name: 'IAM', icon: <Shield size={14} />, color: 'bg-red-500' },
    { name: 'VPC', icon: <Globe size={14} />, color: 'bg-blue-500' },
    { name: 'DynamoDB', icon: <Database size={14} />, color: 'bg-indigo-500' },
    { name: 'Python', icon: <Code size={14} />, color: 'bg-yellow-500' },
    { name: 'AI/ML', icon: <Cpu size={14} />, color: 'bg-pink-500' },
    { name: 'Security', icon: <Lock size={14} />, color: 'bg-slate-600' },
];

export function SkillBadges() {
    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span
                    key={skill.name}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-md hover:scale-105 transition-transform cursor-default ${skill.color}`}
                >
                    {skill.icon}
                    {skill.name}
                </span>
            ))}
        </div>
    );
}

// Single skill badge for inline use
export function SkillTag({ name, color = 'bg-accent-orange' }: { name: string; color?: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-medium ${color}`}>
            {name}
        </span>
    );
}
