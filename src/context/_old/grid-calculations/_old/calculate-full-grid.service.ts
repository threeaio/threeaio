import {
  AreaDefinition,
  AreaDefinitionWithCells,
  AreaDict,
  AreaDictWithCells,
  AreaPosition,
  CellLines,
  Corner,
  GridCell,
  StadiumState,
} from "../../../../types/types";
import {
  createArrayFromLength,
  getObjectKeys,
} from "../../../../_util/generic.functions";
import { Accessor } from "solid-js";

const makeAreaDefinitionWithCells = (
  areaDefinition: AreaDefinition,
  cells: GridCell[][],
): AreaDefinitionWithCells => {
  return {
    ...areaDefinition,
    cells,
  };
};

export const getWithMaxAtProp = <T>(list: T[], prop: keyof T): T => {
  return list.reduce(
    (prevItem, listItem) =>
      listItem[prop] > prevItem[prop] ? listItem : prevItem,
    list[0],
  );
};

export const pickSameX = (cell: GridCell, row: GridCell[]): GridCell => {
  return row.find((_cell) => _cell.xIndex === cell.xIndex)!;
};

export const pickRight = (cell: GridCell, row: GridCell[]): GridCell => {
  if (cell.xIndex === getWithMaxAtProp(row, "xIndex").xIndex) {
    return row[0];
  } else {
    return row.find((_cell) => _cell.xIndex === cell.xIndex! + 1)!;
  }
};

export const pickLeft = (cell: GridCell, row: GridCell[]): GridCell => {
  if (cell.xIndex === 0) {
    return getWithMaxAtProp(row, "xIndex");
  } else {
    return row.find((_cell) => _cell.xIndex === cell.xIndex! - 1)!;
  }
};

export const stadiumLines = (
  curveAreasLines: Accessor<{
    bottomLeft: CellLines[][];
    bottomRight: CellLines[][];
    topLeft: CellLines[][];
    topRight: CellLines[][];
  }>,
  straightAreasLines: Accessor<{
    top: CellLines[][];
    left: CellLines[][];
    bottom: CellLines[][];
    right: CellLines[][];
  }>,
) => {
  return {
    topLeft: {
      type: "corner",
      leftNeighbour: "left",
      rightNeighbour: "top",
      data: curveAreasLines().topLeft,
    },
    top: {
      type: "straight",
      leftNeighbour: "left",
      rightNeighbour: "top",
      data: straightAreasLines().top,
    },
    topRight: {
      type: "corner",
      leftNeighbour: "top",
      rightNeighbour: "right",
      data: curveAreasLines().topRight,
    },
    right: {
      type: "straight",
      leftNeighbour: "topRight",
      rightNeighbour: "rightBottom",
      data: straightAreasLines().right,
    },
    rightBottom: {
      type: "corner",
      leftNeighbour: "right",
      rightNeighbour: "bottom",
      data: curveAreasLines().bottomRight,
    },
    bottom: {
      type: "straight",
      leftNeighbour: "rightBottom",
      rightNeighbour: "leftBottom",
      data: straightAreasLines().bottom,
    },
    leftBottom: {
      type: "corner",
      leftNeighbour: "bottom",
      rightNeighbour: "left",
      data: curveAreasLines().bottomLeft,
    },
    left: {
      type: "straight",
      leftNeighbour: "leftBottom",
      rightNeighbour: "topRight",
      data: straightAreasLines().left,
    },
  } as AreaDict;
};

const rowsWithCellsFromArea = (
  data: AreaDefinition,
  belongsTo: AreaPosition,
): GridCell[][] => {
  if (data.type === "corner" || data.type === "straight") {
    const cornerData = data.data as Corner;
    return cornerData.map((row) => {
      return row
        .filter((el) => !!el.lineRight && !!el.lineToTop)
        .map((el, colIndexLocal): GridCell => {
          return {
            belongsTo,
            bottomLeft: el.lineRight[0].clone(),
            vectorToRight: el.lineRight[1].$subtract(el.lineRight[0]),
            vectorToTop: el.lineToTop[1].$subtract(el.lineToTop[0]),
            vectorDiagonal: row[colIndexLocal + 1].lineToTop[1].$subtract(
              el.lineToTop[0],
            ),
          };
        });
    });
  } else {
    return [[]];
  }
};

export const stadiumGrid = (
  stadiumState: StadiumState,
  areas: Accessor<AreaDict>,
): GridCell[] => {
  const areaDict = areas();

  console.log("stadiumGrid");

  if (!areaDict.topRight.data || !areaDict.topRight.data.length) {
    console.log("Should abort");
    return [];
  }
  const numRows = stadiumState.rowAmount;

  const withCells: AreaDictWithCells = getObjectKeys(areaDict).reduce(
    (prev: AreaDict, curr: keyof AreaDict): AreaDictWithCells => {
      const currAreaDefinition: AreaDefinition = areaDict[curr];
      const definition = makeAreaDefinitionWithCells(
        currAreaDefinition,
        rowsWithCellsFromArea(currAreaDefinition, curr),
      );
      return {
        ...prev,
        [curr]: definition,
      } as AreaDictWithCells;
    },
    areaDict as AreaDictWithCells,
  );

  // just for debugging
  // const someHaveNoCells: boolean = !getObjectKeys(withCells)
  //   .map((key) => withCells[key].cells.length > 0)
  //   .find((e) => !e);
  //
  // console.log("someHaveNoCells", someHaveNoCells, withCells);
  //
  // if (someHaveNoCells) {
  //   console.log("Some have no Cells!!!!");
  //   return [];
  // }

  return createArrayFromLength(numRows)
    .map((index) => {
      return [
        ...withCells.topLeft.cells[index],
        ...withCells.top.cells[index],
        ...withCells.topRight.cells[index],
        ...withCells.right.cells[index],
        ...withCells.rightBottom.cells[index],
        ...withCells.bottom.cells[index],
        ...withCells.leftBottom.cells[index],
        ...withCells.left.cells[index],
      ];
    })
    .map((row, rowIndex): GridCell[] => {
      return row.map((cell, index) => {
        return {
          ...cell,
          xIndex: index,
          yIndex: rowIndex,
        };
      });
    })
    .map((row, rowIndex, allRows) => {
      const allRowsFlat = allRows.flatMap((e) => e);
      return row.map((cell) => {
        return {
          ...cell,
          leftCell: pickLeft(cell, row),
          rightCell: pickRight(cell, row),
          topCell:
            rowIndex < allRows.length - 1
              ? pickSameX(cell, allRows[rowIndex + 1])
              : null,
          bottomCell:
            rowIndex > 0 ? pickSameX(cell, allRows[rowIndex - 1]) : null,
        };
      });
    })
    .flatMap((e) => e);
};
