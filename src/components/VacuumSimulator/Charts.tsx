import TimeSeriesChart from "../TimeSeriesChart";
import defaultConfig from "../../sampledata/pganalyze_deafult_config.json";
import { ChartData, ChartDataset, Point } from "chart.js";
import {
  AutovacuumCount,
  SimulationData,
  TableStatsType,
} from "./simulateVacuum";

export const DeadRowsChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const deadTuples = tableStats.deadTuples;
  const liveTuples = tableStats.liveTuples as number[][];

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Threshold",
        data: liveTuples.map((val) => {
          return {
            x: val[0] * 1000,
            y: (defaultConfig.autovacuumVacuumThreshold +
              defaultConfig.autovacuumVacuumScaleFactor * val[1]) as number,
          } as Point;
        }),
        borderColor: "#b91c1c",
        backgroundColor: "#b91c1c",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Dead Rows",
        fill: true,
        data: deadTuples.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d6d3d1",
        backgroundColor: "#d6d3d1",
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export const DeadRowsSimulationChart: React.FunctionComponent<{
  simulationResult: SimulationData;
}> = ({ simulationResult: result }) => {
  const daedRows = result.deadRowsVacuumed;
  const threshold = result.deadRowsThresholdData;
  const datasets = vacuumDataset(result.totalAutovacuumCount);
  datasets.push(
    {
      label: "Threshold",
      data: threshold.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#b91c1c",
      backgroundColor: "#b91c1c",
      fill: false,
      borderWidth: 2,
    },
    {
      label: "Dead Rows",
      fill: true,
      data: daedRows.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#d6d3d1",
      backgroundColor: "#d6d3d1",
      borderWidth: 2,
    },
  );

  return <TimeSeriesChart data={{ datasets: datasets }} />;
};

export const FreezeAgeChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const frozenxidAge = tableStats.frozenxidAge;

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Freeze Max Age (trigger anti-wraparound)",
        data: frozenxidAge.map((val) => {
          return {
            x: val[0] * 1000,
            y: defaultConfig.autovacuumFreezeMaxAge,
          } as Point;
        }),
        borderColor: "#b91c1c",
        backgroundColor: "#b91c1c",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Table Freeze Age (trigger aggressive)",
        data: frozenxidAge.map((val) => {
          return {
            x: val[0] * 1000,
            y: defaultConfig.vacuumFreezeTableAge,
          } as Point;
        }),
        borderColor: "#d97706",
        backgroundColor: "#ffffff",
        fill: false,
        borderWidth: 2,
        borderDash: [2, 5],
      },
      {
        label: "Oldest Unfrozen XID",
        fill: true,
        data: frozenxidAge.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d6d3d1",
        backgroundColor: "#d6d3d1",
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export const FreezeAgeSimulationChart: React.FunctionComponent<{
  simulationResult: SimulationData;
}> = ({ simulationResult: result }) => {
  const frozenxidAge = result.frozenxidAgeVacuumed;
  const threshold = result.freezeAgeThresholdData;
  const tableFreezeThreshold = result.tableFreezeAgeThresholdData;
  const datasets = vacuumDataset(result.totalAutovacuumCount);
  datasets.push(
    {
      label: "Freeze Max Age (trigger anti-wraparound)",
      data: threshold.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#b91c1c",
      backgroundColor: "#b91c1c",
      fill: false,
      borderWidth: 2,
    },
    {
      label: "Table Freeze Age (trigger aggressive)",
      data: tableFreezeThreshold.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#d97706",
      backgroundColor: "#ffffff",
      fill: false,
      borderWidth: 2,
      borderDash: [2, 5],
    },
    {
      label: "Oldest Unfrozen XID",
      fill: true,
      data: frozenxidAge.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#d6d3d1",
      backgroundColor: "#d6d3d1",
      borderWidth: 2,
    },
  );

  return <TimeSeriesChart data={{ datasets: datasets }} />;
};

export const InsertsChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const inserts = tableStats.insertsSinceVacuum;
  const liveTuples = tableStats.liveTuples as number[][];

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Threshold",
        data: liveTuples.map((val) => {
          return {
            x: val[0] * 1000,
            y:
              defaultConfig.autovacuumVacuumInsertThreshold +
              defaultConfig.autovacuumVacuumInsertScaleFactor * val[1],
          } as Point;
        }),
        borderColor: "#b91c1c",
        backgroundColor: "#b91c1c",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Inserts",
        fill: true,
        data: inserts.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d6d3d1",
        backgroundColor: "#d6d3d1",
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export const InsertsSimulationChart: React.FunctionComponent<{
  simulationResult: SimulationData;
}> = ({ simulationResult: result }) => {
  const inserts = result.insertRowsVacuumed;
  const threshold = result.insertRowsThresholdData;
  const datasets = vacuumDataset(result.totalAutovacuumCount);
  datasets.push(
    {
      label: "Threshold",
      data: threshold.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#b91c1c",
      backgroundColor: "#b91c1c",
      fill: false,
      borderWidth: 2,
    },
    {
      label: "Inserts",
      fill: true,
      data: inserts.map((val) => {
        return { x: val[0] * 1000, y: val[1] } as Point;
      }),
      borderColor: "#d6d3d1",
      backgroundColor: "#d6d3d1",
      borderWidth: 2,
    },
  );

  return <TimeSeriesChart data={{ datasets: datasets }} />;
};

export const InputDataStatsChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Inserts",
        data: tableStats.inserts.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#b91c1c",
        backgroundColor: "#b91c1c",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Updates",
        data: tableStats.updates.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d97706",
        backgroundColor: "#ffffff",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "HOT Updates",
        data: tableStats.hotUpdates.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d97706",
        backgroundColor: "#ffffff",
        fill: false,
        borderWidth: 2,
        borderDash: [2, 5],
      },
      {
        label: "Deletes",
        data: tableStats.deletes.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#d6d3d1",
        backgroundColor: "#d6d3d1",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

const vacuumDataset = (
  autovacuumCount: AutovacuumCount,
): ChartDataset<"line", Point[]>[] => {
  return [
    {
      label: "Dead Rows VACUUM",
      data: autovacuumCount.deadRows.map((val) => {
        return { x: val * 1000, y: 0 } as Point;
      }),
      fill: false,
      borderWidth: 0,
      pointRadius: 10,
      pointHoverRadius: 12,
      pointBorderWidth: 4,
      pointHoverBorderWidth: 4,
      borderColor: "#0369a1",
      backgroundColor: "#0369a1",
      pointStyle: "crossRot",
    },
    {
      label: "Freeze Age VACUUM",
      data: autovacuumCount.freezing.map((val) => {
        return { x: val * 1000, y: 0 } as Point;
      }),
      fill: false,
      borderWidth: 0,
      pointRadius: 10,
      pointHoverRadius: 12,
      pointBorderWidth: 4,
      pointHoverBorderWidth: 4,
      borderColor: "#0369a1",
      backgroundColor: "#0369a1",
      pointStyle: "star",
    },
    {
      label: "Inserts VACUUM",
      data: autovacuumCount.inserts.map((val) => {
        return { x: val * 1000, y: 0 } as Point;
      }),
      fill: false,
      borderWidth: 0,
      pointRadius: 10,
      pointHoverRadius: 12,
      pointBorderWidth: 4,
      pointHoverBorderWidth: 4,
      borderColor: "#0369a1",
      backgroundColor: "#0369a1",
      pointStyle: "cross",
    },
  ];
};
