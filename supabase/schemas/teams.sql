create table public.team
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    name       text                                               not null
        unique,
    created_at timestamp with time zone default now()             not null,
    updated_at timestamp with time zone
);

alter table public.team
    owner to supabase_admin;

grant delete, insert, references, select, trigger, truncate, update on public.team to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.team to anon;

grant delete, insert, references, select, trigger, truncate, update on public.team to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.team to service_role;

