drop function if exists "public"."get_event_registration_count"(event_id_input uuid);

set check_function_bodies = off;

CREATE
    OR REPLACE FUNCTION public.get_event_registration_count(event_id_input uuid, with_waitlist boolean)
    RETURNS integer
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$function$
begin
    return (select count(*)
            from "public"."event_registration"
            where event_registration.event_slot_id = event_id_input
              AND (with_waitlist IS TRUE OR waitlist IS NOT TRUE));
end;
$function$;
