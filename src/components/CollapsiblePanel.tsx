import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const CollapsiblePanel: React.FunctionComponent<{
  children: React.ReactNode;
  title: string;
  icon?: IconProp;
}> = ({ children, title, icon }) => {
  const [collapsed, setCollapsed] = useState(false);
  function handleTogglePanel() {
    setCollapsed(!collapsed);
  }
  const titleBorder = collapsed ? "" : "border-b";
  return (
    <div className="border mb-2">
      <div onClick={handleTogglePanel} className={`p-2 bg-[#F2F0E5] ${titleBorder}`}>
        <FontAwesomeIcon
          icon={collapsed ? faAngleRight : faAngleDown}
          className="pr-2"
          fixedWidth
        />
        {icon && <FontAwesomeIcon icon={icon} className="pr-2" fixedWidth />}
        {title}
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  );
};

export default CollapsiblePanel;
