import EventTable from "@/app/(dashboard)/events/components/event-table";
import ComponentCard from "@/components/common/ComponentCard";
import { fetchEventList } from "@/services/event.api";

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const searchParamValues = await searchParams;
    const currentPage = Number(searchParamValues.page) || 1;
    const searchQuery = searchParamValues.search || undefined;

    const { data, totalPages } = await fetchEventList(
        currentPage,
        searchQuery
    );

    return (
        <ComponentCard title={"Events"}>
            <EventTable
                events={data}
                totalPages={totalPages}
            />
        </ComponentCard>
    )
}