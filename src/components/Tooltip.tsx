import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useState } from "react";

export const Tooltip: React.FunctionComponent<{
  content: string;
  className?: string;
}> = ({ content, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: "label",
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        <FontAwesomeIcon
          className={classNames("pl-1", className)}
          icon={faCircleQuestion}
        />
      </span>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="bg-white p-2 font-normal border rounded w-[300px]"
          {...getFloatingProps()}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
