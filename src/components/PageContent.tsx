import TimeSeriesChart from "./TimeSeriesChart";
import issueReferencesJson from "../sampledata/issue_references.json";
import defaultConfig from "../sampledata/pganalyze_deafult_config.json";
import { ChartData, ChartOptions, Point } from "chart.js";
import CollapsiblePanel from "./CollapsiblePanel";
import { faCirclePlus, faCircleXmark, faSnowflake } from "@fortawesome/free-solid-svg-icons";

const PageContent: React.FunctionComponent<{}> = () => {
  return (
    <div className="max-w-8xl mx-auto">
      <div className="py-4 px-8 lg:px-16">
        <CollapsiblePanel title="VACUUM triggered by: dead rows" icon={faCircleXmark}>
          <DeadRowsChart />
        </CollapsiblePanel>
        <CollapsiblePanel title="VACUUM triggered by: freeze age" icon={faSnowflake}>
        <FreezeAgeChart />
        </CollapsiblePanel>
        <CollapsiblePanel title="VACUUM triggered by: inserts" icon={faCirclePlus}>
        <InsertsChart />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

const DeadRowsChart: React.FunctionComponent<{}> = () => {
  const deadTuples =
    issueReferencesJson.getVacuumSimulatorInput.tableStats.deadTuples;
  const liveTuples =
    issueReferencesJson.getVacuumSimulatorInput.tableStats.liveTuples;

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Dead Tuples",
        fill: true,
        data: deadTuples.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        backgroundColor: "#B7B5AC",
        borderWidth: 0,
      },
      {
        label: "Threshold",
        data: liveTuples.map((val) => {
          return {
            x: val[0] * 1000,
            y:
              defaultConfig.autovacuumVacuumThreshold +
              defaultConfig.autovacuumVacuumScaleFactor * val[1],
          } as Point;
        }),
        borderColor: "#D14D41",
        backgroundColor: "white",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

const FreezeAgeChart: React.FunctionComponent<{}> = () => {
  const frozenxidAge =
    issueReferencesJson.getVacuumSimulatorInput.tableStats.frozenxidAge;

  const data: ChartData<"line", Point[]> = {
    datasets: [
      {
        label: "Oldest Unfrozen XID",
        fill: true,
        data: frozenxidAge.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        backgroundColor: "#B7B5AC",
        borderWidth: 0,
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
        backgroundColor: "white",
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
        borderColor: "#D14D41",
        backgroundColor: "white",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

const InsertsChart: React.FunctionComponent<{}> = () => {
  const inserts =
    issueReferencesJson.getVacuumSimulatorInput.tableStats.insertsSinceVacuum;
  const liveTuples =
    issueReferencesJson.getVacuumSimulatorInput.tableStats.liveTuples;

  const data: ChartData<"line", Point[]> = {
    //labels: deadTuples.map((val) => val[0]),
    datasets: [
      {
        label: "Dead Tuples",
        fill: true,
        data: inserts.map((val) => {
          return { x: val[0] * 1000, y: val[1] } as Point;
        }),
        backgroundColor: "#B7B5AC",
        borderWidth: 0,
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
        backgroundColor: "white",
        fill: false,
        borderWidth: 2,
      },
    ],
  };
  return <TimeSeriesChart data={data} />;
};

export default PageContent;
