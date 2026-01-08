import { Order } from "../types/types";

export function descendingComparator<T extends object>(
  a: T,
  b: T,
  orderBy: keyof T
): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator<T extends object>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return (a, b) => {
    const primary = descendingComparator(a, b, orderBy);
    if (primary !== 0) return order === "desc" ? -primary : primary;

    // secondary sort by title if it exists
    if ("title" in a && "title" in b) {
      return (a as any).title.localeCompare((b as any).title);
    }

    return 0;
  };
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);

  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilized.map((el) => el[0]);
}
