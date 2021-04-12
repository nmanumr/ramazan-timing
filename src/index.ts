import {take} from 'rxjs/operators';
import {renderInElement, watchPermissions} from './alpinex';
import {renderNoLocationPermission, renderTodayCard} from './templates';
import {getNearestRamazanMonth, formatHijiriDate, toHijiri} from './calendar';
import {getTimes} from './praytimes';

const mainEl = document.querySelector<HTMLElement>('#main');
const geolocationPerms$ = watchPermissions('geolocation');

geolocationPerms$
  .pipe(take(1))
  .subscribe(({state}) => {
    console.log(getNearestRamazanMonth());

    if (state !== 'granted' && state !== 'unsupported') {
      renderInElement(renderNoLocationPermission(''), mainEl);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (data) => {
        let times = getTimes(
          new Date(),
          [data.coords.latitude, data.coords.longitude, data.coords.altitude],
          {
            method: 'Karachi',
            imsakMin: 2,
            maghribMin: 4,
            format: '12hNS'
          },
        )

        renderInElement(
          renderTodayCard({
            seharTime: times.imsak.toString(),
            iftarTime: times.maghrib.toString(),
            date: formatHijiriDate(toHijiri(new Date())),
          }),
          mainEl
        );
      }, (e) => {
        renderInElement(renderNoLocationPermission(e.message), mainEl);
        return;
      }
    )
  })
