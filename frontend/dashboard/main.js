/**
 * Dashboard Entrypoint
 * --------------------
 * Boots the dashboard controller.
 */

import DashboardController from "./dashboard.js";

class DashboardMain {
    init() {
        console.log("🛰️ Dashboard booting...");
        DashboardController.init();
        console.log("🟢 Dashboard initialized");
    }
}

export default new DashboardMain();
