import {renderInElement, watchPermissions} from './alpinex';
import {renderApp, renderNoLocationPermission} from './templates';
import {formatHijiriDate, getNearestRamazanMonth, toHijiri} from './hijri';
import {getTimes} from './praytimes';
import {Settings} from "./praytimes/types";
import {AppData} from "./templates/types";
import {filter, switchMap} from "rxjs/operators";
import {combineLatest, from} from "rxjs";
import {settings$} from "./settings";

const mainEl = document.querySelector<HTMLElement>('#main');
const geolocationPerms$ = watchPermissions('geolocation');


function computeData(location: [number, number, number?], settings: Partial<Settings>): AppData {
  const todayTimes = getTimes(new Date(), location, settings);
  const monthData = [];
  const nearestRamazan = getNearestRamazanMonth();

  let currentDate = nearestRamazan.startOfRamazan;
  for (let i = 1; i <= nearestRamazan.monthDays; i++) {
    const times = getTimes(currentDate, location, settings);
    monthData.push({
      seharTime: times.imsak.toString(),
      iftarTime: times.maghrib.toString(),
      hijriDate: formatHijiriDate(toHijiri(currentDate)),
      date: new Date(+currentDate),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    today: {
      seharTime: todayTimes.imsak.toString(),
      iftarTime: todayTimes.maghrib.toString(),
      hijriDate: formatHijiriDate(toHijiri(new Date())),
      date: new Date(),
    },
    fullMonth: {
      type: nearestRamazan.type,
      data: monthData
    }
  }
}


const location$ = geolocationPerms$
  .pipe(
    filter(({state}) => {
      if (state !== 'granted' && state !== 'unsupported') {
        renderInElement(renderNoLocationPermission(''), mainEl);
        return false;
      }

      return true;
    }),
    switchMap(() => {
      return from(new Promise<[number, number, number?]>((res, rej) => {
        // TODO: render the status that waiting for your browser to give your location
        navigator.geolocation.getCurrentPosition(
          ({coords}) => res([coords.latitude, coords.longitude, coords.altitude]),
          rej
        );
      }));
    })
  );

combineLatest([location$, settings$])
  .subscribe(
    ([coords, settings]) => {
      const appData = computeData(coords, {
        method: settings.method,
        offsets: {
          imsak: settings.seharOffset,
          maghrib: settings.iftarOffset,
        }
      });
      renderInElement(renderApp(appData, settings), mainEl);
    },
    (e) => {
      renderInElement(renderNoLocationPermission(e.message), mainEl);
    }
  );
