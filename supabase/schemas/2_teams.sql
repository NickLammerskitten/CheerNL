create table public.team
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    name       text                                               not null
        unique,
    created_at timestamp with time zone default now()             not null,
    updated_at timestamp with time zone
);

create table public.coach_assignment
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    created_at timestamp with time zone default now()             not null,
    coach_id   uuid                                               not null
        references public.coach
            on update cascade on delete cascade,
    team_id    uuid                                               not null
        references public.team
            on update cascade on delete cascade
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
    FOR SELECT
    to public
    using (
    true
    );

ALTER TABLE public.coach_assignment
    ENABLE ROW LEVEL SECURITY;

create policy "CoachAssignment-All for Authenticated"
    on "public"."coach_assignment"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "CoachAssignment-Read for all"
    on "public"."coach_assignment"
    as PERMISSIVE
    FOR SELECT
    to public
    using (
    true
    );
