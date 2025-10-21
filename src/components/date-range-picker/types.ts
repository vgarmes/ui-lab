export interface Preset {
  period: string;
  start: Date;
  end: Date;
  text: string;
}

export interface FormValues {
  startValue: string;
  startTime: string;
  endValue: string;
  endTime: string;
  timeZone: string;
}
