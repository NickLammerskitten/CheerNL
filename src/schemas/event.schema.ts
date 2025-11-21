import { ApiSlotListDataSchema, EventSlotListDataSchema } from "@/schemas/event-slot.schema";
import { z } from "zod";

/* List */
const ApiListDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
    created_at: z.coerce.date(),
});

export const EventListItemDataSchema = ApiListDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
        createdAt: apiData.created_at,
    };
})

export const EventListDataSchema = z.array(EventListItemDataSchema);

export type EventListData = z.infer<typeof EventListItemDataSchema>;

/* Details */
const ApiDetailDataSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    registration_from: z.coerce.date(),
    registration_till: z.coerce.date(),
    created_at: z.coerce.date(),
    event_slot: z.array(ApiSlotListDataSchema),
});

export const EventDetailDataSchema = ApiDetailDataSchema.transform((apiData) => {
    return {
        id: apiData.id,
        title: apiData.title,
        type: apiData.type as EventType,
        description: apiData.description,
        registrationFrom: apiData.registration_from,
        registrationTill: apiData.registration_till,
        slots: EventSlotListDataSchema.parse(apiData.event_slot),
        createdAt: apiData.created_at,
    };
})

export type EventDetailData = z.infer<typeof EventDetailDataSchema>;

export enum EventType {
    TUMBLINGClASS = 'TUMBLING_CLASS'
}

export const EventUpdateSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1, { message: "Der Titel darf nicht leer sein." }),
    type: z.string(),
    description: z.string().min(1, { message: "Die Beschreibung darf nicht leer sein." }).nullable(),
    registration_from: z.string().min(1, { message: "Das Startdatum ist erforderlich." }),
    registration_till: z.string().min(1, { message: "Das Enddatum ist erforderlich." }),
})
    .refine((data) => {
        const fromDate = new Date(data.registration_from);
        const tillDate = new Date(data.registration_till);

        if (isNaN(fromDate.getTime()) || isNaN(tillDate.getTime())) {
            return true;
        }

        return tillDate >= fromDate;
    }, {
        message: "Das Enddatum der Registrierung darf nicht vor dem Startdatum liegen.",
        path: ["registration_till"],
    });

export type EventUpdateData = z.infer<typeof EventUpdateSchema>;

export const EventCreateSchema = z.object({
    title: z.string().min(1, { message: "Der Titel darf nicht leer sein." }),
    type: z.string(),
    description: z.string().min(1, { message: "Die Beschreibung darf nicht leer sein." }).nullable(),
    registration_from: z.string().min(1, { message: "Das Startdatum ist erforderlich." }),
    registration_till: z.string().min(1, { message: "Das Enddatum ist erforderlich." }),
})
    .refine((data) => {
        const fromDate = new Date(data.registration_from);
        const tillDate = new Date(data.registration_till);

        if (isNaN(fromDate.getTime()) || isNaN(tillDate.getTime())) {
            return true;
        }

        return tillDate >= fromDate;
    }, {
        message: "Das Enddatum der Registrierung darf nicht vor dem Startdatum liegen.",
        path: ["registration_till"],
    });

export type EventCreateData = z.infer<typeof EventCreateSchema>;

