export enum CalculationMethods {
  MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari
}

export enum TimeNames {
  imsak, fajr, sunrise, dhuhr, asr, sunset, maghrib, isha, midnight
}

export type TimesData = Record<keyof typeof TimeNames, number>;

export interface Settings {
  /** twilight angle in degrees */
  imsakAngle: number;
  /** minutes before fajr */
  imsakMin: number;

  /** twilight angle in degrees */
  fajr: number;

  /** minutes after mid-day */
  dhuhr: number;

  /**
   * asr juristic method default to Standard
   * 
   * Standard: Shafii, Maliki, Jafari and Hanbali (shadow factor = 1)
   * Hanafi:   Hanafi school of tought (shadow factor = 2)
   */
  asrMethod: 'Standard' | 'Hanafi',
  /** shadow length factor for realizing asr */
  asrFactor: number,

  /** twilight angle in degrees */
  maghribAngle: number,
  /** minutes after sunset */
  maghribMin: number,

  /** twilight angle in degrees */
  ishaDegree: number,
  /** minutes after maghrib */
  ishaMin: number,

  /**
   * midnight method default to Standard
   * 
   * Standard: The mean time from Sunset to Sunrise
   * Jafari:   The mean time from Maghrib to Fajr
   */
  midnight: 'Standard' | 'Jafari',


  /**
   * higher latitudes adjustment default to NightMiddle
   * 
   * None:        No adjustments
   * NightMiddle: The middle of the night method
   * OneSeventh:  The 1/7th of the night method
   * AngleBased:  The angle-based method (recommended)
   */
  highLats: 'None' | 'NightMiddle' | 'OneSeventh' | 'AngleBased',

  format: '12h' | '12hNS' | '24h' | 'Float';
  method: keyof typeof CalculationMethods;
  dayLightSaving?: true | false;
  timezone?: number;
  numberIteration?: number; 
}
