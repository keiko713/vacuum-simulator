import CollapsiblePanel from "./CollapsiblePanel";
import {
  faCirclePlus,
  faCircleXmark,
  faSnowflake,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  DeadRowsChart,
  DeadRowsSimulationChart,
  FreezeAgeChart,
  FreezeAgeSimulationChart,
  InsertsChart,
  InsertsSimulationChart,
} from "./Charts";
import { useState } from "react";
import issueReferencesJson from "../sampledata/issue_references.json";
import serversJson from "../sampledata/servers.json";
import schemaTableStats35dJson from "../sampledata/schema_table_stats_35d.json";
import { Datum, simulateVacuum } from "./simulateVacuum";
import defaultConfig from "../sampledata/pganalyze_deafult_config.json";

export type SampleTableName =
  | "issue_references"
  | "schema_table_stats_35d"
  | "servers";

const PageContent: React.FunctionComponent<{}> = () => {
  const [sampleTableName, setSampleTableName] =
    useState<SampleTableName>("issue_references");
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
  const simulationResult = simulateVacuum(tableStats, defaultConfig);
  return (
    <div className="max-w-8xl mx-auto">
      <div className="py-4 px-8 lg:px-16">
        <CollapsiblePanel title="Configuration" icon={faWrench}>
          <ConfigPanel
            sampleTableName={sampleTableName}
            setSampleTable={setSampleTableName}
          />
        </CollapsiblePanel>
        <CollapsiblePanel
          title="VACUUM triggered by: dead rows"
          icon={faCircleXmark}
        >
          <DeadRowsChart tableStats={tableStats} />
          <DeadRowsSimulationChart simulationResult={simulationResult} />
        </CollapsiblePanel>
        <CollapsiblePanel
          title="VACUUM triggered by: freeze age"
          icon={faSnowflake}
        >
          <FreezeAgeChart tableStats={tableStats} />
          <FreezeAgeSimulationChart simulationResult={simulationResult} />
        </CollapsiblePanel>
        <CollapsiblePanel
          title="VACUUM triggered by: inserts"
          icon={faCirclePlus}
        >
          <InsertsChart tableStats={tableStats} />
          <InsertsSimulationChart simulationResult={simulationResult} />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

const ConfigPanel: React.FunctionComponent<{
  sampleTableName: SampleTableName;
  setSampleTable: React.Dispatch<React.SetStateAction<SampleTableName>>;
}> = ({ sampleTableName, setSampleTable }) => {
  return (
    <div className="p-4">
      <div className="flex items-center">
        <div className="pr-3">Sample Table:</div>
        <select
          onChange={(e) => setSampleTable(e.target.value as SampleTableName)}
          value={sampleTableName}
          className="bg-[#F2F0E5] border border-[#E6E4D9] rounded block w-[300px] p-2"
        >
          {" "}
          <option value="issue_references">Table with dead rows VACUUMs</option>
          <option value="schema_table_stats_35d">
            Table with inserts VACUUMs
          </option>
          <option value="servers">Table with too many VACUUMs</option>
        </select>
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

export default PageContent;
