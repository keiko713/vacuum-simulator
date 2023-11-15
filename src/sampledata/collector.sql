-- silent whatever Postgres wants to say
\set QUIET on
-- set simulator output csv file name
\o vacuum_simulator_out.csv
-- output with csv format
\pset format csv
SELECT
    extract(epoch from NOW())::integer as "collectedAt",
    s.n_dead_tup as "deadTuples",
    s.n_live_tup as "liveTuples",
    CASE WHEN c.relfrozenxid <> '0' THEN pg_catalog.age(c.relfrozenxid) ELSE 0 END as "frozenxidAge",
    CASE WHEN c.relminmxid <> '0' THEN pg_catalog.mxid_age(c.relminmxid) ELSE 0 END AS "minmxidAge",
    s.n_tup_del as "deletes",
    s.n_tup_ins as "inserts",
    s.n_tup_upd as "updates",
    s.n_tup_hot_upd as "hotUpdates",
    s.n_ins_since_vacuum as "insertsSinceVacuum"
FROM pg_catalog.pg_class c JOIN pg_catalog.pg_stat_user_tables s ON c.oid = s.relid
WHERE c.oid = 11990219; -- update oid to the oid of the table that you want to monitor
-- tuples only mode, do not show column names for subsequent runs
\t
-- collect stats for every 10 mins
\watch 600
