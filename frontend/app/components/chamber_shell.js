// frontend/app/components/chamber_shell.js

import React from "react";
import ChamberCore from "./chamber_core";

/**
 * ChamberShell
 *
 * This component is the outer container for the chamber system.
 * It provides layout, structure, and styling around the ChamberCore.
 *
 * It expects a `runChamber` prop:
 *   async function runChamber(prompt: string): Promise<string>
 */

const ChamberShell = ({ runChamber }) => {
  return (
    <div className="chamber-shell">
      <div className="chamber-shell__inner">
        <ChamberCore runChamber={runChamber} />
      </div>
    </div>
  );
};

export default ChamberShell;
