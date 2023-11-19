import HelpModal from "./HelpModal";
import { useState } from "react";
import PageContent from "./PageContent";
import PageHeader from "./PageHeader";

const Page: React.FunctionComponent<{}> = () => {
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  return (
    <div>
      <PageHeader setOpenFunction={setHelpModalOpen} />
      <PageContent />
      {helpModalOpen && <HelpModal setOpenFunction={setHelpModalOpen} />}
    </div>
  );
};

export default Page;
