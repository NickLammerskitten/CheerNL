import { z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const EventRegistrationPublicCreateSchema = z.object({
    team: z.string().min(1, { message: "Das Team muss ausgewählt werden" }),
    slot: z.string().min(1, { message: "Der Termin muss ausgewählt werden" }),
    first_name: z.string().min(2, { message: "Der Vorname darf nicht leer sein" }),
    last_name: z.string().min(2, { message: "Der Nachname darf nicht leer sein" }),
    email: z.email({ message: "Die E-Mail Adresse muss valide sein."}),
    phone: z.string().regex(phoneRegex, "Die Telefonnummer muss valide sein"),
})

export type EventRegistrationPublicData = z.infer<typeof EventRegistrationPublicCreateSchema>;