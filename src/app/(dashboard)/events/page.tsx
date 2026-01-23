import EventTable from "@/app/(dashboard)/events/components/event-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchEventList } from "@/services/event.api";

const PAGE_SIZE = 20;

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const searchParamValues = await searchParams;
    const currentPage = Number(searchParamValues.page) || 1;
    const searchQuery = searchParamValues.search || undefined;

    const { data, totalCount } = await fetchEventList(
        currentPage,
        PAGE_SIZE,
        searchQuery
    );

    const totalPages = Math.ceil(totalCount ?? 0 / PAGE_SIZE);

    return (
        <ComponentCard title={"Events"}>
            <EventTable
                initialEvents={data}
                totalPages={totalPages}
            />
        </ComponentCard>
    )
}