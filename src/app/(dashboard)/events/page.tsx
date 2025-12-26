import EventTable from "@/app/(dashboard)/events/components/event-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchEventList } from "@/services/event.api";

const PAGE_SIZE = 20;

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const searchParamValues = await searchParams;
    const currentPage = Number(searchParamValues.page) || 1;

    const { data, totalCount } = await fetchEventList(currentPage, PAGE_SIZE);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <ComponentCard title={"Events"}>
            <EventTable
                initialEvents={data}
                totalPages={totalPages}
            />
        </ComponentCard>
    )
}