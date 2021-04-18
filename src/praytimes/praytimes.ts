import {calculationMethods, defaultSettings} from './consts';
import {DegreeMath} from './maths'
import {Settings, TimeNames, TimesData} from './types';


/** return prayer times for given settings */
export function getTimes(date: Date, coordinates: [number, number, number?], settings: Partial<Settings>) {
  settings = {
    ...defaultSettings,
    ...calculationMethods[settings.method].params,
    ...settings
  };

  if (!settings.asrFactor) {
    settings.asrFactor = settings.asrMethod === 'Standard' ? 1 : 2;
  }

  if (coordinates.length === 2) {
    coordinates.push(0);
  }

  for (let name of Object.keys(TimeNames) as (keyof typeof TimeNames)[]) {
    if (!settings.offsets[name])
      settings.offsets[name] = 0;
  }

  let {timezone, dayLightSaving} = settings;
  if (typeof (timezone) === 'undefined')
    timezone = getTimeZone(date);
  if (typeof (dayLightSaving) === 'undefined')
    dayLightSaving = getDayLightSaving(date);

  timezone = timezone + (dayLightSaving ? 1 : 0);
  const jDate = julian(date) - coordinates[1] / (15 * 24);

  return computeTimes(settings, jDate, timezone, coordinates);
}


/* ---------------------- 
 * Calculation Functions
 * ---------------------- */

/**
 * compute mid-day time
 */
function midDay(time: number, jDate: number) {
  const eqt = sunPosition(jDate + time).equation;
  return DegreeMath.fixHour(12 - eqt);
}

/**
 * compute the time at which sun reaches a specific angle below horizon
 */
function sunAngleTime(angle: number, time: number, jDate: number, [lat]: [number, number, number?], direction: 'ccw' | 'cw' = 'cw') {
  const decl = sunPosition(jDate + time).declination;
  const noon = midDay(time, jDate);
  const t = 1 / 15 * DegreeMath.arccos((-DegreeMath.sin(angle) - DegreeMath.sin(decl) * DegreeMath.sin(lat)) /
    (DegreeMath.cos(decl) * DegreeMath.cos(lat)));
  return noon + (direction == 'ccw' ? -t : t);
}


/**
 * compute asr time
 */
function asrTime(factor: number, time: number, jDate: number, [lat]: [number, number, number?]) {
  const decl = sunPosition(jDate + time).declination;
  const angle = -DegreeMath.arccot(factor + DegreeMath.tan(Math.abs(lat - decl)));
  return sunAngleTime(angle, time, jDate, [lat, 0]);
}

/**
 * Computes the Sun's angular coordinates to an accuracy
 * of about 1 arcminute within two centuries of 2000.
 * The algorithm's accuracy degrades gradually beyond
 * its four-century window of applicability.
 *
 * Ref: http://web.archive.org/web/20190925205122/http://aa.usno.navy.mil/faq/docs/SunApprox.php
 */
function sunPosition(julianDay: number) {
  let D = julianDay - 2451545.0;
  let g = DegreeMath.fixAngle(357.529 + 0.98560028 * D);
  let q = DegreeMath.fixAngle(280.459 + 0.98564736 * D);
  let L = DegreeMath.fixAngle(q + 1.915 * DegreeMath.sin(g) + 0.020 * DegreeMath.sin(2 * g));

  let e = 23.439 - 0.00000036 * D;

  let RA = DegreeMath.arctan2(DegreeMath.cos(e) * DegreeMath.sin(L), DegreeMath.cos(L)) / 15;
  let eqt = q / 15 - DegreeMath.fixHour(RA);
  let decl = DegreeMath.arcsin(DegreeMath.sin(e) * DegreeMath.sin(L));

  return {declination: decl, equation: eqt};
}

/**
 * Convert Gregorian date to Julian day
 * Ref: Astronomical Algorithms by Jean Meeus
 */
function julian(date: Date) {
  let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}


/* ---------------------- 
 * Compute Prayer Times
 * ---------------------- */

/** Compute prayer times at given julian date */
function computePrayerTimes(
  times: Partial<TimesData>,
  jDate: number,
  coordinates: [number, number, number?],
  settings: Partial<Settings>
): Omit<TimesData, 'midnight'> {
  times = dayPortion(times);

  return {
    imsak: sunAngleTime(settings.imsakAngle || settings.imsakMin, times.imsak, jDate, coordinates, 'ccw'),
    fajr: sunAngleTime(settings.fajr, times.fajr, jDate, coordinates, 'ccw'),
    sunrise: sunAngleTime(sunSetRaiseAngle(coordinates[2]), times.sunrise, jDate, coordinates, 'ccw'),
    dhuhr: midDay(times.dhuhr, jDate),
    asr: asrTime(settings.asrFactor, times.asr, jDate, coordinates),
    sunset: sunAngleTime(sunSetRaiseAngle(coordinates[2]), times.sunset, jDate, coordinates),
    maghrib: sunAngleTime(settings.maghribAngle || settings.maghribMin, times.maghrib, jDate, coordinates),
    isha: sunAngleTime(settings.ishaDegree || settings.ishaDegree, times.isha, jDate, coordinates),
  }
}

