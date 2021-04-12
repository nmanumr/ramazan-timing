import {CalculationMethods, Settings} from './types';

export const calculationMethods: Record<keyof typeof CalculationMethods, { name: string, params: Partial<Settings> }> = {
  MWL: {
      name: 'Muslim World League',
      params: { fajr: 18, ishaDegree: 17 }
  },
  ISNA: {
      name: 'Islamic Society of North America (ISNA)',
      params: { fajr: 15, ishaDegree: 15 }
  },
  Egypt: {
      name: 'Egyptian General Authority of Survey',
      params: { fajr: 19.5, ishaDegree: 17.5 }
  },
  Makkah: {
      name: 'Umm Al-Qura University, Makkah',
      params: { fajr: 18.5, ishaMin: 90 }
  },  // fajr was 19 degrees before 1430 hijri
  Karachi: {
      name: 'University of Islamic Sciences, Karachi',
      params: { fajr: 18, ishaDegree: 18 }
  },
  Tehran: {
      name: 'Institute of Geophysics, University of Tehran',
      params: { fajr: 17.7, ishaDegree: 14, maghribAngle: 4.5, midnight: 'Jafari' }
  },  // isha is not explicitly specified in this method
  Jafari: {
      name: 'Shia Ithna-Ashari, Leva Institute, Qum',
      params: { fajr: 16, ishaDegree: 14, maghribAngle: 4, midnight: 'Jafari' }
  }
}

export const defaultSettings: Partial<Settings> = {
  imsakMin: 10,
  dhuhr: 0,
  asrMethod: 'Standard',
  maghribMin: 0,
  maghribAngle: 0,
  midnight: 'Standard',
  highLats: 'NightMiddle',
  format: '24h',

  method: 'Karachi',
  numberIteration: 1,
}
