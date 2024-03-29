import { Pt } from "pts";

export const createArrayFromLength = (length: number) => {
  return [...Array(length).keys()];
};

export const getObjectKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as Array<keyof T>;

export const insertInArray = <T>(
  array: T[],
  newEl: T,
  insertAtIndex: number,
): T[] => {
  return [
    ...array.slice(0, insertAtIndex),
    newEl,
    ...array.slice(insertAtIndex),
  ];
};

export const moveInArray = <T>(array: T[], from: number, to: number) => {
  const elm = array[from];
  const withoutElArray = [...array.slice(0, from), ...array.slice(from + 1)];
  return insertInArray(withoutElArray, elm, to);
};

export const same2DPt = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
