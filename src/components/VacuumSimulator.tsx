import CollapsiblePanel from "./CollapsiblePanel";
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
import issueReferencesJson from "../sampledata/issue_references.json";
import serversJson from "../sampledata/servers.json";
import schemaTableStats35dJson from "../sampledata/schema_table_stats_35d.json";
import { Datum, simulateVacuum } from "./simulateVacuum";
import ConfigurableConfigSetting from "./ConfigurableConfigSetting";
import { SimulationConfigSettingsContext } from "./SimulationConfigSettingsContext";
import { TotalStatsForRangeContext } from "./TotalStatsForRangeContext";

export type SampleTableName =
  | "issue_references"
  | "schema_table_stats_35d"
  | "servers";

const VacuumSimulator: React.FunctionComponent<{}> = () => {
  const [sampleTableName, setSampleTableName] =
    useState<SampleTableName>("issue_references");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const simulationConfig = useContext(SimulationConfigSettingsContext);

  const sampleTable = getSampleTable(sampleTableName);
  const tableStats = {
    deadTuples: sampleTable.tableStats.deadTuples as Datum[],
    liveTuples: sampleTable.tableStats.liveTuples as Datum[],
    frozenxidAge: sampleTable.tableStats.frozenxidAge as Datum[],
    minmxidAge: sampleTable.tableStats.minmxidAge as Datum[],
    deletes: sampleTable.tableStats.deletes as Datum[],
    inserts: sampleTable.tableStats.inserts as Datum[],
    updates: sampleTable.tableStats.updates as Datum[],
    hotUpdates: sampleTable.tableStats.hotUpdates as Datum[],
    insertsSinceVacuum: sampleTable.tableStats.insertsSinceVacuum as Datum[],
  };
  const simulationResult = simulateVacuum(tableStats, simulationConfig);

  // Used for setting range input max/step
  const totalStats = {
    totalInserts: sampleTable.tableStats.inserts.reduce(
      (sum, current) => sum + current[1] || 0,
      0,
    ),
    totalUpdates: sampleTable.tableStats.updates.reduce(
      (sum, current) => sum + current[1] || 0,
      0,
    ),
    totalDeletes: sampleTable.tableStats.deletes.reduce(
      (sum, current) => sum + current[1] || 0,
      0,
    ),
  };

  return (
    <TotalStatsForRangeContext.Provider value={totalStats}>
      <CollapsiblePanel title="Configuration" icon={faWrench}>
        <ConfigPanel
          sampleTableName={sampleTableName}
          setSampleTable={setSampleTableName}
          showOriginal={showOriginal}
          setShowOriginal={setShowOriginal}
        />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="VACUUM triggered by: dead rows"
        icon={faCircleXmark}
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConfigurableConfigSetting name="autovacuumVacuumThreshold" />
          <ConfigurableConfigSetting name="autovacuumVacuumScaleFactor" />
        </div>
        {showOriginal && <DeadRowsChart tableStats={tableStats} />}
        <DeadRowsSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="VACUUM triggered by: freeze age"
        icon={faSnowflake}
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConfigurableConfigSetting name="autovacuumFreezeMaxAge" />
          <ConfigurableConfigSetting name="vacuumFreezeMinAge" />
          <ConfigurableConfigSetting name="vacuumFreezeTableAge" />
        </div>
        {showOriginal && <FreezeAgeChart tableStats={tableStats} />}
        <FreezeAgeSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel
        title="VACUUM triggered by: inserts"
        icon={faCirclePlus}
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConfigurableConfigSetting name="autovacuumVacuumInsertThreshold" />
          <ConfigurableConfigSetting name="autovacuumVacuumInsertScaleFactor" />
        </div>
        {showOriginal && <InsertsChart tableStats={tableStats} />}
        <InsertsSimulationChart simulationResult={simulationResult} />
      </CollapsiblePanel>
      <CollapsiblePanel title="Input data stats" icon={faMicroscope} defaultCollapsed>
        <InputDataStatsChart tableStats={tableStats} />
      </CollapsiblePanel>
    </TotalStatsForRangeContext.Provider>
  );
};

const ConfigPanel: React.FunctionComponent<{
  sampleTableName: SampleTableName;
  setSampleTable: React.Dispatch<React.SetStateAction<SampleTableName>>;
  showOriginal: boolean;
  setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sampleTableName, setSampleTable, showOriginal, setShowOriginal }) => {
  return (
    <div className="p-4">
      <div className="flex items-center">
        <div className="pr-3">Sample Table:</div>
        <select
          onChange={(e) => setSampleTable(e.target.value as SampleTableName)}
          value={sampleTableName}
          className="bg-[#F2F0E5] border border-[#E6E4D9] rounded block w-[300px] p-2"
        >
          <option value="issue_references">Table with dead rows VACUUMs</option>
          <option value="schema_table_stats_35d">
            Table with inserts VACUUMs
          </option>
          <option value="servers">Table with too many VACUUMs</option>
        </select>
        <div className="px-3">Show Charts of Original Data:</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showOriginal}
            className="sr-only peer"
            onChange={() => setShowOriginal(!showOriginal)}
          />
          <div className="w-11 h-6 bg-[#6F6E69] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4385BE]"></div>
        </label>
      </div>
    </div>
  );
};

const getSampleTable = (tableName: SampleTableName) => {
  switch (tableName) {
    case "issue_references":
      return issueReferencesJson;
    case "servers":
      return serversJson;
    case "schema_table_stats_35d":
      return schemaTableStats35dJson;
  }
};

export default VacuumSimulator;