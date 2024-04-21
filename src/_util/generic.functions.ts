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

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = min * 100;
  const maxFloored = max * 100;
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) / 100; // The maximum is exclusive and the minimum is inclusive
};

export const moveInArray = <T>(array: T[], from: number, to: number) => {
  const elm = array[from];
  const withoutElArray = [...array.slice(0, from), ...array.slice(from + 1)];
  return insertInArray(withoutElArray, elm, to);
};

export const same2DPt = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
