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


create table public.routine_athlete
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    routine_id uuid references public.routine on update cascade on delete cascade,
    index      int,
    name       text,
    created_at timestamp with time zone default now()             not null
);

create table public.routine_formation
(
    id         uuid                     default gen_random_uuid() not null
        primary key,
    routine_id uuid references public.routine on update cascade on delete cascade,
    sort_index int                                                not null,
    name       text,
    created_at timestamp with time zone default now()             not null
);

create table public.routine_formation_position
(
    id                   uuid                     default gen_random_uuid() not null
        primary key,
    routine_athlete_id   uuid references public.routine_athlete on update cascade on delete cascade,
    routine_formation_id uuid references public.routine_formation on update cascade on delete cascade,
    pos_x                numeric                                            not null,
    pos_y                numeric                                            not null,
    created_at           timestamp with time zone default now()             not null
);


ALTER TABLE public.routine
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.routine_athlete
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.routine_formation
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.routine_formation_position
    ENABLE ROW LEVEL SECURITY;

create policy "Routine-All for Authenticated"
    on "public"."routine"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Routine_Athlete-All for Authenticated"
    on "public"."routine_athlete"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Routine_Formation-All for Authenticated"
    on "public"."routine_formation"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );

create policy "Routine_Formation_Position-All for Authenticated"
    on "public"."routine_formation_position"
    as PERMISSIVE
    FOR ALL
    to authenticated
    using (
    true
    );


-- Automatic sort index for formation
create or replace function public.set_new_formation_sort_index()
    returns trigger
    language plpgsql
    security definer
as
$$
begin
    -- Wir suchen den höchsten sort_index für die aktuelle routine_id
    -- COALESCE sorgt dafür, dass bei der allerersten Formation aus NULL eine -1 wird,
    -- sodass -1 + 1 = 0 ergibt.
    select coalesce(max(sort_index), -1) + 1
    into new.sort_index
    from public.routine_formation
    where routine_id = new.routine_id;

    return new;
end;
$$;

create trigger before_insert_formation_set_index
    before insert
    on public.routine_formation
    for each row
    when (new.sort_index is null)
execute function public.set_new_formation_sort_index();


-- Automatic sort index for Routine Athlete
create or replace function public.set_new_routine_athlete_index()
    returns trigger
    language plpgsql
    security definer
as
$$
begin
    -- Wir suchen den höchsten index für die aktuelle routine_id
    -- COALESCE sorgt dafür, dass bei dem allerersten Athleten aus NULL eine -1 wird,
    -- sodass -1 + 1 = 0 ergibt.
    select coalesce(max(index), -1) + 1
    into new.index
    from public.routine_athlete
    where routine_id = new.routine_id;

    return new;
end;
$$;

create trigger before_insert_athlete_set_index
    before insert
    on public.routine_athlete
    for each row
    when (new.index is null)
execute function public.set_new_routine_athlete_index();

-- Funktion: Füge neuen Athleten zu allen Formationen hinzu
create or replace function public.add_athlete_to_all_formations()
    returns trigger
    language plpgsql
    security definer
as
$$
begin
    -- Wir fügen in formation_position Werte ein:
    -- Wir wählen die IDs aller Formationen aus, die zur selben routine_id gehören.
    -- new.id ist die UUID des gerade frisch erstellten Athleten.
    -- 7.0, 7.0 sind die Start-Koordinaten (Mitte der Matte).
    insert into public.routine_formation_position (routine_formation_id, routine_athlete_id, pos_x, pos_y)
    select id, new.id, 7.0, 7.0
    from public.routine_formation
    where routine_id = new.routine_id;

    return new;
end;
$$;

-- Trigger: Feuert NACHDEM der Athlet gespeichert (und sein index berechnet) wurde
create trigger after_insert_routine_athlete_add_positions
    after insert
    on public.routine_athlete
    for each row
execute function public.add_athlete_to_all_formations();



create or replace function public.copy_positions_from_previous_formation()
    returns trigger
    language plpgsql
    security definer
as
$$
declare
    prev_formation_id uuid;
begin
    -- 1. Finde die ID der Formation, die vor dieser (new.sort_index) den höchsten Index hatte
    select id
    into prev_formation_id
    from public.routine_formation
    where routine_id = new.routine_id
      and sort_index < new.sort_index
    order by sort_index desc
    limit 1;

    -- 2. Fallunterscheidung: Gibt es eine vorherige Formation?
    if prev_formation_id is not null then
        -- JA: Kopiere alle Positionen dieser vorherigen Formation für die neue Formation
        insert into public.routine_formation_position (routine_formation_id, routine_athlete_id, pos_x, pos_y)
        select new.id, routine_athlete_id, pos_x, pos_y
        from public.routine_formation_position
        where routine_formation_id = prev_formation_id;
    else
        -- NEIN: Es ist die erste Formation. Initialisiere alle existierenden Athleten in der Mitte (7.0, 7.0)
        insert into public.routine_formation_position (routine_formation_id, routine_athlete_id, pos_x, pos_y)
        select new.id, id, 7.0, 7.0
        from public.routine_athlete
        where routine_id = new.routine_id;
    end if;

    return new;
end;
$$;

-- Trigger: Feuert, nachdem eine neue Formation in der DB angelegt wurde
create trigger after_insert_routine_formation_copy_positions
    after insert
    on public.routine_formation
    for each row
execute function public.copy_positions_from_previous_formation();


ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_formation;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_athlete;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_formation_position;