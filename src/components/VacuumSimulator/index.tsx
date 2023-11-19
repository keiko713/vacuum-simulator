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
import {
  AutovacuumCount,
  Datum,
  TableStatsType,
  simulateVacuum,
} from "./simulateVacuum";
import ConfigurableConfigSetting from "./ConfigurableConfigSetting";
import {
  SimulationConfigSetContext,
  SimulationConfigSettingsContext,
} from "./SimulationConfigSettingsContext";
import { TotalStatsForRangeContext } from "./TotalStatsForRangeContext";
import pganalyzeDefaultConfig from "../../sampledata/pganalyze_deafult_config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type SampleTableName =
  | "issue_references"
  | "postgres_roles"
  | "schema_table_stats_35d"
  | "servers";

const VacuumSimulator: React.FunctionComponent<{}> = () => {
  const [sampleTableName, setSampleTableName] =
    useState<SampleTableName>("issue_references");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showConfigAdjuster, setShowConfigAdjuster] = useState<boolean>(true);
  // It's not a bit not straight forward, but when the sample table is changed,
  // set a new default config based on that table name
  // TODO: update here, as it's actually causing the rendering error
  const setSimulationConfig = useContext(SimulationConfigSetContext);
  setSimulationConfig({ ...getDefaultConfig(sampleTableName) });
  const inputStats = getSampleTableStats(sampleTableName);

  return (
    <>
      <CollapsiblePanel title="Configuration" icon={faWrench}>
        <ConfigPanel
          sampleTableName={sampleTableName}
          setSampleTable={setSampleTableName}
          showOriginal={showOriginal}
          setShowOriginal={setShowOriginal}
          showConfigAdjuster={showConfigAdjuster}
          setShowConfigAdjuster={setShowConfigAdjuster}
        />
      </CollapsiblePanel>
      <ChartPanels
        inputStats={inputStats}
        showOriginal={showOriginal}
        showConfigAdjuster={showConfigAdjuster}
      />
    </>
  );
};

const ConfigPanel: React.FunctionComponent<{
  sampleTableName: SampleTableName;
  setSampleTable: React.Dispatch<React.SetStateAction<SampleTableName>>;
  showOriginal: boolean;
  setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfigAdjuster: boolean;
  setShowConfigAdjuster: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  sampleTableName,
  setSampleTable,
  showOriginal,
  setShowOriginal,
  showConfigAdjuster,
  setShowConfigAdjuster,
}) => {
  const setSimulationConfig = useContext(SimulationConfigSetContext);
  const resetToDefault = () => {
    setSimulationConfig({ ...getDefaultConfig(sampleTableName) });
  };
  return (
    <div className="p-4">
      <div className="flex items-center pb-4">
        <div className="pr-3">Sample Table:</div>
        <select
          onChange={(e) => setSampleTable(e.target.value as SampleTableName)}
          value={sampleTableName}
          className="bg-[#F2F0E5] border border-[#E6E4D9] rounded block w-[300px] p-2"
        >
          <option value="issue_references">Table with dead rows VACUUMs</option>
          <option value="postgres_roles">Table with freeze age VACUUMs</option>
          <option value="schema_table_stats_35d">
            Table with inserts VACUUMs
          </option>
          <option value="servers">Table with too many VACUUMs</option>
        </select>
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
            <ConfigurableConfigSetting name="autovacuumVacuumThreshold" />
            <ConfigurableConfigSetting name="autovacuumVacuumScaleFactor" />
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
            <ConfigurableConfigSetting name="autovacuumFreezeMaxAge" />
            <ConfigurableConfigSetting name="vacuumFreezeMinAge" />
            <ConfigurableConfigSetting name="vacuumFreezeTableAge" />
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
            <ConfigurableConfigSetting name="autovacuumVacuumInsertThreshold" />
            <ConfigurableConfigSetting name="autovacuumVacuumInsertScaleFactor" />
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

const SimulatorFooter: React.FunctionComponent<{
  autovacuumSummary: AutovacuumCount;
}> = ({ autovacuumSummary }) => {
  return (
    <div className="sticky bottom-0 z-40 w-full backdrop-blur flex-none bg-[#F2F0E5] supports-backdrop-blur:bg-[#F2F0E5]/95">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 px-8 mx-0 lg:px-16">
          <div className="text-center">
            {autovacuumSummary.total.length} autovacuums (triggered by{" "}
            <FontAwesomeIcon icon={faCircleXmark} /> dead rows:{" "}
            {autovacuumSummary.deadRows.length},{" "}
            <FontAwesomeIcon icon={faSnowflake} /> freeze age:{" "}
            {autovacuumSummary.freezing.length},{" "}
            <FontAwesomeIcon icon={faCirclePlus} /> inserts:{" "}
            {autovacuumSummary.inserts.length})
          </div>
        </div>
      </div>
    </div>
  );
};

const getDefaultConfig = (tableName: SampleTableName) => {
  // currently sample is only based on pganalyze data
  return pganalyzeDefaultConfig;
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
