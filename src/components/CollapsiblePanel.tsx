import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const CollapsiblePanel: React.FunctionComponent<{
  children: React.ReactNode;
  title: string;
  icon?: IconProp;
  defaultCollapsed?: boolean;
}> = ({ children, title, icon, defaultCollapsed }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  function handleTogglePanel() {
    setCollapsed(!collapsed);
  }
  const titleBorder = collapsed ? "" : "border-b";
  return (
    <div className="border mb-2">
      <div onClick={handleTogglePanel} className={`p-2 bg-stone-100 ${titleBorder}`}>
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
