export interface ISchedule {
  id: number;
  onDays: Array<string>;
  startAtTime: string;
  duration: string;
  fireTickEveryMls: string;
  eventName: string;
  enabled: boolean;
}

