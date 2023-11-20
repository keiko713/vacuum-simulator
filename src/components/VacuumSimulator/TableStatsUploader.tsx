import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "../Dialog";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { toSnakeCase } from "../util";
import { addCustomTableStats, isCustomTableName } from "./CustomTableStats";
import { isSampleTableName } from "./SampleTableStats";

export type InputData = {
  collectedAt: number;
  deadTuples: number;
  liveTuples: number;
  frozenxidAge: number;
  minmxidAge: number;
  deletes: number;
  inserts: number;
  updates: number;
  hotUpdates: number;
  insertsSinceVacuum: number;
};

const TableStatsUploader: React.FunctionComponent<{
  setTableName: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setTableName }) => {
  const [inputData, setInputData] = useState<{
    tableName: string;
    file: File | null;
  }>({
    tableName: "",
    file: null,
  });
  const [message, setMessage] = useState({
    error: false,
    message: "",
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const key = toSnakeCase(value);
    if (isSampleTableName(key) || isCustomTableName(key)) {
      setMessage({
        error: true,
        message: `The table name "${value}" is already in use. Please choose a different name.`,
      });
      return;
    }
    setInputData((prevState) => ({
      ...prevState,
      tableName: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInputData((prevState) => ({
        ...prevState,
        file: file,
      }));
    }
  };
  const handleUpload = () => {
    Papa.parse(inputData.file as File, {
      complete: (result: ParseResult<InputData>) => {
        const filteredData = result.data.filter((row) => row.collectedAt);
        if (filteredData.length === 0) {
          console.log("Result Data: ", result.data);
          setMessage({
            error: true,
            message:
              "No rows found with a CSV file. Please provide ones with the data.",
          });
          return;
        }
        const key = addCustomTableStats(inputData.tableName, filteredData);
        setTableName(key);
        // TODO: somehow close the Dialog if possible
        setMessage({
          error: false,
          message: "Successfully uploaded. Please close this window.",
        });
      },
      error: (e) => {
        console.log("CSV parse error: ", e);
        setMessage({
          error: true,
          message:
            "Error while reading a CSV file. Please double check the format.",
        });
      },
      header: true,
    });
  };

  return (
    <Dialog buttonLabel="Add new data" dialogHeader="Add new data with CSV">
      <div>
        <div>
          You can provide table stats data of your table to let VACUUM Simulator
          simulate VACUUMs with it.
        </div>
        <p className="py-2 font-semibold">Step 1: Collect data</p>
        <div>
          You can collect the table stats using the SQL you can find in the
          below link. See the comments inside of the SQL file for how to run it.
          By default, it is collecting the stats every 10 minutes. It is
          recommended to run the SQL more than 1 day to get better simulation.
        </div>
        <FontAwesomeIcon icon={faGithub} className="pr-2" />
        <a
          href="https://github.com/keiko713/vacuum-simulator/blob/main/src/sampledata/collector.sql"
          target="_blank"
          rel="noreferrer"
          className="border-b border-[#100F0F]"
        >
          collector.sql
        </a>
        <p className="py-2 font-semibold">Step 2: Upload data</p>
        <div>
          Upload the CSV file generated in the previous step to run the
          simulation with it. The data will be only stored in your local storage
          and won't be sent to the server. Uploaded data will be selectable from
          the dropdown menu.
        </div>
        <div className="py-2 flex flex-col gap-4">
          <input
            className="border border-[#E6E4D9] rounded block p-2"
            type="text"
            placeholder="your table name"
            onChange={handleNameChange}
          />
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button
            className="bg-[#3AA99F] text-[#FFFCF0] hover:bg-[#24837B] disabled:bg-[#DAD8CE] rounded p-2"
            onClick={handleUpload}
            disabled={!(inputData.tableName && inputData.file)}
          >
            Upload File
          </button>
          <div className="font-semibold" hidden={!message.message}>
            {message.message}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TableStatsUploader;
