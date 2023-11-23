import CollapsiblePanel from "../CollapsiblePanel";
import {
  faCirclePlus,
  faCircleXmark,
  faMicroscope,
  faSnowflake,
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
import { useContext, useEffect, useState } from "react";
import { TableStatsType, simulateVacuum } from "./simulateVacuum";
import ConfigAdjuster from "./ConfigAdjuster";
import {
  SimulationConfigSetContext,
  SimulationConfigSettingsContext,
} from "./SimulationConfigSettingsContext";
import { TotalStatsForRangeContext } from "./TotalStatsForRangeContext";
import SimulatorFooter from "./SimulatorFooter";
import TableStatsUploader from "./TableStatsUploader";
import { getCustomTableStatsList } from "./CustomTableStats";
import {
  SampleTableList,
  getDefaultConfig,
  getTableStats,
} from "./SampleTableStats";

const VacuumSimulator: React.FunctionComponent<{}> = () => {
  const [tableName, setTableName] = useState<string>("issue_references");
  const setSimulationConfig = useContext(SimulationConfigSetContext);

  useEffect(() => {
    // when the sample table is changed, set a new default config based on that table name
    setSimulationConfig({ ...getDefaultConfig(tableName) });
  }, [tableName, setSimulationConfig]);

  const inputStats = getTableStats(tableName)?.stats;

  return (
    <>
      <ConfigPanel tableName={tableName} setTableName={setTableName} />
      {inputStats && (
        <ChartPanels tableName={tableName} inputStats={inputStats} />
      )}
    </>
  );
};

const ConfigPanel: React.FunctionComponent<{
  tableName: string;
  setTableName: React.Dispatch<React.SetStateAction<string>>;
}> = ({ tableName, setTableName }) => {
  const customTableList = getCustomTableStatsList();
  return (
    <div className="pb-4 px-2">
      <div className="flex items-center">
        <div className="pr-3">Table:</div>
        <select
          onChange={(e) => setTableName(e.target.value)}
          value={tableName}
          className="border border-zinc-300 rounded block w-[300px] p-2"
        >
          {SampleTableList.map((sampleTable) => {
            return (
              <option key={sampleTable.key} value={sampleTable.key}>
                {sampleTable.name}
              </option>
            );
          })}
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
      </div>
    </div>
  );
};

const ChartPanels: React.FunctionComponent<{
  tableName: string;
  inputStats: TableStatsType;
}> = ({ tableName, inputStats }) => {
  const simulationConfig = useContext(SimulationConfigSettingsContext);
  const simulationResult = simulateVacuum(inputStats, simulationConfig);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showConfigAdjuster, setShowConfigAdjuster] = useState<boolean>(true);

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
        tableName={tableName}
        autovacuumSummary={simulationResult.totalAutovacuumCount}
        showOriginal={showOriginal}
        setShowOriginal={setShowOriginal}
        showConfigAdjuster={showConfigAdjuster}
        setShowConfigAdjuster={setShowConfigAdjuster}
      />
    </TotalStatsForRangeContext.Provider>
  );
};

export default VacuumSimulator;
