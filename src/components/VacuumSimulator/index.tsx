import CollapsiblePanel from "../CollapsiblePanel";
import {
  faCirclePlus,
  faCircleXmark,
  faMicroscope,
  faSnowflake,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  DeadRowsChart,
  DeadRowsSimulationChart,
  FreezeAgeChart,
  FreezeAgeSimulationChart,
  InputDataStatsChart,
  InsertsChart,
  InsertsSimulationChart,
} from "./Charts";
import { useContext, useState } from "react";
import issueReferencesJson from "../../sampledata/issue_references.json";
import serversJson from "../../sampledata/servers.json";
import schemaTableStats35dJson from "../../sampledata/schema_table_stats_35d.json";
import postgresRolesJson from "../../sampledata/postgres_roles.json";
import { Datum, TableStatsType, simulateVacuum } from "./simulateVacuum";
import ConfigAdjuster from "./ConfigAdjuster";
import {
  SimulationConfigSetContext,
  SimulationConfigSettingsContext,
} from "./SimulationConfigSettingsContext";
import { TotalStatsForRangeContext } from "./TotalStatsForRangeContext";
import pganalyzeDefaultConfig from "../../sampledata/pganalyze_deafult_config.json";
import pg15DefaultConfig from "../../sampledata/deafult_config.json";
import SimulatorFooter from "./SimulatorFooter";
import TableStatsUploader from "./TableStatsUploader";
import {
  getCustomTableStats,
  getCustomTableStatsList,
} from "./CustomTableStats";

export type SampleTableName =
  | "issue_references"
  | "postgres_roles"
  | "schema_table_stats_35d"
  | "servers";

const VacuumSimulator: React.FunctionComponent<{}> = () => {
  const [tableName, setTableName] = useState<string>("issue_references");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showConfigAdjuster, setShowConfigAdjuster] = useState<boolean>(true);
  // It's not a bit not straight forward, but when the sample table is changed,
  // set a new default config based on that table name
  // TODO: update here, as it's actually causing the rendering error
  const setSimulationConfig = useContext(SimulationConfigSetContext);
  setSimulationConfig({ ...getDefaultConfig(tableName) });
  const inputStats = isSampleTableName(tableName)
    ? getSampleTableStats(tableName as SampleTableName)
    : getCustomTableStats(tableName)?.stats;

  return (
    <>
      <CollapsiblePanel title="Configuration" icon={faWrench}>
        <ConfigPanel
          tableName={tableName}
          setTableName={setTableName}
          showOriginal={showOriginal}
          setShowOriginal={setShowOriginal}
          showConfigAdjuster={showConfigAdjuster}
          setShowConfigAdjuster={setShowConfigAdjuster}
        />
      </CollapsiblePanel>
      {inputStats && (
        <ChartPanels
          inputStats={inputStats}
          showOriginal={showOriginal}
          showConfigAdjuster={showConfigAdjuster}
        />
      )}
    </>
  );
};

const ConfigPanel: React.FunctionComponent<{
  tableName: string;
  setTableName: React.Dispatch<React.SetStateAction<string>>;
  showOriginal: boolean;
  setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfigAdjuster: boolean;
  setShowConfigAdjuster: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  tableName,
  setTableName,
  showOriginal,
  setShowOriginal,
  showConfigAdjuster,
  setShowConfigAdjuster,
}) => {
  const setSimulationConfig = useContext(SimulationConfigSetContext);
  const resetToDefault = () => {
    setSimulationConfig({ ...getDefaultConfig(tableName) });
  };
  const customTableList = getCustomTableStatsList();
  return (
    <div className="p-4">
      <div className="flex items-center pb-4">
        <div className="pr-3">Table:</div>
        <select
          onChange={(e) => setTableName(e.target.value)}
          value={tableName}
          className="border border-[#E6E4D9] rounded block w-[300px] p-2"
        >
          <option key="issue_references" value="issue_references">
            Table with dead rows VACUUMs
          </option>
          <option key="postgres_roles" value="postgres_roles">
            Table with freeze age VACUUMs
          </option>
          <option key="schema_table_stats_35d" value="schema_table_stats_35d">
            Table with inserts VACUUMs
          </option>
          <option key="servers" value="servers">
            Table with too many VACUUMs
          </option>
          {customTableList.map((customTable) => {
            return (
              <option key={customTable.key} value={customTable.key}>
                {customTable.name}
              </option>
            );
          })}
        </select>
        <div className="px-3">
          <TableStatsUploader setTableName={setTableName} />
        </div>
        <div className="px-3">
          <button
            className="bg-[#100F0F] text-[#FFFCF0] hover:bg-[#3AA99F] rounded p-2"
            onClick={resetToDefault}
          >
            Reset to default
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <div className="pr-3">Show Charts of Original Data:</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showOriginal}
            className="sr-only peer"
            onChange={() => setShowOriginal(!showOriginal)}
          />
          <div className="w-11 h-6 bg-[#6F6E69] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4385BE]"></div>
        </label>
        <div className="px-3">Show Config Adjusters:</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showConfigAdjuster}
            className="sr-only peer"
            onChange={() => setShowConfigAdjuster(!showConfigAdjuster)}
          />
          <div className="w-11 h-6 bg-[#6F6E69] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4385BE]"></div>
        </label>
      </div>
    </div>
  );
};

