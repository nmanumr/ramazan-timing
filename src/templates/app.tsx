import {h} from '../alpinex';
import {renderTodayCard} from "./todayCard";
import {AppData} from "./types";
import {renderNearestRamazan} from "./nearestRamzan";
import {renderSettings} from "./settings";
import {AppSettings} from "../settings";

export function renderApp(data: AppData, settings: AppSettings) {
  return (
    <div class="max-w-screen-md w-full px-4 sm:px-6 py-6">
      <div class="space-y-4">
        {renderTodayCard(data.today)}
        {renderNearestRamazan(data.fullMonth)}
      </div>

      {renderSettings(settings)}
    </div>
  )
}
