create type "public"."event_type" as enum ('TUMBLING_CLASS');

create type "public"."recurrence_type" as enum ('ONCE', 'WEEKLY');

create type "public"."day_of_week" as enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

create table "public"."event"
(
    "id"                uuid                     not null default gen_random_uuid(),
    "title"             text                     not null,
    "type"              public.event_type        not null,
    "description"       text,
    "registration_from" timestamp with time zone not null,
    "registration_till" timestamp with time zone not null,
    "created_at"        timestamp with time zone not null default now()
);


alter table "public"."event"
    enable row level security;


create table "public"."event_slot"
(
    "id"               uuid                     not null default gen_random_uuid(),
    "event_id"         uuid                     not null,
    "created_at"       timestamp with time zone not null default now(),
    "title"            text,
    "location"         text,
    "duration_minutes" smallint                 not null,
    "recurrence_type"  public.recurrence_type   not null,
    "slot_start"       timestamp with time zone,
    "day_of_week"      public.day_of_week,
    "start_time"       time with time zone
);

alter table "public"."event_slot"
    enable row level security;

CREATE UNIQUE INDEX event_pkey ON public.event USING btree (id);

CREATE UNIQUE INDEX event_slot_pkey ON public.event_slot USING btree (id);

alter table "public"."event"
    add constraint "event_pkey" PRIMARY KEY using index "event_pkey";

alter table "public"."event_slot"
    add constraint "event_slot_pkey" PRIMARY KEY using index "event_slot_pkey";

alter table "public"."event_slot"
    add constraint "event_slot_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.event (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_slot"
    validate constraint "event_slot_event_id_fkey";

grant select on table "public"."event" to "anon";
grant select on table "public"."event_slot" to "anon";

grant all on table "public"."event" to "authenticated", "service_role";
grant all on table "public"."event_slot" to "authenticated", "service_role";

create policy "Event-All for authenticated"
    on "public"."event"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Event-Read for all"
    on "public"."event"
    as permissive
    for select
    to public
    using (true);

create policy "Event_Slot-All for authenticated"
    on "public"."event_slot"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Event_Slot-Read for all"
    on "public"."event_slot"
    as permissive
    for select
    to public
    using (true);
