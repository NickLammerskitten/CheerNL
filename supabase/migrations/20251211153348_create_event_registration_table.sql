create table "public"."event_registration"
(
    "id"            uuid                     not null default gen_random_uuid(),
    "event_id"      uuid                     not null,
    "event_slot_id" uuid                     not null,
    "first_name"    text                     not null,
    "last_name"     text                     not null,
    "email"         text                     not null,
    "phone"         text                     not null,
    "created_at"    timestamp with time zone not null default now()
);


alter table "public"."event_registration"
    enable row level security;

CREATE UNIQUE INDEX event_registration_pkey ON public.event_registration USING btree (id);

alter table "public"."event_registration"
    add constraint "event_registration_pkey" PRIMARY KEY using index "event_registration_pkey";

alter table "public"."event_registration"
    add constraint "event_registration_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.event (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_registration"
    validate constraint "event_registration_event_id_fkey";

alter table "public"."event_registration"
    add constraint "event_registration_event_slot_id_fkey" FOREIGN KEY (event_slot_id) REFERENCES public.event_slot (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_registration"
    validate constraint "event_registration_event_slot_id_fkey";

grant insert, select on table "public"."event_registration" to "anon";

grant all on table "public"."event_registration" to "authenticated", "service_role";

create policy "Event_Registration-All for authenticated"
    on "public"."event_registration"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Event_Registration-Write for all"
    on "public"."event_registration"
    as permissive
    for insert
    to public
    with check (true);



