drop policy "Routine-All for Authenticated" on "public"."routine";

drop policy "Routine_Athlete-All for Authenticated" on "public"."routine_athlete";

drop policy "Routine_Formation-All for Authenticated" on "public"."routine_formation";

drop policy "Routine_Formation_Position-All for Authenticated" on "public"."routine_formation_position";

create table "public"."routine_collaborator"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "routine_id" uuid,
    "user_id"    uuid                     not null,
    "created_at" timestamp with time zone not null default now()
);

CREATE UNIQUE INDEX routine_collaborator_pkey ON public.routine_collaborator USING btree (id);
CREATE UNIQUE INDEX routine_collaborator_routine_id_user_id_key ON public.routine_collaborator USING btree (routine_id, user_id);

alter table "public"."routine_collaborator"
    add constraint "routine_collaborator_pkey" PRIMARY KEY using index "routine_collaborator_pkey";

alter table "public"."routine_collaborator"
    add constraint "routine_collaborator_routine_id_fkey" FOREIGN KEY (routine_id) REFERENCES public.routine (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_collaborator"
    validate constraint "routine_collaborator_routine_id_fkey";

alter table "public"."routine_collaborator"
    add constraint "routine_collaborator_routine_id_user_id_key" UNIQUE using index "routine_collaborator_routine_id_user_id_key";

alter table "public"."routine_collaborator"
    add constraint "routine_collaborator_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_collaborator"
    validate constraint "routine_collaborator_user_id_fkey";

set check_function_bodies = off;

grant all on table "public"."routine_collaborator" to "service_role", "authenticated";

alter table "public"."routine_collaborator"
    enable row level security;

delete
from public.routine
WHERE true;

alter table "public"."routine"
    add column "owner_id" uuid not null default auth.uid();


create policy "Routine-All for Authenticated"
    on "public"."routine"
    as permissive
    for all
    to authenticated
    using (((owner_id = auth.uid()) OR (EXISTS (SELECT 1
                                                FROM public.routine_collaborator
                                                WHERE ((routine_collaborator.routine_id = routine.id) AND
                                                       (routine_collaborator.user_id = auth.uid()))))));

create policy "Routine_Athlete-All for Authenticated"
    on "public"."routine_athlete"
    as permissive
    for all
    to authenticated
    using ((EXISTS (SELECT 1
                    FROM public.routine
                    WHERE (routine.id = routine_athlete.routine_id))));



create policy "Routine_Formation-All for Authenticated"
    on "public"."routine_formation"
    as permissive
    for all
    to authenticated
    using ((EXISTS (SELECT 1
                    FROM public.routine
                    WHERE (routine.id = routine_formation.routine_id))));



create policy "Routine_Formation_Position-All for Authenticated"
    on "public"."routine_formation_position"
    as permissive
    for all
    to authenticated
    using ((EXISTS (SELECT 1
                    FROM public.routine_formation
                    WHERE (routine_formation.id = routine_formation_position.routine_formation_id))));

