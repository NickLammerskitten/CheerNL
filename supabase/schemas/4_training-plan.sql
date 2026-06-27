create table public.training_plan
(
    id                   uuid                     default gen_random_uuid() not null
        primary key,
    name                 text                                               not null,
    google_drive_file_id text,
    created_at           timestamp with time zone default now()             not null
);

create table public.training_plan_athlete
(
    id                     uuid                     default gen_random_uuid() not null
        primary key,
    training_plan_id       uuid                                               references public.training_plan on update set null on delete set null,
    first_name             text                                               not null,
    last_name              text                                               not null,
    google_drive_folder_id text,
    google_email_address   text                                               not null,
    created_at             timestamp with time zone default now()             not null
);

create function training_plan_athlete_full_name(training_plan_athlete) returns text as $$
select $1.first_name || ' ' || $1.last_name;
$$ language sql immutable;

create table public.training_plan_athlete_activity
(
    id                       uuid                     default gen_random_uuid() not null
        primary key,
    training_plan_athlete_id uuid                                               not null
        references public.training_plan_athlete on update cascade on delete cascade,
    google_drive_folder_id   text                                               not null,
    timestamp                timestamp with time zone                           not null,

    action                   text                                               not null,
    actor                    text                                               not null,
    file_id                  text,
    file_name                text,
    file_mime_type           text,
    file_link                text,
    created_at               timestamp with time zone default now()             not null
);

ALTER TABLE public.training_plan
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.training_plan_athlete
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.training_plan_athlete_activity
    ENABLE ROW LEVEL SECURITY;

create policy "Training_Plan-All for authenticated"
    on "public"."training_plan"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Training_Plan_Athlete-All for authenticated"
    on "public"."training_plan_athlete"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Training_Plan_Athlete_Activity-All for authenticated"
    on "public"."training_plan_athlete_activity"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );