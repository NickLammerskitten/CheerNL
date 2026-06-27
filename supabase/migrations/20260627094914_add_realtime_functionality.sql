create policy "Authenticated users can receive broadcasts"
    on "realtime"."messages"
    as permissive
    for select
    to authenticated
    using (true);

begin;
drop
    publication if exists supabase_realtime;

create publication supabase_realtime;
commit;

ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_formation;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_athlete;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_formation_position;