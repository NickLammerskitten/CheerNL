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
    training_plan_id       uuid                                               references public.training_plan_athlete on update set null on delete set null,
    first_name             text                                               not null,
    last_name              text                                               not null,
    google_drive_folder_id text,
    google_email_address   text                                               not null,
    created_at             timestamp with time zone default now()             not null
);

ALTER TABLE public.training_plan
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.training_plan_athlete
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