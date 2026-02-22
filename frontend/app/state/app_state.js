// frontend/app/state/app_state.js

/**
 * AppState
 *
 * Aggregates all state modules into one unified state container.
 * This gives the frontend a single import point for:
 *  - PromptState
 *  - OutputState
 *  - LoadingState
 *  - ErrorState
 *  - HistoryState
 *  - ChamberState
 *  - ThemeState
 */

import PromptState from "./prompt_state";
import OutputState from "./output_state";
import LoadingState from "./loading_state";
import ErrorState from "./error_state";
import HistoryState from "./history_state";
import ChamberState from "./chamber_state";
import ThemeState from "./theme_state";

class AppState {
  constructor() {
    this.prompt = new PromptState();
    this.output = new OutputState();
    this.loading = new LoadingState();
    this.error = new ErrorState();
    this.history = new HistoryState();
    this.chamber = new ChamberState();
    this.theme = new ThemeState();
  }

  resetAll() {
    this.prompt.clear();
    this.output.clear();
    this.loading.stop();
    this.error.clear();
    this.history.clear();
    this.chamber.reset();
  }
}

const appState = new AppState();
export default appState;
