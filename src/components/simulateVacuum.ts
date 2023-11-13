export type Datum = [number, number | undefined | null];

export type AutovacuumCount = {
  total: number[];
  deadRows: number[];
  inserts: number[];
  freezing: number[];
};

export type TableStatsType = {
  deadTuples: Datum[];
  liveTuples: Datum[];
  frozenxidAge: Datum[];
  minmxidAge: Datum[];
  deletes: Datum[];
  inserts: Datum[];
  updates: Datum[];
  hotUpdates: Datum[];
  insertsSinceVacuum: Datum[];
};

export type SimulationData = {
  totalAutovacuumCount: AutovacuumCount;
  deadRowsVacuumed: Datum[];
  deadRowsThresholdData: Datum[];
  frozenxidAgeVacuumed: Datum[];
  freezeAgeThresholdData: Datum[];
  tableFreezeAgeThresholdData: Datum[];
  minmxidAgeVacuumed: Datum[];
  minmxidAgeThresholdData: Datum[];
  tableMinmxidAgeThresholdData: Datum[];
  insertRowsVacuumed: Datum[];
  insertRowsThresholdData: Datum[];
};

export type TableVacuumSettingsType = {
  autovacuumVacuumThreshold: number;
  autovacuumVacuumScaleFactor: number;
  autovacuumFreezeMaxAge: number;
  vacuumFreezeMinAge: number;
  vacuumFreezeTableAge: number;
  autovacuumMultixactFreezeMaxAge: number;
  vacuumMultixactFreezeMinAge: number;
  vacuumMultixactFreezeTableAge: number;
  autovacuumVacuumInsertThreshold: number;
  autovacuumVacuumInsertScaleFactor: number;
};

