import React, { ReactNode } from "react";

interface TableProps {
    children: ReactNode;
    className?: string;
}

interface TableHeaderProps {
    children: ReactNode;
    className?: string;
}

interface TableBodyProps {
    children: ReactNode;
    className?: string;
}

interface TableRowProps {
    children: ReactNode;
    className?: string;
}

interface TableCellProps {
    children: ReactNode;
    isHeader?: boolean;
    className?: string;
    dataLabel?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
    return (
        <table className={`min-w-full ${className || ''}`}>
            {children}
        </table>
    );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
    return (
        <thead className={`hidden md:table-header-group ${className || ''}`}>
        {children}
        </thead>
    );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
    return (
        <tbody className={`block md:table-row-group dark:text-white ${className || ''}`}>
        {children}
        </tbody>
    );
};

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
    return (
        <tr
            className={`block md:table-row mb-4 md:mb-0 rounded-lg shadow-md md:shadow-none 
                        md:bg-transparent overflow-hidden md:overflow-visible dark:border-gray-800 ${className || ''}`}
        >
            {children}
        </tr>
    );
};

/**
 * Die Tabellenzelle (th oder td).
 * Dies ist die komplexeste Komponente.
 */
const TableCell: React.FC<TableCellProps> = ({
    children,
    isHeader = false,
    className,
    dataLabel,
}) => {
    const CellTag = isHeader ? "th" : "td";

    if (isHeader) {
        return (
            <CellTag
                className={`p-3 font-medium text-gray-500 text-start font-semibold tracking-wide dark:text-gray-400 ${className || ''}`}
            >
                {children}
            </CellTag>
        );
    }

    return (
        <CellTag
            className={`block md:table-cell p-4 md:p-3 text-right md:text-left 
                        border-b border-gray-200 md:border-b-0 px-5 py-4 sm:px-6 ${className || ''}`}
        >
            {dataLabel && (
                <span className="md:hidden float-left font-semibold text-sm mr-2">
                    {dataLabel}
                </span>
            )}
            <div className={"text-sm md:text-left md:text-base"}>
                {children}
            </div>
        </CellTag>
    );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };