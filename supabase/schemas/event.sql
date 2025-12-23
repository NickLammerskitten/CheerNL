create type public.event_type as enum ('TUMBLING_CLASS');

comment on type public.event_type is 'There are different events with individual handling';

create type public.recurrence_type as enum ('ONCE', 'WEEKLY');

create type public.day_of_week as enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

create table public.event
(
    id                uuid                     default gen_random_uuid() not null
        primary key,
    title             text                                               not null,
    type              public.event_type                                  not null,
    description       text,
    registration_from timestamptz                                        not null,
    registration_till timestamptz                                        not null,
    created_at        timestamp with time zone default now()             not null
);

create table public.event_slot
(
    id                uuid                     default gen_random_uuid() not null
        primary key,
    event_id          uuid                                               not null
        references public.event
            on update cascade on delete cascade,
    title             text,
    location          text,
    duration_minutes  smallint                                           not null,
    recurrence_type   recurrence_type                                    not null,
    slot_start        timestamp with time zone,
    slot_end          timestamp with time zone,
    day_of_week       public.day_of_week,
    max_registrations int,
    start_time        time with time zone,
    created_at        timestamp with time zone default now()             not null
);

create table public.event_slot_coach
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    slot_id    uuid                                               not null
        references public.event_slot
            on update cascade on delete cascade,
    coach_id   uuid                                               references public.coach on update cascade on delete set null,
    created_at timestamp with time zone default now()             not null
);

create table public.event_registration
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    event_id      uuid                                               not null
        references public.event
            on update cascade on delete cascade,
    event_slot_id uuid                                               not null
        references public.event_slot
            on update cascade on delete cascade,
    first_name    text                                               not null,
    last_name     text                                               not null,
    email         text                                               not null,
    phone         text                                               not null,
    note          text,
    created_at    timestamp with time zone default now()             not null
);

ALTER TABLE public.event
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_slot
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_slot_coach
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_registration
    ENABLE ROW LEVEL SECURITY;

create policy "Event-All for authenticated"
    on "public"."event"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Event-Read for all"
    on "public"."event"
    as PERMISSIVE
    FOR SELECT
    to public
    using (
    true
    );

create policy "Event_Slot-All for authenticated"
    on "public"."event_slot"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Event_Slot-Read for all"
    on "public"."event_slot"
    as PERMISSIVE
    FOR SELECT
    to public
    using (
    true
    );

create policy "Event_Slot_Coach-All for authenticated"
    on "public"."event_slot_coach"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Event_Slot_Coach-Read for all"
    on "public"."event_slot_coach"
    as PERMISSIVE
    FOR SELECT
    to public
    using (
    true
    );

create policy "Event_Registration-Write for all"
    on "public"."event_registration"
    as PERMISSIVE
    FOR INSERT
    to public
    with check (
    true
    );

create policy "Event_Registration-All for authenticated"
    on "public"."event_registration"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

CREATE OR REPLACE FUNCTION public.get_event_registration_count(event_id_input uuid)
    RETURNS integer
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
begin
    return (select count(*)
            from "public"."event_registration"
            where event_registration.event_slot_id = event_id_input);
end;
$function$
;