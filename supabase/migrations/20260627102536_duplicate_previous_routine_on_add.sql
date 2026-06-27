CREATE OR REPLACE FUNCTION public.copy_positions_from_previous_formation()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
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
$function$;

CREATE TRIGGER after_insert_routine_formation_copy_positions
    AFTER INSERT
    ON public.routine_formation
    FOR EACH ROW
EXECUTE FUNCTION public.copy_positions_from_previous_formation();

