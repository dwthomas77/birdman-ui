interface CardProps {
    children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
    const cardStyles = `
        flex-1
        m-4
        rounded-lg
        border
        border-slate-400
        p-4
        dark:bg-gray-800
    `;
    return (<div className={cardStyles}>{children}</div>);
}