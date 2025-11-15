drop policy "Team-Read for all" on "public"."team";

create policy "Team-Read for all"
    on "public"."team"
    as permissive
    for select
    to public
    using (true);



