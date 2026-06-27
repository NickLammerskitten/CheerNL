alter table "public"."routine_athlete"
    add column index integer not null default 0;


CREATE OR REPLACE FUNCTION public.set_new_formation_sort_index()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_new_routine_athlete_index()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
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
$function$
;

CREATE TRIGGER before_insert_athlete_set_index
    BEFORE INSERT
    ON public.routine_athlete
    FOR EACH ROW
    WHEN ((new.index IS NULL))
EXECUTE FUNCTION public.set_new_routine_athlete_index();

CREATE TRIGGER before_insert_formation_set_index
    BEFORE INSERT
    ON public.routine_formation
    FOR EACH ROW
    WHEN ((new.sort_index IS NULL))
EXECUTE FUNCTION public.set_new_formation_sort_index();