import React from "react";

type Props = {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export default function Button({ children, onClick,className }: Props) {
    const style = `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`;
    return (
        <button onClick={onClick} className={style}>
            {children}
        </button>
    );
}