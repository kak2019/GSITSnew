/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { Icon, TooltipHost } from "@fluentui/react";

export const FieldWithTooltip = (
  label: string,
  tooltip: string,
  field: JSX.Element
) => {
  return (
    <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: "4px" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}
      >
        <span
          style={{ marginRight: "8px", fontSize: "14px", fontWeight: "500" }}
        >
          {label}
        </span>
        <TooltipHost content={tooltip} calloutProps={{ gapSpace: 0 }}>
          <Icon
            iconName="Info"
            styles={{
              root: {
                fontSize: "16px",
                cursor: "pointer",
                color: "#0078D4",
              },
            }}
          />
        </TooltipHost>
      </div>
      {field}
    </div>
  );
};
