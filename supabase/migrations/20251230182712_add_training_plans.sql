create table "public"."training_plan"
(
    "id"                   uuid                     not null default gen_random_uuid(),
    "name"                 text                     not null,
    "google_drive_file_id" text,
    "created_at"           timestamp with time zone not null default now()
);


alter table "public"."training_plan"
    enable row level security;

CREATE UNIQUE INDEX training_plan_pkey ON public.training_plan USING btree (id);

alter table "public"."training_plan"
    add constraint "training_plan_pkey" PRIMARY KEY using index "training_plan_pkey";

grant delete on table "public"."training_plan" to "authenticated", "service_role";

create policy "Event-All for authenticated"
    on "public"."training_plan"
    as permissive
    for all
    to authenticated
    using (true);



