create table public.coach
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    created_at timestamp with time zone default now()             not null,
    user_id    uuid                                               not null
        unique
        references auth.users
            on update cascade on delete cascade,
    name       text                                               not null
);


ALTER TABLE public.coach
    ENABLE ROW LEVEL SECURITY;

create policy "Coach-All for Authenticated"
    on "public"."coach"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Coach-Read for all"
    on "public"."coach"
    as PERMISSIVE
    FOR SELECT
    to public
    using (
    true
    );
