create policy "Authenticated users can receive broadcasts"
    on "realtime"."messages"
    for select
    to authenticated
    using ( true );

begin;
drop
    publication if exists supabase_realtime;

create publication supabase_realtime;
commit;
