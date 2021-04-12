import { take } from 'rxjs/operators';
import { watchPermissions, renderInElement } from './alpinex';
import { renderNoLocationPermission, renderTodayCard } from './templates';
import { getNearestRamzanMonth } from './calendar';
import { getTimes } from './praytimes';

const mainEl = document.querySelector<HTMLElement>('#main');
const geolocationPerms$ = watchPermissions('geolocation');

geolocationPerms$
  .pipe(take(1))
  .subscribe(({ state }) => {
    console.log(getNearestRamzanMonth());
    if (state !== 'granted' && state !== 'unsupported') {
      renderInElement(
        renderNoLocationPermission(''),
        mainEl
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (data) => {
        let times = getTimes(new Date(), [data.coords.latitude, data.coords.longitude, data.coords.altitude], {
          method: 'Karachi',
          imsakMin: 2,
          maghribMin: 4,
        })

        renderInElement(
          renderTodayCard({
            seharTime: '4:23',
            iftarTime: '6:44',
            date: '1 Ramadan 1442',
          }),
          mainEl
        );

        console.log(times);
      }, (e) => {
        console.log(e);
      }
    )
  })

// let start = new Date(2021, 3, 14);
// const calendar = ical({name: 'Ramzan Calendar for BWP (29.367, 71.702)'});

// for (let x = 0; x < 30; x ++) {
//     start.setDate(start.getDate() + 1);
//     let times = getTimes(start, [29.367, 71.702], {
//         method: 'Karachi',
        // imsakMin: 2,
        // maghribMin: 4,
    // })

    // let [sHour, sMin] = times.imsak.toString().split(':');
    // calendar.createEvent({
    //     start: new Date(2021, start.getMonth(), start.getDate(), +sHour, +sMin),
    //     end: new Date(2021, start.getMonth(), start.getDate(), +sHour, +sMin + 1),
    //     summary: 'Sehar',
    // });

    // let [aHour, aMin] = times.maghrib.toString().split(':');
    // calendar.createEvent({
    //     start: new Date(2021, start.getMonth(), start.getDate(), +aHour, +aMin),
    //     end: new Date(2021, start.getMonth(), start.getDate(), +aHour, +aMin + 1),
    //     summary: 'Iftar',
    // });

    // console.log(`(${x+1}) ${new Intl.DateTimeFormat('en-US').format(start)}:  ${times.imsak} -- ${times.maghrib}`);
// }

// console.log(calendar.toString())
