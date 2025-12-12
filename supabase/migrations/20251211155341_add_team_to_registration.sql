DELETE from public.event_registration;

alter table "public"."event_registration"
    add column team_id uuid not null
        references public.team
            on update cascade on delete cascade;
