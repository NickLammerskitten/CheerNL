create function training_plan_athlete_full_name(training_plan_athlete) returns text as $$
select $1.first_name || ' ' || $1.last_name;
$$ language sql immutable;