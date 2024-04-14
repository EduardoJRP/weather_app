/** @format */

export function convertWindSpeed(speedInMetersPerSecond: number): string {
  const speedInKilometersPerHour = speedInMetersPerSecond * 3.6; // Conversion of m/s to km/h
  return `${speedInKilometersPerHour.toFixed(0)}km/h`;
}
