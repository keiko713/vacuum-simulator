import TimeSeriesChart from "./TimeSeriesChart";
import defaultConfig from "../sampledata/pganalyze_deafult_config.json";
import { ChartData, Point } from "chart.js";
import { SimulationData, TableStatsType } from "./simulateVacuum";

export const DeadRowsChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const deadTuples = tableStats.deadTuples;
  const liveTuples = tableStats.liveTuples as number[][];

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Dead Rows",
        fill: true,
        data: deadTuples.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
      {
        label: "Threshold",
        data: liveTuples.map((val) => {
          return {
            x: val[0] * 1000,
            y: (defaultConfig.autovacuumVacuumThreshold +
              defaultConfig.autovacuumVacuumScaleFactor * val[1]) as number,
          } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
        fill: false,
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

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Dead Rows",
        fill: true,
        data: daedRows.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
      {
        label: "Threshold",
        data: threshold.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export const FreezeAgeChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const frozenxidAge = tableStats.frozenxidAge;

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Oldest Unfrozen XID",
        fill: true,
        data: frozenxidAge.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
      {
        label: "Freeze Max Age (trigger anti-wraparound)",
        data: frozenxidAge.map((val) => {
          return {
            x: val[0] * 1000,
            y: defaultConfig.autovacuumFreezeMaxAge,
          } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
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
        borderColor: "#D0A215",
        backgroundColor: "#FFFCF0",
        fill: false,
        borderWidth: 2,
        borderDash: [2, 5],
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

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Oldest Unfrozen XID",
        fill: true,
        data: frozenxidAge.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
      {
        label: "Freeze Max Age (trigger anti-wraparound)",
        data: threshold.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
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
        borderColor: "#D0A215",
        backgroundColor: "#FFFCF0",
        fill: false,
        borderWidth: 2,
        borderDash: [2, 5],
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export const InsertsChart: React.FunctionComponent<{
  tableStats: TableStatsType;
}> = ({ tableStats }) => {
  const inserts = tableStats.insertsSinceVacuum;
  const liveTuples = tableStats.liveTuples as number[][];

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Dead Tuples",
        fill: true,
        data: inserts.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
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
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
        fill: false,
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

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Dead Tuples",
        fill: true,
        data: inserts.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#B7B5AC",
        backgroundColor: "#B7B5AC",
        borderWidth: 2,
      },
      {
        label: "Threshold",
        data: threshold.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "#D14D41",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};
