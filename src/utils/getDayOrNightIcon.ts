/** @format */

export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {
  const hours = new Date(dateTimeString).getHours(); //Get hours from the given date and time

  const isDayTime = hours >= 6 && hours < 18; //Consider day time from 6am to 6pm

  return isDayTime
    ? iconName.replace(/ .$/, 'd')
    : iconName.replace(/ .$/, 'n');
}