/** compute prayer times */
function computeTimes(
  settings: Partial<Settings>,
  jDate: number,
  timeZone: number,
  coordinates: [number, number, number?]
): Partial<Record<keyof typeof TimeNames, number | string>> {
  // default times
  let times: Partial<TimesData> = {
    imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12,
    asr: 13, sunset: 18, maghrib: 18, isha: 18
  };

  // main iterations
  for (let i = 1; i <= settings.numberIteration; i++)
    times = computePrayerTimes(times, jDate, coordinates, settings);

  times = adjustTimes(times, timeZone, coordinates, settings);

  // add midnight time
  times.midnight = (settings.midnight == 'Jafari') ?
    times.sunset + timeDiff(times.sunset, times.fajr) / 2 :
    times.sunset + timeDiff(times.sunset, times.sunrise) / 2;

  tuneOffsets(times, settings);
  for (const i of Object.keys(times) as (keyof typeof TimeNames)[])
    (times[i] as any) = getFormattedTime(times[i], settings.format);

  return times;
}

function tuneOffsets(times: Partial<TimesData>, settings: Partial<Settings>) {
  for (let [name, val] of Object.entries(settings.offsets)) {
    if (isNaN(name as any))
      (times as any)[name] += val / 60;
  }
}

function adjustTimes(
  times: Partial<TimesData>,
  timeZone: number,
  coordinates: [number, number, number?],
  settings: Partial<Settings>
): Partial<TimesData> {
  for (const i of Object.keys(times) as (keyof typeof TimeNames)[])
    times[i] += timeZone - coordinates[1] / 15;

  if (settings.highLats != 'None')
    times = adjustHighLats(times, settings);

  if (settings.imsakMin)
    times.imsak = times.fajr - settings.imsakMin / 60;
  if (settings.maghribMin)
    times.maghrib = times.sunset + settings.maghribMin / 60;
  if (settings.ishaMin)
    times.isha = times.maghrib + settings.ishaMin / 60;
  times.dhuhr += settings.dhuhr / 60;

  return times;
}

/**
 * Sun set/raise angle at the given altitude on earth
 */
function sunSetRaiseAngle(altitude: number) {
  const angle = 0.0347 * Math.sqrt(altitude); // an approximation
  return 0.833 + angle;
}

/** adjust times for locations in higher latitudes  */
function adjustHighLats(times: Partial<TimesData>, settings: Partial<Settings>) {
  const nightTime = timeDiff(times.sunset, times.sunrise);

  times.imsak = adjustHLTime(times.imsak, times.sunrise, settings.imsakAngle, nightTime, settings, 'ccw');
  times.fajr = adjustHLTime(times.fajr, times.sunrise, settings.fajr, nightTime, settings, 'ccw');
  times.isha = adjustHLTime(times.isha, times.sunset, settings.ishaDegree, nightTime, settings);
  times.maghrib = adjustHLTime(times.maghrib, times.sunset, settings.maghribAngle, nightTime, settings);

  return times;
}

/** adjust a time for higher latitudes */
function adjustHLTime(time: number, base: number, angle: number, night: number, settings: Partial<Settings>, direction: 'ccw' | 'cw' = 'cw') {
  const portion = nightPortion(angle, night, settings);
  const timeDiffVal = (direction == 'ccw') ?
    timeDiff(time, base) :
    timeDiff(base, time);
  if (isNaN(time) || timeDiffVal > portion)
    time = base + (direction == 'ccw' ? -portion : portion);
  return time;
}

/** the night portion used for adjusting times in higher latitudes */
function nightPortion(angle: number, night: number, settings: Partial<Settings>) {
  const method = settings.highLats;
  let portion = 1 / 2 // MidNight
  if (method == 'AngleBased')
    portion = 1 / 60 * angle;
  if (method == 'OneSeventh')
    portion = 1 / 7;
  return portion * night;
}

/** convert hours to day portions */
function dayPortion(times: Partial<TimesData>) {
  for (const i of Object.keys(times) as (keyof typeof TimeNames)[])
    times[i] /= 24;
  return times;
}

/* --------------------------
 * Time Zone Functions
 * -------------------------- */

/**
 * Calculates the timezone offset from UTC
 */
function getTimeZone(date: Date): number {
  const year = date.getFullYear();
  const t1 = utcOffset(new Date(year, 0, 1));
  const t2 = utcOffset(new Date(year, 6, 1));
  return Math.min(t1, t2);
}

/**
 * Finds the UTC offset of the date
 */
function utcOffset(date: Date): number {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  const GMTString = localDate.toUTCString();
  const GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
  return (+localDate - +GMTDate) / (1000 * 60 * 60);
}

/**
 * Finds Daylight saving settings for the given date
 */
function getDayLightSaving(date: Date): boolean {
  return utcOffset(date) != getTimeZone(date);
}


/* --------------------------
 * Misc Functions
 * -------------------------- */

/** compute the difference between two times */
function timeDiff(time1: number, time2: number) {
  return DegreeMath.fixHour(time2 - time1);
}

/** add a leading 0 if necessary */
function twoDigitsFormat(num: number) {
  return (num < 10) ? '0' + num : num;
}

/** convert float time to the given format */
function getFormattedTime(time: number, format: '12h' | '12hNS' | '24h' | 'Float', suffixes: [string, string] = ['am', 'pm']) {
  if (isNaN(time))
    return '-----';
  if (format == 'Float') return time;

  time = DegreeMath.fixHour(time + 0.5 / 60);  // add 0.5 minutes to round
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  const suffix = (format == '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
  const hour = (format == '24h') ? twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);
  return hour + ':' + twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '');
}
