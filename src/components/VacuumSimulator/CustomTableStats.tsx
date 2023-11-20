import { toSnakeCase } from "../util";
import { InputData } from "./TableStatsUploader";
import { TableStatsType } from "./simulateVacuum";

export type CustomTableStats = {
  key: string;
  name: string;
  stats: TableStatsType;
};

const localStorageKey = "customTableStats";

export const addCustomTableStats = (name: string, inputData: InputData[]) => {
  const statsList = getCustomTableStatsList();

  const tableStats = {
    deadTuples: [],
    liveTuples: [],
    frozenxidAge: [],
    minmxidAge: [],
    deletes: [],
    inserts: [],
    updates: [],
    hotUpdates: [],
    insertsSinceVacuum: [],
  } as TableStatsType;

  inputData.forEach((data, i, arr) => {
    if (i !== 0) {
      const prevData = arr[i - 1];
      const collectedAt = +data.collectedAt;
      tableStats.deadTuples.push([collectedAt, +data.deadTuples]);
      tableStats.liveTuples.push([collectedAt, +data.liveTuples]);
      tableStats.frozenxidAge.push([collectedAt, +data.frozenxidAge]);
      tableStats.minmxidAge.push([collectedAt, +data.minmxidAge]);
      tableStats.insertsSinceVacuum.push([
        collectedAt,
        +data.insertsSinceVacuum,
      ]);
      // If the stats reset happened in the middle, it's possible that the value decreases
      // To avoid error on the simulation side, put zero for that case
      tableStats.deletes.push([
        collectedAt,
        Math.max(+data.deletes - +prevData.deletes, 0),
      ]);
      tableStats.inserts.push([
        collectedAt,
        Math.max(+data.inserts - +prevData.inserts, 0),
      ]);
      tableStats.updates.push([
        collectedAt,
        Math.max(+data.updates - +prevData.updates, 0),
      ]);
      tableStats.hotUpdates.push([
        collectedAt,
        Math.max(+data.hotUpdates - +prevData.hotUpdates, 0),
      ]);
    }
  });

  const key = toSnakeCase(name);
  statsList.push({
    key: key,
    name: name,
    stats: tableStats,
  });

  localStorage.setItem(localStorageKey, JSON.stringify(statsList));

  return key;
};

export const getCustomTableStatsList = () => {
  const fromLocalStorage = localStorage.getItem(localStorageKey);
  const statsList: CustomTableStats[] = fromLocalStorage
    ? JSON.parse(fromLocalStorage)
    : [];
  return statsList;
};

export const getCustomTableStats = (key: string) => {
  const list = getCustomTableStatsList();
  return list.find((stats) => {
    return stats.key === key;
  });
};
