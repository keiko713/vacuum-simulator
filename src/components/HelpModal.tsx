import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent } from "react";

const HelpModal: React.FunctionComponent<{
  setOpenFunction: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenFunction }) => {
  // Unable to convert to Dialog sadly as this is rendered from PageHeader
  // Maybe there is a way to convert this
  const outerClickHandler = (evt: MouseEvent<HTMLDivElement>) => {
    if (evt.target === evt.currentTarget) {
      setOpenFunction(false);
    }
  };
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50"
      onClick={outerClickHandler}
    >
      <div className="sm:w-[600px] shadow-2xl min-h-screen absolute top-0 right-0 bg-white">
        <div className="relative bg-zinc-900 text-zinc-100 border-b text-[16px]">
          <div className="p-4 font-semibold">Help</div>
          <button
            className="absolute top-0 right-0 p-4"
            onClick={() => setOpenFunction(false)}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="p-4">
          <div className="font-semibold mb-1">Welcome to VACUUM Simulator!</div>
          VACUUM Simulator lets you tweak autovacuum settings to learn the
          relationship between Postgres configuration settings and autovacuum
          patterns. It also helps you find better autovacuum settings for the
          table.
        </div>
        <div className="p-4">
          VACUUM Simulator is originally developed by{" "}
          <a
            href="https://pganalyze.com/"
            target="_blank"
            rel="noreferrer"
            className="border-b border-neutral-900"
          >
            pganalyze
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
