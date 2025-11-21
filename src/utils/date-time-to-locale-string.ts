export const toDateTimeLocalString = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');

    const YYYY = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const DD = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());

    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};