import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function App() {
  return (
    <div>
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none bg-white supports-backdrop-blur:bg-white/95">
        <div className="max-w-8xl mx-auto">
          <div className="py-4 border-b px-8 mx-0 lg:px-16">
            <div className="relative flex items-center">
              <a className="mr-3 flex-none overflow-hidden" href="/">
                VACUUM Simulator
              </a>
              <div className="relative flex items-center ml-auto">
                <div className="flex items-center border-l border-natural-600">
                  <a
                    href="https://github.com/keiko713/vacuum-simulator"
                    className="ml-6 block text-slate-400 hover:text-natural-600"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-8xl mx-auto">
        <div className="py-4 px-8 lg:px-16">
          <WelcomeMessage />
        </div>
      </div>
    </div>
  );
}

const WelcomeMessage: React.FunctionComponent<{}> = () => {
  return (
    <div className="font-medium border rounded px-4 py-3 bg-slate-50 border-slate-200 text-slate-700">
      <div className="py-1">
        <div className="font-semibold mb-1">Welcome to VACUUM Simulator!</div>
        Hello Hello
      </div>
    </div>
  );
};

export default App;
