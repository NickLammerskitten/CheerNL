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
    id               uuid                     default gen_random_uuid() not null
        primary key,
    event_id         uuid                                               not null
        references public.event
            on update cascade on delete cascade,
    created_at       timestamp with time zone default now()             not null,
    title            text,
    location         text,
    duration_minutes smallint                                           not null,
    recurrence_type  recurrence_type                                    not null,
    slot_start       timestamp with time zone,
    day_of_week      public.day_of_week,
    start_time       time with time zone
);

ALTER TABLE public.event
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_slot
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