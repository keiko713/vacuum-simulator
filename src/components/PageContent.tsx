import { SimulationConfigSettingsContextProvider } from "./SimulationConfigSettingsContext";
import VacuumSimulator from "./VacuumSimulator";

const PageContent: React.FunctionComponent<{}> = () => {
  return (
    <SimulationConfigSettingsContextProvider>
      <div className="max-w-8xl mx-auto">
        <div className="pt-4 px-8 lg:px-16">
          <VacuumSimulator />
        </div>
      </div>
    </SimulationConfigSettingsContextProvider>
  );
};

export default PageContent;
