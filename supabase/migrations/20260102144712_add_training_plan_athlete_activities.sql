alter table "public"."training_plan_athlete"
    drop constraint if exists "training_plan_athlete_training_plan_id_fkey";

alter table "public"."training_plan_athlete"
    add constraint "training_plan_athlete_training_plan_id_fkey" FOREIGN KEY (training_plan_id) REFERENCES public.training_plan (id) ON UPDATE SET NULL ON DELETE SET NULL not valid;

create table "public"."training_plan_athlete_activity"
(
    "id"                       uuid                     not null default gen_random_uuid(),
    "training_plan_athlete_id" uuid                     not null,
    "google_drive_folder_id"   text                     not null,
    "timestamp"                timestamp with time zone not null,
    "action"                   text                     not null,
    "actor"                    text                     not null,
    "file_id"                  text,
    "file_name"                text,
    "file_mime_type"           text,
    "file_link"                text,
    "created_at"               timestamp with time zone not null default now()
);

alter table "public"."training_plan_athlete_activity"
    enable row level security;

CREATE UNIQUE INDEX training_plan_athlete_activity_pkey ON public.training_plan_athlete_activity USING btree (id);

alter table "public"."training_plan_athlete_activity"
    add constraint "training_plan_athlete_activity_pkey" PRIMARY KEY using index "training_plan_athlete_activity_pkey";

alter table "public"."training_plan_athlete_activity"
    add constraint "training_plan_athlete_activity_training_plan_athlete_id_fkey" FOREIGN KEY (training_plan_athlete_id) REFERENCES public.training_plan_athlete (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."training_plan_athlete_activity"
    validate constraint "training_plan_athlete_activity_training_plan_athlete_id_fkey";

alter table "public"."training_plan_athlete"
    validate constraint "training_plan_athlete_training_plan_id_fkey";

grant all on table "public"."training_plan_athlete_activity" to "authenticated", "service_role";

create policy "Training_Plan_Athlete_Activity-All for authenticated"
    on "public"."training_plan_athlete_activity"
    as permissive
    for all
    to authenticated
    using (true);
