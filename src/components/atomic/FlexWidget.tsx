import React from "react";

type Props = {
    children: React.ReactNode,
    column?: boolean,
};

export default function FlexWidget({ children, column = false }: Props) {
    const derivedClassName = "flex-widget" + (column ? " column" : "");
    return (
        <div className={derivedClassName}>
            {children}
        </div>
    );
}