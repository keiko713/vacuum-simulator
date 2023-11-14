import { TableVacuumSettingsType } from "./simulateVacuum";
import { ConfigNameType, configDocs15 } from "./configDocs";
import RangeInput from "./RangeInput";

export type TotalStats = {
    totalInserts: number;
    totalUpdates: number;
    totalDeletes: number;
}

const ConfigurableConfigSetting: React.FunctionComponent<{
  simulationConfigSettings: TableVacuumSettingsType;
  setSimulationConfigSettings: React.Dispatch<
    React.SetStateAction<TableVacuumSettingsType>
  >;
  name: ConfigNameType;
  totalStats: TotalStats;
}> = ({ simulationConfigSettings, setSimulationConfigSettings, name, totalStats }) => {
  const configDetail = configDocs15[name];
  const floatingPoint = configDetail.type === "floating point";
  const config = rangeConfig(totalStats)[name];
  return (
    <div className="border rounded p-2 bg-white text-[14px]">
      <div className="font-semibold pb-2 grid grid-cols-2">
        <code>{configDetail.name}</code>
        <div className="text-right">
          {floatingPoint
            ? simulationConfigSettings[name].toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 1,
              })
            : simulationConfigSettings[name].toLocaleString("en-US")}
        </div>
      </div>
      <div className="pb-2">
        <RangeInput
          value={simulationConfigSettings[name]}
          id={configDetail.name}
          min={configDetail.min === -1 ? 0 : configDetail.min}
          max={config.max ?? configDetail.max}
          step={config.step}
          onChange={(evt) => {
            const newValue = Number(evt.currentTarget.value);
            if (
              !isNaN(newValue) &&
              newValue >= configDetail.min &&
              newValue <= configDetail.max
            ) {
              simulationConfigSettings[name] = newValue;
              setSimulationConfigSettings({ ...simulationConfigSettings });
            }
          }}
          className="w-full"
        />
        <div className="text-right">
          <small>
            MIN: {configDetail.min.toLocaleString("en-US")}, MAX:{" "}
            {configDetail.max.toLocaleString("en-US")}{" "}
            {floatingPoint &&
              `(${configDetail.max.toLocaleString("en-US", {
                style: "percent",
              })})`}
          </small>
        </div>
        <div>
          <input
            type="number"
            className="w-full block p-2 border rounded"
            value={simulationConfigSettings[name]}
            min={configDetail.min}
            max={configDetail.max}
            step={config.step}
            onChange={(evt) => {
              const newValue = Number(evt.currentTarget.value);
              if (
                !isNaN(newValue) &&
                newValue >= configDetail.min &&
                newValue <= configDetail.max
              ) {
                simulationConfigSettings[name] = newValue;
                setSimulationConfigSettings({ ...simulationConfigSettings });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const rangeConfig = (totalStats: TotalStats) => {
    return {
        autovacuumVacuumThreshold: {
            ...findMaxAndStep(totalStats.totalUpdates + totalStats.totalDeletes),
        },
        autovacuumVacuumScaleFactor: {
            max: 1,
            step: 0.01
        },
        autovacuumFreezeMaxAge: {
            max: 1_000_000_000,
            step: 100_000,
        },
        vacuumFreezeMinAge: {
            max: 100_000_000,
            step: 100_000,
        },
        vacuumFreezeTableAge: {
            max: 1_000_000_000,
            step: 100_000,
        },
        autovacuumMultixactFreezeMaxAge: {
            max: 1_000_000_000,
            step: 100_000,
        },
        vacuumMultixactFreezeMinAge: {
            max: 100_000_000,
            step: 100_000,
        },
        vacuumMultixactFreezeTableAge: {
            max: 1_000_000_000,
            step: 100_000,
        },
        autovacuumVacuumInsertThreshold: {
            ...findMaxAndStep(totalStats.totalInserts)
        },
        autovacuumVacuumInsertScaleFactor: {
            max: 1,
            step: 0.01
        }
      }
}

const findMaxAndStep = (total: number) => {
    // set minimum max as 1000
    let max = 1000
    if (total > 1000) {
        const totalString = total.toString();
        const firstDigit = parseInt(totalString[0], 10);
        max = (firstDigit + 1) * Math.pow(10, totalString.length - 1);
    }
    return {
        max: max,
        step: max / 100
    }
}

export default ConfigurableConfigSetting;
