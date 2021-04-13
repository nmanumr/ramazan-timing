import {AppData} from "./types";
import {h} from '../alpinex';

export function renderNearestRamazan({data, type}: AppData['fullMonth']) {
  return (
    <div class="bg-white shadow overflow-hidden sm:rounded-md w-full">
      <ul class="divide-y divide-gray-200">
        {
          ...data.map((dayData) => (
            <li class="block hover:bg-gray-50">
              <div class="flex items-center sm:px-6">
                <div class="px-2 py-4 whitespace-nowrap flex-grow">
                  <div class="text-sm font-medium text-gray-800">
                    {
                      new Intl.DateTimeFormat('en', {year: 'numeric', month: 'long', day: 'numeric'})
                        .format(dayData.date)
                    }
                  </div>
                  <div class="text-sm text-gray-500 flex space-x-1">
                    <span>
                      {new Intl.DateTimeFormat('en', {weekday: 'long'}).format(dayData.date)}
                    </span>
                    <span>
                      {dayData.hijriDate}
                    </span>
                  </div>
                </div>
                <div class="px-2 py-4 whitespace-nowrap flex-shrink-0">
                  <div class="flex items-baseline mt-1">
                    <p class="text-2xl text-gray-700">
                      {dayData.seharTime}
                    </p>
                    <p class="ml-1 text-sm font-medium text-gray-500">
                      AM
                    </p>
                  </div>
                </div>
                <div class="ml-4 px-2 py-4 whitespace-nowrap flex-shrink-0">
                  <div class="flex items-baseline mt-1">
                    <p class="text-2xl text-gray-700">
                      {dayData.iftarTime}
                    </p>
                    <p class="ml-1 text-sm font-medium text-gray-500">
                      PM
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
