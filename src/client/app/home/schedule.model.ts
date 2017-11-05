export interface ISchedule {
  id: number;
  onDays: Array<string>;
  startAtTime: string;
  duration: string;
  fireTickEveryMls: string;
  eventName: string;
  enabled: boolean;
}

export class Schedule {

  x: any = [{
    "id": 0,
    "onDays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    "startAtTime": "07:00:00",
    "duration": "00:15:00",
    "fireTickEveryMls": 500,
    "eventName": "OpenShade",
    "enabled": true
  }]
}
