import { ConfigNameType, configDocs15 } from "../configDocs";
import RangeInput from "../RangeInput";
import {
  SimulationConfigSettingsContext,
  SimulationConfigSetContext,
} from "./SimulationConfigSettingsContext";
import { useContext, useState } from "react";
import {
  TotalStatsForRangeContext,
  TotalStatsType,
} from "./TotalStatsForRangeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSquareMinus } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../Tooltip";

const ConfigAdjuster: React.FunctionComponent<{
  name: ConfigNameType;
}> = ({ name }) => {
  const [hide, setHide] = useState(false);
  const configSettings = useContext(SimulationConfigSettingsContext);
  const setConfigSettings = useContext(SimulationConfigSetContext);
  const totalStats = useContext(TotalStatsForRangeContext);
  const configDetail = configDocs15[name];
  const floatingPoint = configDetail.type === "floating point";
  const rangeConfig = generateRangeConfig(totalStats)[name];
  return (
    <div className="border rounded p-3 bg-white text-[14px]">
      <div className="font-semibold grid grid-cols-[25px_1fr_110px]">
        {hide ? (
          <FontAwesomeIcon
            className="self-center"
            icon={faPen}
            fixedWidth
            onClick={() => setHide(false)}
          />
        ) : (
          <FontAwesomeIcon
            className="self-center"
            icon={faSquareMinus}
            fixedWidth
            onClick={() => setHide(true)}
          />
        )}
        <div>
          <code>{configDetail.name}</code>
          <Tooltip content={configDocs15[name].description} />
        </div>
        <div className="text-right">
          {floatingPoint
            ? configSettings[name].toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 1,
              })
            : configSettings[name].toLocaleString("en-US")}
        </div>
      </div>
      {!hide && (
        <div className="pt-3">
          <RangeInput
            value={configSettings[name]}
            id={configDetail.name}
            min={configDetail.min === -1 ? 0 : configDetail.min}
            max={rangeConfig.max ?? configDetail.max}
            step={rangeConfig.step}
            onChange={(evt) => {
              const newValue = Number(evt.currentTarget.value);
              if (
                !isNaN(newValue) &&
                newValue >= configDetail.min &&
                newValue <= configDetail.max
              ) {
                configSettings[name] = newValue;
                setConfigSettings({ ...configSettings });
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
              value={configSettings[name]}
              min={configDetail.min}
              max={configDetail.max}
              step={rangeConfig.step}
              onChange={(evt) => {
                const newValue = Number(evt.currentTarget.value);
                if (
                  !isNaN(newValue) &&
                  newValue >= configDetail.min &&
                  newValue <= configDetail.max
                ) {
                  configSettings[name] = newValue;
                  setConfigSettings({ ...configSettings });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const generateRangeConfig = (totalStats: TotalStatsType) => {
  return {
    autovacuumVacuumThreshold: {
      ...findMaxAndStep(totalStats.totalUpdates + totalStats.totalDeletes),
    },
    autovacuumVacuumScaleFactor: {
      max: 1,
      step: 0.01,
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
      ...findMaxAndStep(totalStats.totalInserts),
    },
    autovacuumVacuumInsertScaleFactor: {
      max: 1,
      step: 0.01,
    },
  };
};

const findMaxAndStep = (total: number) => {
  // set minimum max as 1000
  let max = 1000;
  if (total > 1000) {
    const totalString = total.toString();
    const firstDigit = parseInt(totalString[0], 10);
    max = (firstDigit + 1) * Math.pow(10, totalString.length - 1);
  }
  return {
    max: max,
    step: max / 100,
  };
};

export default ConfigAdjuster;
