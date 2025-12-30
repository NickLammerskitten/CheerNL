create table public.training_plan
(
    id                   uuid                     default gen_random_uuid() not null
        primary key,
    name                 text                                               not null,
    google_drive_file_id text,
    created_at           timestamp with time zone default now()             not null
);

ALTER TABLE public.training_plan
    ENABLE ROW LEVEL SECURITY;

create policy "Event-All for authenticated"
    on "public"."training_plan"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );