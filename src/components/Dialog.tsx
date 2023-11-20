import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  useClick,
  useId,
  FloatingOverlay,
  FloatingFocusManager,
} from "@floating-ui/react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export const Dialog: React.FunctionComponent<{
  buttonLabel: React.ReactNode;
  dialogHeader: string;
  children: React.ReactNode;
  buttonClass?: string;
}> = ({ buttonLabel, dialogHeader, children, buttonClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
  });
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Set up label and description ids
  const labelId = useId();
  const descriptionId = useId();

  const buttonClassName =  buttonClass ?? "bg-[#3AA99F] text-[#FFFCF0] hover:bg-[#24837B] rounded p-2"

  return (
    <>
      <button
        className={buttonClassName}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {buttonLabel}
      </button>
      {isOpen && (
        <FloatingOverlay lockScroll className="bg-black/80 z-50">
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
              className="sm:w-[600px] shadow-2xl min-h-screen absolute top-0 right-0 bg-white"
            >
              <div className="relative bg-[#282726] text-[#F2F0E5] border-b text-[16px]">
                <div className="p-4 font-semibold">{dialogHeader}</div>
                <button
                  className="absolute top-0 right-0 p-4"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
              <div className="p-4">{children}</div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
};

export default Dialog;
