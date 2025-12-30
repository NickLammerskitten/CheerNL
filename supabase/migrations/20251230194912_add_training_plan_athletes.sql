drop policy "Event-All for authenticated" on "public"."training_plan";

create table "public"."training_plan_athlete"
(
    "id"                     uuid                     not null default gen_random_uuid(),
    "training_plan_id"       uuid,
    "first_name"             text                     not null,
    "last_name"              text                     not null,
    "google_drive_folder_id" text,
    "google_email_address"   text                     not null,
    "created_at"             timestamp with time zone not null default now()
);


alter table "public"."training_plan_athlete"
    enable row level security;

CREATE UNIQUE INDEX training_plan_athlete_pkey ON public.training_plan_athlete USING btree (id);

alter table "public"."training_plan_athlete"
    add constraint "training_plan_athlete_pkey" PRIMARY KEY using index "training_plan_athlete_pkey";

alter table "public"."training_plan_athlete"
    add constraint "training_plan_athlete_training_plan_id_fkey" FOREIGN KEY (training_plan_id) REFERENCES public.training_plan_athlete (id) ON UPDATE SET NULL ON DELETE SET NULL not valid;

alter table "public"."training_plan_athlete"
    validate constraint "training_plan_athlete_training_plan_id_fkey";

grant all on table "public"."training_plan_athlete" to "authenticated", "service_role";

grant all on table "public"."training_plan" to "authenticated", "service_role";

create policy "Training_Plan-All for authenticated"
    on "public"."training_plan"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Training_Plan_Athlete-All for authenticated"
    on "public"."training_plan_athlete"
    as permissive
    for all
    to authenticated
    using (true);
