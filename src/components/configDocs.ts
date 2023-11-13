type ConfigDetailType = {
  name: string;
  type: "integer" | "floating point";
  default: number;
  min: number;
  max: number;
  restart: boolean;
  description: string;
  storageParameterName: string;
};

export type ConfigNameType =
  | "autovacuumVacuumThreshold"
  | "autovacuumVacuumScaleFactor"
  | "autovacuumFreezeMaxAge"
  | "vacuumFreezeMinAge"
  | "vacuumFreezeTableAge"
  | "autovacuumMultixactFreezeMaxAge"
  | "vacuumMultixactFreezeMinAge"
  | "vacuumMultixactFreezeTableAge"
  | "autovacuumVacuumInsertThreshold"
  | "autovacuumVacuumInsertScaleFactor";

export type ConfigDocs = {
  [key in ConfigNameType]: ConfigDetailType;
};

export const configDocs15: ConfigDocs = {
  autovacuumVacuumThreshold: {
    name: "autovacuum_vacuum_threshold",
    type: "integer",
    default: 50,
    min: 0,
    max: 2147483647,
    restart: false,
    description:
      "Specifies the minimum number of updated or deleted tuples needed to trigger a VACUUM in any one table. The default is 50 tuples. This parameter can only be set in the postgresql.conf file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_vacuum_threshold",
  },
  autovacuumVacuumScaleFactor: {
    name: "autovacuum_vacuum_scale_factor",
    type: "floating point",
    default: 0.2,
    min: 0,
    max: 100,
    restart: false,
    description:
      "Specifies a fraction of the table size to add to autovacuum_vacuum_threshold when deciding whether to trigger a VACUUM. The default is 0.2 (20% of table size). This parameter can only be set in the postgresql.conf file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_vacuum_scale_factor",
  },
  autovacuumFreezeMaxAge: {
    name: "autovacuum_freeze_max_age",
    type: "integer",
    default: 200000000,
    min: 100000,
    max: 2000000000,
    restart: true,
    description:
      "Specifies the maximum age (in transactions) that a table's pg_class.relfrozenxid field can attain before a VACUUM operation is forced to prevent transaction ID wraparound within the table. Note that the system will launch autovacuum processes to prevent wraparound even when autovacuum is otherwise disabled. Vacuum also allows removal of old files from the pg_xact subdirectory, which is why the default is a relatively low 200 million transactions. This parameter can only be set at server start, but the setting can be reduced for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_freeze_max_age",
  },
  vacuumFreezeMinAge: {
    name: "vacuum_freeze_min_age",
    type: "integer",
    default: 50000000,
    min: 0,
    max: 1000000000,
    restart: false,
    description:
      "Specifies the cutoff age (in transactions) that VACUUM should use to decide whether to trigger freezing of pages that have an older XID. The default is 50 million transactions. Although users can set this value anywhere from zero to one billion, VACUUM will silently limit the effective value to half the value of autovacuum_freeze_max_age, so that there is not an unreasonably short time between forced autovacuums.",
    storageParameterName: "autovacuum_freeze_min_age",
  },
  vacuumFreezeTableAge: {
    name: "vacuum_freeze_table_age",
    type: "integer",
    default: 150000000,
    min: 0,
    max: 2000000000,
    restart: false,
    description:
      "VACUUM performs an aggressive scan if the table's pg_class.relfrozenxid field has reached the age specified by this setting. An aggressive scan differs from a regular VACUUM in that it visits every page that might contain unfrozen XIDs or MXIDs, not just those that might contain dead tuples. The default is 150 million transactions. Although users can set this value anywhere from zero to two billion, VACUUM will silently limit the effective value to 95% of autovacuum_freeze_max_age, so that a periodic manual VACUUM has a chance to run before an anti-wraparound autovacuum is launched for the table.",
    storageParameterName: "autovacuum_freeze_table_age",
  },
  autovacuumMultixactFreezeMaxAge: {
    name: "autovacuum_multixact_freeze_max_age",
    type: "integer",
    default: 400000000,
    min: 10000,
    max: 2000000000,
    restart: true,
    description:
      "Specifies the maximum age (in multixacts) that a table's pg_class.relminmxid field can attain before a VACUUM operation is forced to prevent multixact ID wraparound within the table. Note that the system will launch autovacuum processes to prevent wraparound even when autovacuum is otherwise disabled. Vacuuming multixacts also allows removal of old files from the pg_multixact/members and pg_multixact/offsets subdirectories, which is why the default is a relatively low 400 million multixacts. This parameter can only be set at server start, but the setting can be reduced for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_multixact_freeze_max_age",
  },
  vacuumMultixactFreezeMinAge: {
    name: "vacuum_multixact_freeze_min_age",
    type: "integer",
    default: 5000000,
    min: 0,
    max: 1000000000,
    restart: false,
    description:
      "Specifies the cutoff age (in multixacts) that VACUUM should use to decide whether to trigger freezing of pages with an older multixact ID. The default is 5 million multixacts. Although users can set this value anywhere from zero to one billion, VACUUM will silently limit the effective value to half the value of autovacuum_multixact_freeze_max_age, so that there is not an unreasonably short time between forced autovacuums.",
    storageParameterName: "autovacuum_multixact_freeze_min_age",
  },
  vacuumMultixactFreezeTableAge: {
    name: "vacuum_multixact_freeze_table_age",
    type: "integer",
    default: 150000000,
    min: 0,
    max: 2000000000,
    restart: false,
    description:
      "VACUUM performs an aggressive scan if the table's pg_class.relminmxid field has reached the age specified by this setting. An aggressive scan differs from a regular VACUUM in that it visits every page that might contain unfrozen XIDs or MXIDs, not just those that might contain dead tuples. The default is 150 million multixacts. Although users can set this value anywhere from zero to two billion, VACUUM will silently limit the effective value to 95% of autovacuum_multixact_freeze_max_age, so that a periodic manual VACUUM has a chance to run before an anti-wraparound is launched for the table.",
    storageParameterName: "autovacuum_multixact_freeze_table_age",
  },
  autovacuumVacuumInsertThreshold: {
    name: "autovacuum_vacuum_insert_threshold",
    type: "integer",
    default: 1000,
    min: -1,
    max: 2147483647,
    restart: false,
    description:
      "Specifies the number of inserted tuples needed to trigger a VACUUM in any one table. The default is 1000 tuples. If -1 is specified, autovacuum will not trigger a VACUUM operation on any tables based on the number of inserts. This parameter can only be set in the postgresql.conf file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_vacuum_insert_threshold",
  },
  autovacuumVacuumInsertScaleFactor: {
    name: "autovacuum_vacuum_insert_scale_factor",
    type: "floating point",
    default: 0.2,
    min: 0,
    max: 100,
    restart: false,
    description:
      "Specifies a fraction of the table size to add to autovacuum_vacuum_insert_threshold when deciding whether to trigger a VACUUM. The default is 0.2 (20% of table size). This parameter can only be set in the postgresql.conf file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.",
    storageParameterName: "autovacuum_vacuum_insert_scale_factor",
  },
};
