export interface SingleDayData {
  seharTime: string,
  iftarTime: string,
  hijriDate: string,
  date: Date,
}

export interface AppData {
  today: SingleDayData,
  fullMonth: {
    type: 'current' | 'upcoming' | 'previous';
    data: SingleDayData[],
  }
}
