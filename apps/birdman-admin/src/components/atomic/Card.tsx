interface CardProps {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "flex-1" }: CardProps) {
    const cardStyles = `
        ${className}
        m-4
        rounded-lg
        border
        border-slate-400
        p-4
        dark:bg-gray-800
        overflow-hidden
    `;
    const scrollContainerStyles = `
        max-h-screen
        overflow-y-auto
    `;
    return (
        <div className={cardStyles}>
            <div className={scrollContainerStyles}>{children}</div>
        </div>
    );
}