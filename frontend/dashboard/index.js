/**
 * Dashboard Boot Loader
 * ---------------------
 * Loads and initializes the dashboard main entrypoint.
 */

import DashboardMain from "./main.js";

window.addEventListener("DOMContentLoaded", () => {
    DashboardMain.init();
});
