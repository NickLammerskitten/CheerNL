CREATE OR REPLACE FUNCTION public.add_athlete_to_all_formations()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
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
$function$
;

CREATE TRIGGER after_insert_routine_athlete_add_positions
    AFTER INSERT
    ON public.routine_athlete
    FOR EACH ROW
EXECUTE FUNCTION public.add_athlete_to_all_formations();
