export const getColorScale = (value: number, min = 0, max = 10) => {
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / (max - min); // 0 to 1

  const r = Math.round(255 * (1 - ratio)); // Red decreases as value increases
  const g = Math.round(255 * ratio); // Green increases as value increases
  const b = 0;

  return `rgb(${r},${g},${b})`;
};

/**
 * Returns the background and text color for a numeric value
 * based on the min and max values of its column.
 */
export const getCellColors = (
  value: number,
  columnValues: number[]
): { backgroundColor: string; textColor: string } => {
  const min = Math.min(...columnValues);
  const max = Math.max(...columnValues);

  const fraction = max === min ? 1 : (value - min) / (max - min);
  const red = Math.round(255 * (1 - fraction));
  const green = Math.round(255 * fraction);
  const backgroundColor = `rgb(${red}, ${green}, 0)`;
  const textColor = fraction > 0.5 ? "black" : "white";

  return { backgroundColor, textColor };
};
