export default interface AppDowntimeConfig {
  isDowntimeActive: boolean,
  showDowntimeWarning: boolean,
  startTime : number,
  endTime: number,
  downtimeMessage1: string,
  downtimeMessage2: string,
  downtimeMessage3: string,
  supportEmail: string,
  startTimeString: string,
  endTimeString: string,
}
