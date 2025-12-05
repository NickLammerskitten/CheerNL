import ComponentCard from "@/components/common/ComponentCard";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchEventPublic } from "@/services/event-public.api";

export default async function RegisterToTumblingClass({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const paramValues = await params;

    const event = await fetchEventPublic(paramValues.id)

    return (
        <>
            <PageBreadCrumb
                pageTitle={"Tumbling Class Anmeldung"}
                previousPage={
                    { href: "/p/events/tumbling-classes", pageTitle: "Tumbling Classes" }
                }
            />

            <ComponentCard title={`Anmelden bei ${event.title}`}>
                <></>
            </ComponentCard>
        </>
    )
}