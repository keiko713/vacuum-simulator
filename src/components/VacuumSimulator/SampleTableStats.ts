import issueReferencesJson from "../../sampledata/issue_references.json";
import serversJson from "../../sampledata/servers.json";
import schemaTableStats35dJson from "../../sampledata/schema_table_stats_35d.json";
import postgresRolesJson from "../../sampledata/postgres_roles.json";
import { Datum, TableStatsType } from "./simulateVacuum";
import { getCustomTableStatsList } from "./CustomTableStats";
import pganalyzeDefaultConfig from "../../sampledata/pganalyze_deafult_config.json";
import pg15DefaultConfig from "../../sampledata/deafult_config.json";

export type TableData = {
  key: string;
  name: string;
  stats: TableStatsType;
};

type TableStatsTypeJSON = {
  deadTuples: number[][];
  liveTuples: number[][];
  frozenxidAge: number[][];
  minmxidAge: number[][];
  deletes: number[][];
  inserts: number[][];
  updates: number[][];
  hotUpdates: number[][];
  insertsSinceVacuum: number[][];
};

const convertStatsToDatum = (
  inputStats: TableStatsTypeJSON,
): TableStatsType => {
  return {
    deadTuples: inputStats.deadTuples as Datum[],
    liveTuples: inputStats.liveTuples as Datum[],
    frozenxidAge: inputStats.frozenxidAge as Datum[],
    minmxidAge: inputStats.minmxidAge as Datum[],
    deletes: inputStats.deletes as Datum[],
    inserts: inputStats.inserts as Datum[],
    updates: inputStats.updates as Datum[],
    hotUpdates: inputStats.hotUpdates as Datum[],
    insertsSinceVacuum: inputStats.insertsSinceVacuum as Datum[],
  };
};

export const SampleTableList: TableData[] = [
  {
    key: "issue_references",
    name: "Table with dead rows VACUUMs",
    stats: convertStatsToDatum(issueReferencesJson.tableStats),
  },
  {
    key: "postgres_roles",
    name: "Table with freeze age VACUUMs",
    stats: convertStatsToDatum(postgresRolesJson.tableStats),
  },
  {
    key: "schema_table_stats_35d",
    name: "Table with inserts VACUUMs",
    stats: convertStatsToDatum(schemaTableStats35dJson.tableStats),
  },
  {
    key: "servers",
    name: "Table with too many VACUUMs",
    stats: convertStatsToDatum(serversJson.tableStats),
  },
];

export const isSampleTableName = (key: string) => {
  return SampleTableList.map((table) => table.key).includes(key);
};

export const getTableStats = (key: string) => {
  return [...SampleTableList, ...getCustomTableStatsList()].find((stats) => {
    return stats.key === key;
  });
};

export const getDefaultConfig = (tableName: string) => {
  if (isSampleTableName(tableName)) {
    // sample is based on pganalyze data
    return pganalyzeDefaultConfig;
  } else {
    return pg15DefaultConfig;
  }
};
