create table public.routine
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    name       text                                               not null,
    team_id    uuid
                                                                  references public.team
                                                                      on update cascade on delete set null,
    created_at timestamp with time zone default now()             not null
);


ALTER TABLE public.routine
    ENABLE ROW LEVEL SECURITY;

create policy "Routine-All for Authenticated"
    on "public"."routine"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );
