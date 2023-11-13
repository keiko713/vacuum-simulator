import { ConfigNameType, configDocs15 } from "./configDocs";

const PostgresConfig: React.FunctionComponent<{
  name: ConfigNameType;
}> = ({ name }) => {
  const configDetail = configDocs15[name];
  return (
    <div className="border rounded p-2">
      <div>
        <div><code>{configDetail.name}</code></div>
        <div>type: {configDetail.type}</div>
        <div>default: {configDetail.default}</div>
        <div>min: {configDetail.min}</div>
        <div>max: {configDetail.max}</div>
        <div>restart: {configDetail.restart}</div>
        <div>storageParameterName: {configDetail.storageParameterName}</div>
      </div>
      <div>{configDetail.description}</div>
    </div>
  );
};

export default PostgresConfig;
