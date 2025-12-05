import TumblingClassTable from "@/app/(full-width-pages)/p/events/tumbling-classes/tumbling-class-table";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { EventType } from "@/schemas/event.schema";
import { fetchEventsPublic } from "@/services/event-public.api";

export default async function TumblingClasses() {

    const openTumblingClasses = await fetchEventsPublic({
        page: 1,
        pageSize: 10,
        registrationOpen: true,
        type: EventType.TUMBLINGClASS,
    })

    const closedTumblingClasses = await fetchEventsPublic({
        page: 1,
        pageSize: 10,
        registrationOpen: false,
        type: EventType.TUMBLINGClASS,
    })

    return (
        <>
            <PageBreadCrumb pageTitle={"Tumbling Classes"} />

            <div className={"flex flex-col gap-3"}>
                <ComponentCard title={"Offene Anmeldung"}>
                    {openTumblingClasses.totalCount > 0
                        ? <TumblingClassTable
                            tumblingClasses={openTumblingClasses.data}
                            anmeldungMoeglich={true}
                        />
                        : <span>Keine offenen Anmeldungen.</span>}

                </ComponentCard>

                <ComponentCard title={"Geschlossene Anmeldung"}>
                    {closedTumblingClasses.totalCount > 0
                        ? <TumblingClassTable
                            tumblingClasses={closedTumblingClasses.data}
                            anmeldungMoeglich={false}
                        />
                        : <span>Keine geschlossenen Anmeldungen.</span>}
                </ComponentCard>
            </div>
        </>
    )
}