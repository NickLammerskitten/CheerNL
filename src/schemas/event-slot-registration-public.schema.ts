import { EventType } from "@/types/event-type";
import { z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const EventSlotRegistrationPublicCreateSchema = z.object({
    event_id: z.string().min(1),
    event_slot_id: z.string().min(1, { message: "Der Termin muss ausgewählt werden" }),
    team_id: z.string().min(1, { message: "Das Team muss ausgewählt werden" }),
    first_name: z.string().min(2, { message: "Der Vorname darf nicht leer sein" }),
    last_name: z.string().min(2, { message: "Der Nachname darf nicht leer sein" }),
    email: z.email({ message: "Die E-Mail Adresse muss valide sein." }),
    phone: z.string().regex(phoneRegex, "Die Telefonnummer muss valide sein"),
    note: z.string().nullable(),
    waitlist: z.boolean().default(false),
});

export const createEventSlotRegistrationSchema = (eventType: EventType) => {
    if (eventType === EventType.TUMBLINGClASS) {
        return EventSlotRegistrationPublicCreateSchema.extend({
            note: z.string().min(1, { message: "Das Lernziel darf nicht leer sein." }),
        });
    }

    return EventSlotRegistrationPublicCreateSchema;
};

export type EventRegistrationPublicData = z.infer<typeof EventSlotRegistrationPublicCreateSchema>;