/**
 * Converts a duration string in "HH:MM:SS.mmm" or "MM:SS.mmm" format to milliseconds.
 * @param duration - The duration string (e.g., "1:02:58.537" or "58:31.537").
 * @returns The duration in milliseconds.
 */
export const parseDurationTime = (duration: string): number => {
  const regex = /^(\d+:)?(\d{1,2}):(\d{2})\.(\d{3})$/; // Matches "HH:MM:SS.mmm" or "MM:SS.mmm"
  const match = duration.match(regex);

  if (!match) {
    console.warn(`Invalid duration format: ${duration}`);
    return 0; // Default value or handle error as needed
  }

  const hours = match[1] ? parseInt(match[1].replace(':', ''), 10) : 0;
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
};

/**
* Converts milliseconds to a duration string in "HH:MM:SS.mmm" format.
* @param milliseconds - The duration in milliseconds.
* @returns The formatted duration string.
*/
export const millisecondsToDurationTime = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return 'Invalid Time';
  }

  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = (milliseconds % 1000).toString().padStart(3, '0');

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}.${millis}`;
};