export const simulateVacuum = (
  tableStats: TableStatsType,
  tableVacuumSettings: TableVacuumSettingsType,
): SimulationData => {
  const xactPerSec = calculateXactPerSec(tableStats.frozenxidAge);
  const multixactPerSec = calculateXactPerSec(tableStats.minmxidAge);
  let currTotalRow = tableStats.liveTuples[0][1];
  let currFrozenxidAge = tableStats.frozenxidAge[0][1];
  let currMinmxidAge = tableStats.minmxidAge[0][1];
  let currDeadRows = tableStats.deadTuples[0][1];
  let currInsertRows = tableStats.insertsSinceVacuum[0][1];
  const runInsertsVacuum =
    (tableVacuumSettings.autovacuumVacuumInsertThreshold ?? -1) !== -1;

  const simulationData: SimulationData = {
    totalAutovacuumCount: {
      total: [],
      freezing: [],
      deadRows: [],
      inserts: [],
    },
    deadRowsVacuumed: [],
    deadRowsThresholdData: [],
    frozenxidAgeVacuumed: [],
    freezeAgeThresholdData: [],
    tableFreezeAgeThresholdData: [],
    minmxidAgeVacuumed: [],
    minmxidAgeThresholdData: [],
    tableMinmxidAgeThresholdData: [],
    insertRowsVacuumed: [],
    insertRowsThresholdData: [],
  };

  // tableStats is a bit different shape from the backend version
  // use liveTuples as the base
  tableStats.liveTuples.forEach((dat, i) => {
    const inserts = tableStats.inserts[i][1] || 0;
    const updates = tableStats.updates[i][1] || 0;
    const deletes = tableStats.deletes[i][1] || 0;
    let deadRows = deletes + updates;
    const collectedAt = dat[0];
    // Fill null data in case no data
    if (dat[1] == null) {
      simulationData.deadRowsVacuumed.push([collectedAt, null]);
      simulationData.deadRowsThresholdData.push([collectedAt, null]);
      simulationData.frozenxidAgeVacuumed.push([collectedAt, null]);
      simulationData.minmxidAgeThresholdData.push([collectedAt, null]);
      simulationData.minmxidAgeVacuumed.push([collectedAt, null]);
      simulationData.freezeAgeThresholdData.push([collectedAt, null]);
      simulationData.insertRowsVacuumed.push([collectedAt, null]);
      simulationData.insertRowsThresholdData.push([collectedAt, null]);
      return;
    }

    if (i !== 0) {
      // At this point, all values should be present
      const currLiveTuples = tableStats.liveTuples[i][1] as number;
      const currDeadTuples = tableStats.deadTuples[i][1] as number;
      const prevDeadTuples = tableStats.deadTuples[i - 1][1] as number;

      const collectDiffInSec = collectedAt - tableStats.liveTuples[i - 1][0];
      // Usually, deadRows (dead tuples) is the sum of deletes and updates.
      // However, especially with hot updates, dead tuples won't go up as much,
      // since heap pruning operations during hot updates will reclaim some tuples.
      // To perform a better simulation, use the diff of deadTuples when available.
      if (currDeadTuples - prevDeadTuples > 0) {
        deadRows = currDeadTuples - prevDeadTuples;
      }
      currDeadRows = currDeadRows ? currDeadRows + deadRows : deadRows;
      currInsertRows = currInsertRows ? currInsertRows + inserts : inserts;
      currTotalRow = currLiveTuples;
      currFrozenxidAge = currFrozenxidAge
        ? currFrozenxidAge + xactPerSec * collectDiffInSec
        : (tableStats.frozenxidAge[i][1] as number);
      currMinmxidAge = currMinmxidAge
        ? currMinmxidAge + multixactPerSec * collectDiffInSec
        : (tableStats.minmxidAge[i][1] as number);
    }

    // There is no condition that i == 0 and any of these curr rows are null
    // (should be early returned) but adding here to silent complier
    if (
      currTotalRow == null ||
      currDeadRows == null ||
      currInsertRows == null ||
      currFrozenxidAge == null ||
      currMinmxidAge == null
    ) {
      return;
    }

    const deadRowsThreshold =
      tableVacuumSettings.autovacuumVacuumThreshold +
      currTotalRow * tableVacuumSettings.autovacuumVacuumScaleFactor;
    const insertThreshold =
      tableVacuumSettings.autovacuumVacuumInsertThreshold +
      currTotalRow * tableVacuumSettings.autovacuumVacuumInsertScaleFactor;

    const needFreezeVacuum =
      currFrozenxidAge > tableVacuumSettings.autovacuumFreezeMaxAge ||
      currMinmxidAge > tableVacuumSettings.autovacuumMultixactFreezeMaxAge;
    const aggressiveVacuum =
      currFrozenxidAge > tableVacuumSettings.vacuumFreezeTableAge ||
      currMinmxidAge > tableVacuumSettings.vacuumMultixactFreezeTableAge;
    const needDeadRowsVacuum = currDeadRows >= deadRowsThreshold;
    const needInsertVacuum =
      runInsertsVacuum && currInsertRows >= insertThreshold;

    simulationData.deadRowsVacuumed.push([collectedAt, currDeadRows]);
    simulationData.deadRowsThresholdData.push([collectedAt, deadRowsThreshold]);
    simulationData.frozenxidAgeVacuumed.push([collectedAt, currFrozenxidAge]);
    simulationData.freezeAgeThresholdData.push([
      collectedAt,
      tableVacuumSettings.autovacuumFreezeMaxAge,
    ]);
    simulationData.tableFreezeAgeThresholdData.push([
      collectedAt,
      tableVacuumSettings.vacuumFreezeTableAge,
    ]);
    simulationData.minmxidAgeVacuumed.push([collectedAt, currMinmxidAge]);
    simulationData.minmxidAgeThresholdData.push([
      collectedAt,
      tableVacuumSettings.autovacuumMultixactFreezeMaxAge,
    ]);
    simulationData.tableMinmxidAgeThresholdData.push([
      collectedAt,
      tableVacuumSettings.vacuumMultixactFreezeTableAge,
    ]);
    simulationData.insertRowsVacuumed.push([collectedAt, currInsertRows]);
    simulationData.insertRowsThresholdData.push([collectedAt, insertThreshold]);
    if (!(needFreezeVacuum || needDeadRowsVacuum || needInsertVacuum)) {
      return;
    }

    simulationData.totalAutovacuumCount.total.push(collectedAt);
    if (needFreezeVacuum) {
      simulationData.totalAutovacuumCount.freezing.push(collectedAt);
    }
    if (needDeadRowsVacuum) {
      simulationData.totalAutovacuumCount.deadRows.push(collectedAt);
    }
    if (needInsertVacuum) {
      simulationData.totalAutovacuumCount.inserts.push(collectedAt);
    }

    currInsertRows = 0;
    if (aggressiveVacuum) {
      // Only reset up to min age
      currFrozenxidAge = Math.min(
        currFrozenxidAge,
        tableVacuumSettings.vacuumFreezeMinAge,
      );
      currMinmxidAge = Math.min(
        currMinmxidAge,
        tableVacuumSettings.vacuumMultixactFreezeMinAge,
      );
    }
    currDeadRows = 0;
  });

  return simulationData;
};

function calculateXactPerSec(dat: Datum[]): number {
  let totalSecondSpend = 0;
  let totalXidIncreased = 0;
  dat.forEach((val, i, arr) => {
    if (i === 0) {
      return;
    }
    const currCollectedAt = val[0];
    const prevCollectedAt = arr[i - 1][0];
    const collectDiffInSec = currCollectedAt - prevCollectedAt;
    const currValue = val[1];
    const prevValue = arr[i - 1][1];
    if (currValue == null || prevValue == null) {
      // Ignore data points that are current or previous value is not available
      return;
    }
    const xidIncreased = currValue - prevValue;
    if (xidIncreased < 0) {
      // If xid decreased, likely freezing happened, ignore that data points too
      return;
    }
    totalSecondSpend += collectDiffInSec;
    totalXidIncreased += xidIncreased;
  });
  return totalSecondSpend === 0 ? 0 : totalXidIncreased / totalSecondSpend;
}
