create table public.team
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    name       text                                               not null
        unique,
    created_at timestamp with time zone default now()             not null,
    updated_at timestamp with time zone
);

ALTER TABLE public.team
    ENABLE ROW LEVEL SECURITY;

create policy "Team-All for Authenticated"
    on "public"."team"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Team-Read for all"
    on "public"."team"
    as PERMISSIVE
    FOR ALL
    to public
    using (
    true
    );
