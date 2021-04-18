import {h} from '../alpinex';
import {calculationMethods} from "../praytimes/consts";
import {BehaviorSubject} from "rxjs";
import {AppSettings, updateSettings} from "../settings";

const open$ = new BehaviorSubject(false);

function toggleSettings() {
  open$.next(!open$.getValue());
}

function saveSettings() {
  const $ = document.querySelector.bind(document);
  const settings = {
    method: $('[name="method"]').value,
    seharOffset: $('[name="seharOffset"]').value,
    iftarOffset: $('[name="iftarOffset"]').value,
  }

  updateSettings(settings);
  setTimeout(() => {
    toggleSettings();
  }, 100)
}

export function renderSettings(settings: AppSettings) {
  let methods = Object.entries(calculationMethods).map(([key, val]) => {
    return <option value={key} selected={key === settings.method}>{val.name}</option>
  })

  const modal = (
    <section class="settings-panel fixed inset-0 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="absolute inset-0 overflow-hidden">
        <div class="settings-panel__overlay"
          x-on:click={toggleSettings} aria-hidden="true"/>

        <div class="settings-panel__main-wrapper fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="settings-panel__main relative w-screen max-w-md">
            <div class="settings-panel__close-btn">
              <button x-on:click={toggleSettings} class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                <span class="sr-only">Close panel</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="h-full flex flex-col divide-y divide-gray-200 bg-white shadow-xl overflow-y-scroll">
              <div class="px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between space-x-3">
                  <div class="space-y-1">
                    <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                      Settings
                    </h2>
                    <p class="text-sm text-gray-500">
                      These settings will be saved for this browser
                    </p>
                  </div>
                </div>
              </div>
              <div class="pt-6 relative flex-1 px-4 sm:px-6">
                <div class="space-y-6">
                  <div>
                    <label for="method" class="block text-sm font-medium text-gray-700">PrayTimes Method</label>
                    <select id="method" name="method" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      {...methods}
                    </select>
                  </div>

                  <div>
                    <label for="seharOffset" class="block text-sm font-medium text-gray-700">Sehar offset (in minutes)</label>
                    <input type="number" name="seharOffset" id="seharOffset" value={settings.seharOffset || 0} class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>

                  <div>
                    <label for="iftarOffset" class="block text-sm font-medium text-gray-700">Iftar offset (in minutes)</label>
                    <input type="number" name="iftarOffset" id="iftarOffset" value={settings.iftarOffset || 0} class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
              </div>

              <div class="flex-shrink-0 px-4 py-4 flex justify-end">
                <button x-on:click={toggleSettings} type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button x-on:click={saveSettings} type="submit" class="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  open$.subscribe((open) => {
    if (open) {
      modal.classList.remove('closed');
      modal.classList.add('opened');
    } else {
      modal.classList.add('closed');
      modal.classList.remove('opened');
    }
  });

  return modal;
}

(window as any).toggleSettings = toggleSettings;
