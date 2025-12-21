create table "public"."event_slot_coach"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "slot_id"    uuid                     not null,
    "coaches_id" uuid,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."event_slot_coach"
    enable row level security;

alter table "public"."event_registration"
    add column "note" text;

CREATE UNIQUE INDEX event_slot_coach_pkey ON public.event_slot_coach USING btree (id);

alter table "public"."event_slot_coach"
    add constraint "event_slot_coach_pkey" PRIMARY KEY using index "event_slot_coach_pkey";

alter table "public"."event_slot_coach"
    add constraint "event_slot_coach_coaches_id_fkey" FOREIGN KEY (coaches_id) REFERENCES public.coach (id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."event_slot_coach"
    validate constraint "event_slot_coach_coaches_id_fkey";

alter table "public"."event_slot_coach"
    add constraint "event_slot_coach_slot_id_fkey" FOREIGN KEY (slot_id) REFERENCES public.event_slot (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_slot_coach"
    validate constraint "event_slot_coach_slot_id_fkey";

grant select on table "public"."event_slot_coach" to "anon";

grant all on table "public"."event_slot_coach" to "authenticated", "service_role";

create policy "Event_Slot_Coach-All for authenticated"
    on "public"."event_slot_coach"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Event_Slot_Coach-Read for all"
    on "public"."event_slot_coach"
    as permissive
    for select
    to public
    using (true);
