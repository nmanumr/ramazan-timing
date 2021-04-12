import { h } from '../alpinex';

export function renderTodayCard({ seharTime, iftarTime, date }: { seharTime: string; iftarTime: string, date: string }) {
  return (
    <div class="flex justify-center items-center w-full">
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow max-w-screen-sm w-full">
        <div class="bg-white px-4 py-3 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
          {date}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Today Times
          </p>
        </div>
        <div class="px-4 py-5 sm:px-6 flex items-center justify-between space-x-8">
          <div>
            <p class="text-sm font-medium text-gray-500">Sehar Time</p>
            <div class="flex items-baseline mt-1">
              <p class="text-4xl font-medium text-gray-700">
                {seharTime}
              </p>
              <p class="ml-1 text-sm font-semibold">
                AM
              </p>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Iftar Time</p>
            <div class="flex items-baseline mt-1">
              <p class="text-4xl font-medium text-gray-700">
                {iftarTime}
              </p>
              <p class="ml-1 text-sm font-semibold">
                PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}