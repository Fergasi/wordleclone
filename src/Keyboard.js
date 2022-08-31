// Onscreen Keyboard............................

const keysRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysRow3 = ["←", "Z", "X", "C", "V", "B", "N", "M", "Enter"];
const keyboardArr = [keysRow1, keysRow2, keysRow3];

export const Keyboard = ({ handleKeyPress, letterColour }) => {
  return (
    <div className='Keyboard'>
      {keyboardArr.map((row, index) => {
        return (
          <KeyboardRows
            key={index}
            keyRow={row}
            handleKeyPress={handleKeyPress}
            letterColour={letterColour}
          ></KeyboardRows>
        );
      })}
    </div>
  );
};

const KeyboardRows = ({ keyRow, handleKeyPress, letterColour }) => {
  return (
    <div className='Keyboard-row'>
      {keyRow.map((keys, index) => {
        return (
          <KeyboardKeys
            id={keys}
            key={index}
            letter={keys}
            handleKeyPress={handleKeyPress}
            letterColour={letterColour}
          ></KeyboardKeys>
        );
      })}
    </div>
  );
};

const KeyboardKeys = ({ letter, handleKeyPress, letterColour }) => {
  const letterColourCheck = letterColour[letter] ? letterColour[letter] : "";

  return (
    <div
      className={`Keyboard-key Keycolour-${letterColourCheck}`}
      id={letter}
      onClick={() => {
        handleKeyPress({ key: letter });
      }}
    >
      {letter}
    </div>
  );
};
