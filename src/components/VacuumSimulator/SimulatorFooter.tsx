import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutovacuumCount } from "./simulateVacuum";
import {
  faCircleXmark,
  faSnowflake,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const SimulatorFooter: React.FunctionComponent<{
  autovacuumSummary: AutovacuumCount;
}> = ({ autovacuumSummary }) => {
  return (
    <div className="sticky bottom-0 z-40 w-full backdrop-blur flex-none bg-[#F2F0E5] supports-backdrop-blur:bg-[#F2F0E5]/95">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 px-8 mx-0 lg:px-16 border">
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

export default SimulatorFooter;
