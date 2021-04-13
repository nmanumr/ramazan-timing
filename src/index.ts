import {renderInElement, watchPermissions} from './alpinex';
import {renderApp, renderNoLocationPermission} from './templates';
import {formatHijiriDate, getNearestRamazanMonth, toHijiri} from './calendar';
import {getTimes} from './praytimes';
import {Settings} from "./praytimes/types";
import {AppData} from "./templates/types";

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

geolocationPerms$
  .subscribe(({state}) => {
    console.log(getNearestRamazanMonth());

    if (state !== 'granted' && state !== 'unsupported') {
      renderInElement(renderNoLocationPermission(''), mainEl);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        const appData = computeData([coords.latitude, coords.longitude, coords.altitude], {
          method: 'Karachi',
          imsakMin: 3,
          maghribMin: 5,
          format: '12hNS'
        });

        console.log(appData);
        renderInElement(renderApp(appData), mainEl);
      }, (e) => {
        renderInElement(renderNoLocationPermission(e.message), mainEl);
        return;
      }
    )
  })
