import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const PageHeader: React.FunctionComponent<{
  setOpenFunction: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenFunction }) => {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur flex-none bg-white/95">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 border-b px-8 mx-0 lg:px-16">
          <div className="relative flex items-center">
            <a
              className="mr-3 flex-none overflow-hidden text-[16px] font-semibold"
              href="/"
            >
              VACUUM Simulator
            </a>
            <div className="relative flex items-center ml-auto">
              <div className="flex items-center border-l border-slate-200 text-slate-400">
                <a
                  href="https://github.com/keiko713/vacuum-simulator"
                  className="ml-6 block hover:text-slate-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <button
                  onClick={() => setOpenFunction(true)}
                  className="ml-6 block hover:text-slate-600"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
