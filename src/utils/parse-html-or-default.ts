export const parseHtmlOrDefault = (html: string, defaultContent: string): string => {
    if (!html) {
        return defaultContent;
    }

    const hasMedia = /<(img|video|iframe|canvas|svg|object|embed|input|textarea)[\s/>]/i.test(html);

    if (hasMedia) {
        return html;
    }

    let textContent = html.replace(/<[^>]*>/g, "");

    textContent = textContent.replace(/&nbsp;/g, " ");

    if (textContent.trim().length > 0) {
        return html;
    }

    return defaultContent;
};