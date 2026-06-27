create policy "Routine_collaborator-All for Authenticated"
    on "public"."routine_collaborator"
    as permissive
    for all
    to authenticated
    using (true);