const ChartPanels: React.FunctionComponent<{
  inputStats: TableStatsType;
  showOriginal: boolean;
  showConfigAdjuster: boolean;
}> = ({ inputStats, showOriginal, showConfigAdjuster }) => {
  const simulationConfig = useContext(SimulationConfigSettingsContext);
  const simulationResult = simulateVacuum(inputStats, simulationConfig);

  // Used for setting range input max/step
  const totalStats = {
    totalInserts: inputStats.inserts.reduce(
      (sum, current) => sum + (current[1] ?? 0),
      0,
    ),
    totalUpdates: inputStats.updates.reduce(
      (sum, current) => sum + (current[1] ?? 0),
      0,
    ),
    totalDeletes: inputStats.deletes.reduce(
      (sum, current) => sum + (current[1] ?? 0),
      0,
    ),
  };

  return (
    <TotalStatsForRangeContext.Provider value={totalStats}>
      <CollapsiblePanel
        title="VACUUM triggered by: dead rows"
        icon={faCircleXmark}
      >
        {showConfigAdjuster && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfigAdjuster name="autovacuumVacuumThreshold" />
            <ConfigAdjuster name="autovacuumVacuumScaleFactor" />
          </div>
        )}
        {showOriginal && <DeadRowsChart tableStats={inputStats} />}
        <DeadRowsSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="VACUUM triggered by: freeze age"
        icon={faSnowflake}
      >
        {showConfigAdjuster && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfigAdjuster name="autovacuumFreezeMaxAge" />
            <ConfigAdjuster name="vacuumFreezeMinAge" />
            <ConfigAdjuster name="vacuumFreezeTableAge" />
          </div>
        )}
        {showOriginal && <FreezeAgeChart tableStats={inputStats} />}
        <FreezeAgeSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="VACUUM triggered by: inserts"
        icon={faCirclePlus}
      >
        {showConfigAdjuster && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfigAdjuster name="autovacuumVacuumInsertThreshold" />
            <ConfigAdjuster name="autovacuumVacuumInsertScaleFactor" />
          </div>
        )}
        {showOriginal && <InsertsChart tableStats={inputStats} />}
        <InsertsSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="Input data stats"
        icon={faMicroscope}
        defaultCollapsed
      >
        <InputDataStatsChart tableStats={inputStats} />
      </CollapsiblePanel>
      <SimulatorFooter
        autovacuumSummary={simulationResult.totalAutovacuumCount}
      />
    </TotalStatsForRangeContext.Provider>
  );
};

export const isSampleTableName = (name: string) => {
  return (
    name === "issue_references" ||
    name === "postgres_roles" ||
    name === "schema_table_stats_35d" ||
    name === "servers"
  );
};

const getDefaultConfig = (tableName: string) => {
  if (isSampleTableName(tableName)) {
    // sample is based on pganalyze data
    return pganalyzeDefaultConfig;
  } else {
    return pg15DefaultConfig;
  }
};

const getSampleTableStats = (tableName: SampleTableName) => {
  // default to issue_references
  const inputStats =
    tableName === "servers"
      ? serversJson.tableStats
      : tableName === "schema_table_stats_35d"
      ? schemaTableStats35dJson.tableStats
      : tableName === "postgres_roles"
      ? postgresRolesJson.tableStats
      : issueReferencesJson.tableStats;

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

export default VacuumSimulator;
