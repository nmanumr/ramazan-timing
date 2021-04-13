import { h } from '../alpinex';
import {SingleDayData} from "./types";

export function renderTodayCard({ seharTime, iftarTime, hijriDate }: SingleDayData) {
  return (
    <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow w-full">
      <div class="bg-white px-4 py-4 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Today Times
        </h3>
        <p class="text-sm text-gray-500">
          {hijriDate}
        </p>
      </div>
      <div class="px-4 py-5 sm:px-6 flex items-center justify-between space-x-8">
        <div>
          <p class="text-sm font-medium text-gray-500">Sehar Time</p>
          <div class="flex items-baseline mt-1">
            <p class="text-4xl text-gray-700">
              {seharTime}
            </p>
            <p class="ml-1 text-sm font-medium text-gray-500">
              AM
            </p>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Iftar Time</p>
          <div class="flex items-baseline mt-1">
            <p class="text-4xl text-gray-700">
              {iftarTime}
            </p>
            <p class="ml-1 text-sm font-medium text-gray-500">
              PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
