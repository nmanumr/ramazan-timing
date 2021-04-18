import {CalculationMethods} from "./praytimes/types";
import {BehaviorSubject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

export interface AppSettings {
  method: keyof typeof CalculationMethods;
  seharOffset: number;
  iftarOffset: number;
}

const _settings$ = new BehaviorSubject<AppSettings>(loadSavedSettings());

function loadSavedSettings() {
  const defaultSettings: AppSettings = {
    method: 'Karachi',
    seharOffset: 6,
    iftarOffset: 4,
  }
  const savedSettings = JSON.parse(localStorage.getItem('settings') || '{}');
  return {...defaultSettings, ...savedSettings};
}

export function updateSettings(settings: AppSettings) {
  localStorage.setItem('settings', JSON.stringify(settings));
  console.log(settings);
  _settings$.next(settings);
}

export const settings$ = _settings$.pipe(
  distinctUntilChanged((x, y) => {
    return x.method === y.method && x.iftarOffset === y.iftarOffset && x.seharOffset === y.seharOffset;
  })
);
