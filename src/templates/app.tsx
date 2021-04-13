import {h} from '../alpinex';
import {renderTodayCard} from "./todayCard";
import {AppData} from "./types";
import {renderNearestRamazan} from "./nearestRamzan";

export function renderApp(data: AppData) {
  return (
    <div class="space-y-4 max-w-screen-md w-full py-6">
      {renderTodayCard(data.today)}
      {renderNearestRamazan(data.fullMonth)}
    </div>
  )
}