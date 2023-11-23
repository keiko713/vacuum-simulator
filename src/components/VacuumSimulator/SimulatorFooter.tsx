import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutovacuumCount } from "./simulateVacuum";
import {
  faCircleXmark,
  faSnowflake,
  faCirclePlus,
  faBug,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import Tooltip from "../Tooltip";
import { SimulationConfigSetContext } from "./SimulationConfigSettingsContext";
import { getDefaultConfig } from "./SampleTableStats";

const SimulatorFooter: React.FunctionComponent<{
  tableName: string;
  autovacuumSummary: AutovacuumCount;
  showOriginal: boolean;
  setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfigAdjuster: boolean;
  setShowConfigAdjuster: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  tableName,
  autovacuumSummary,
  showOriginal,
  setShowOriginal,
  showConfigAdjuster,
  setShowConfigAdjuster,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  function handleTogglePanel() {
    setCollapsed(!collapsed);
  }
  const setSimulationConfig = useContext(SimulationConfigSetContext);
  const resetToDefault = () => {
    setSimulationConfig({ ...getDefaultConfig(tableName) });
  };

  return (
    <div className="sticky bottom-0 z-40 w-full backdrop-blur flex-none bg-sky-100">
      <div className="max-w-8xl mx-auto">
        <div className="p-4 mx-0 border-t border-x">
          <div className="grid grid-cols-[1fr_60px]">
            <div>
              {autovacuumSummary.total.length} autovacuums (triggered by{" "}
              <FontAwesomeIcon icon={faCircleXmark} /> dead rows:{" "}
              {autovacuumSummary.deadRows.length},{" "}
              <FontAwesomeIcon icon={faSnowflake} /> freeze age:{" "}
              {autovacuumSummary.freezing.length},{" "}
              <FontAwesomeIcon icon={faCirclePlus} /> inserts:{" "}
              {autovacuumSummary.inserts.length})
            </div>
            <div className="flex items-center ml-auto">
              <button
                onClick={resetToDefault}
                title="Reset to default config settings"
                className="ml-3"
              >
                <FontAwesomeIcon
                  className="hover:text-sky-600"
                  icon={faRotateLeft}
                />
              </button>
              <button
                onClick={handleTogglePanel}
                title={collapsed ? "Open debug panel" : "Close debug panel"}
                className="ml-3"
              >
                <FontAwesomeIcon
                  className="hover:text-slate-600"
                  icon={faBug}
                />
              </button>
            </div>
          </div>
          {!collapsed && (
            <div className="mt-4 pt-4 border-t">
              {" "}
              <div className="flex items-center">
                <div className="pr-3">
                  Show Charts of Original Data
                  <Tooltip content="Show each chart data based on the input table data, not based on the simulation data. Useful to make sure that the simulation is close to the original data." />
                  : {showOriginal ? "ON" : "OFF"}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOriginal}
                    className="sr-only peer"
                    onChange={() => setShowOriginal(!showOriginal)}
                  />
                  <div className="w-11 h-6 bg-stone-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-700"></div>
                </label>
                <div className="px-3">
                  Show Config Adjusters
                  <Tooltip content="Show adjusters for all config settings. Instead of collapsing, which can be done within the individual setting, this will completely hide all config settings." />
                  : {showConfigAdjuster ? "ON" : "OFF"}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showConfigAdjuster}
                    className="sr-only peer"
                    onChange={() => setShowConfigAdjuster(!showConfigAdjuster)}
                  />
                  <div className="w-11 h-6 bg-stone-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-700"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatorFooter;
