import React from "react";

interface PageHeaderProps {
    pageTitle: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle }) => {
    return (
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            {pageTitle}
        </h3>
    )
}

export default PageHeader