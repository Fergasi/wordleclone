// Wordle Grid / Wordle Board ....................

export const WordleGrid = ({ wordleGuessList, SquareColours, rowError }) => {
  return (
    <div className='Wordle-grid'>
      {wordleGuessList.map((row, index) => {
        return (
          <WordleRows
            key={`row-${index}`}
            rowIndex={index}
            row={row}
            SquareColours={SquareColours}
            rowError={rowError}
          ></WordleRows>
        );
      })}
    </div>
  );
};

const WordleRows = ({ rowIndex, row, SquareColours, rowError }) => {
  const isError =
    rowError.row === rowIndex && rowError.error === true ? "shake" : "";
  return (
    <div className={`Wordle-row ${isError}`}>
      {row.map((square, index) => {
        return (
          <WordleSquare
            rowIndex={rowIndex}
            index={index}
            key={`${rowIndex} - ${index}`}
            letter={square}
            SquareColours={SquareColours}
          ></WordleSquare>
        );
      })}
    </div>
  );
};

const WordleSquare = ({ letter, SquareColours, rowIndex, index }) => {
  const isFilled = letter !== "" ? "filled" : "";
  const cssColour = SquareColours[rowIndex][index]
    ? "coloured " + SquareColours[rowIndex][index]
    : "";

  return (
    <div className={`Wordle-square ${cssColour} ${isFilled}`}>{letter}</div>
  );
};
