// app/utils/timeUtils.ts

/**
 * Converts a duration string in "MM:SS.mmm" format to milliseconds.
 * @param duration - The duration string (e.g., "58:31.537").
 * @returns The duration in milliseconds.
 */
export const parseDurationTime = (duration: string): number => {
    const regex = /^(\d+):(\d{2})\.(\d{3})$/; // Matches "MM:SS.mmm"
    const match = duration.match(regex);
  
    if (!match) {
      console.warn(`Invalid duration format: ${duration}`);
      return 0; // Default value or handle error as needed
    }
  
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = parseInt(match[3], 10);
  
    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  };
  
  /**
   * Converts milliseconds to a duration string in "MM:SS.mmm" format.
   * @param milliseconds - The duration in milliseconds.
   * @returns The formatted duration string.
   */
  export const millisecondsToDurationTime = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return 'Invalid Time';
    }
  
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor(milliseconds % 1000).toString().padStart(3, '0');
  
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis}`;
  };
  