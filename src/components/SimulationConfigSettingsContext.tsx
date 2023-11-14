import { createContext, useCallback, useState } from "react";
import defaultConfig from "../sampledata/pganalyze_deafult_config.json";
import { TableVacuumSettingsType } from "./simulateVacuum";

export const SimulationConfigSettingsContext =
  createContext<TableVacuumSettingsType>({
    ...defaultConfig,
  });

export const SimulationConfigSetContext = createContext<
  (newSettings: TableVacuumSettingsType) => void
>(() => {
  /* default empty function */
});

export const SimulationConfigSettingsContextProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [configSettings, setConfigSettings] = useState<TableVacuumSettingsType>(
    { ...defaultConfig },
  );
  const setConfig = useCallback((current: TableVacuumSettingsType): void => {
    setConfigSettings(current);
  }, []);
  return (
    <SimulationConfigSetContext.Provider value={setConfig}>
      <SimulationConfigSettingsContext.Provider value={configSettings}>
        {children}
      </SimulationConfigSettingsContext.Provider>
    </SimulationConfigSetContext.Provider>
  );
};
