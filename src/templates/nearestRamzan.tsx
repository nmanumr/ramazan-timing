import {AppData, SingleDayData} from "./types";
import {h} from '../alpinex';
import {ICal} from '../ical'

function exportICal() {
  const calendar = new ICal('Ramazan Calendar');
  for (let event of this.data as SingleDayData[]) {
    const [y, m, d] = [event.date.getFullYear(), event.date.getMonth(), event.date.getDate()];
    const [sh, sm] = event.seharTime.split(':');
    const [ih, im] = event.iftarTime.split(':');

    calendar.addEvent(new Date(y, m, d, +sh, +sm, 0), 'Sehar');
    calendar.addEvent(new Date(y, m, d, +ih + 12, +im, 0), 'Iftar');
  }

  calendar.download();
}

export function renderNearestRamazan({data}: AppData['fullMonth']) {
  return (
    <div class="bg-white shadow overflow-hidden sm:rounded-md w-full">
      <div class="px-4 py-3 sm:px-6 border-b border-gray-200 flex items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900 flex-grow">
          Ramazan {data[0].hijriDate.split(' ').slice(-1)}
        </h3>
        <div class="flex-shrink-0">
          <button x-on:click={exportICal.bind({data})} type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300">
            Export ICS
          </button>
        </div>
      </div>
      <ul class="divide-y divide-gray-100">
        {
          ...data.map((dayData) => (
            <li class="block hover:bg-gray-50">
              <div class="flex items-center sm:px-6">
                <div class="pr-2 py-4 whitespace-nowrap flex-grow">
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
                <div class="ml-4 pl-2 py-4 whitespace-nowrap flex-shrink-0">
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
