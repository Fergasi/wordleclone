import React, { useState, useEffect } from "react";
import { answerList, wordList } from "./wordleWords";
import "./App.css";

const defaultGuessList = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const defaultSquareColours = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const keysRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysRow3 = ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"];
const keyboardArr = [keysRow1, keysRow2, keysRow3];

function App() {
  const dayIncrementor = () => {
    var startDate = new Date("6-10-2022");
    var today = new Date();
    var days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    return days;
  };

  const pickWordleAnswer = () => answerList[dayIncrementor()];
  const [wordleAnswer, setWordleAnswer] = useState(pickWordleAnswer());

  const [SquareColours, setSquareColours] = useState(
    JSON.parse(JSON.stringify(defaultSquareColours))
  );
  const [wordleGuessIndex, setWordleGuessIndex] = useState(0);
  const [wordleLetterIndex, setWordleLetterIndex] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [wordleGuessList, setWordleGuessList] = useState(
    JSON.parse(JSON.stringify(defaultGuessList))
  );
  const [letterColour, setLetterColour] = useState({});

  const wordleGuessListCopy = [
    [...wordleGuessList[0]],
    [...wordleGuessList[1]],
    [...wordleGuessList[2]],
    [...wordleGuessList[3]],
    [...wordleGuessList[4]],
    [...wordleGuessList[5]],
  ];

  const handleKeyEvent = (letter) => {
    if (gameState === "playing") {
      wordleGuessListCopy[wordleGuessIndex].splice(
        wordleLetterIndex,
        1,
        letter
      );
      setWordleGuessList([...wordleGuessListCopy]);
      if (wordleLetterIndex < 4) {
        setWordleLetterIndex(wordleLetterIndex + 1);
      }
    }
  };

  const handleDeleteBackspace = () => {
    console.log(wordleLetterIndex);
    if (gameState === "playing") {
      if (wordleGuessListCopy[wordleGuessIndex][wordleLetterIndex]) {
        wordleGuessListCopy[wordleGuessIndex].splice(wordleLetterIndex, 1, "");
        setWordleGuessList([...wordleGuessListCopy]);
      } else {
        if (wordleLetterIndex > 0) {
          wordleGuessListCopy[wordleGuessIndex].splice(
            wordleLetterIndex - 1,
            1,
            ""
          );
          setWordleGuessList([...wordleGuessListCopy]);
          setWordleLetterIndex(wordleLetterIndex - 1);
        }
      }
    }
  };
  const handleEnter = () => {
    const guess = wordleGuessList[wordleGuessIndex].join("").toLowerCase();

    if (guess.length < 5) {
      handleGameUpdate(
        "Some letters are missing... Please enter a complete 5 letter word"
      );
      return;
    } else if (!answerList.includes(guess) && !wordList.includes(guess)) {
      handleGameUpdate("Not a valid word");
      return;
    } else if (guess === wordleAnswer) {
      changeColour();
      setGameState("won");
      handleGameUpdate("Congrats you got it!");
    } else if (wordleGuessIndex >= 5) {
      changeColour();
      setGameState("lost");
      handleGameUpdate(
        "Unfortunately you did not get it today -  try again tomorrow!"
      );
    } else {
      changeColour();
      setWordleGuessIndex(wordleGuessIndex + 1);
      setWordleLetterIndex(0);
    }
  };

  const letters = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];

  const handleKeyPress = ({ key }) => {
    if (key === "Enter") {
      handleEnter("Enter");
    }
    if (key === "Backspace" || key === "Delete") {
      handleDeleteBackspace("Backspace");
    }
    if (letters.includes(key.toUpperCase())) {
      handleKeyEvent(key.toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleGameUpdate = (message) => {
    alert(message);
    //assess whether user has guessed correct letter / won
  };

  let recurseCount = 1;

  const changeColour = () => {
    const wordleAnswerArray = wordleAnswer.toUpperCase().split("");
    const letterColourCopy = letterColour;

    for (let i = 0; i < wordleGuessList[wordleGuessIndex].length; i++) {
      if (wordleGuessList[wordleGuessIndex][i] === wordleAnswerArray[i]) {
        defaultSquareColours[wordleGuessIndex].splice(i, 1, "green");
        letterColourCopy[wordleGuessList[wordleGuessIndex][i]] = "green";
      } else if (
        wordleAnswerArray.includes(wordleGuessList[wordleGuessIndex][i]) &&
        letterColourCopy[wordleGuessList[wordleGuessIndex][i]] !== "green"
      ) {
        defaultSquareColours[wordleGuessIndex].splice(i, 1, "yellow");
        letterColourCopy[wordleGuessList[wordleGuessIndex][i]] = "yellow";
      } else {
        defaultSquareColours[wordleGuessIndex].splice(i, 1, "grey");
        if (
          letterColourCopy[wordleGuessList[wordleGuessIndex][i]] !== "green" &&
          letterColourCopy[wordleGuessList[wordleGuessIndex][i]] !== "yellow"
        ) {
          letterColourCopy[wordleGuessList[wordleGuessIndex][i]] = "grey";
        }
      }

      setSquareColours([...defaultSquareColours]);
      setLetterColour(letterColourCopy);
    }
    // console.log(letterColourCopy);
    // console.log(letterColour);
    // console.log({ SquareColours });

    if (recurseCount % 2 === 0) {
      // console.log("recurse done + reset");
      recurseCount = 0;
      return;
    } else {
      recurseCount++;
      // console.log("2nd run");
      changeColour();
    }
  };

  return (
    <div className="App">
      <div id="topBar-header">
        <h1 className="Title">Wordle Clone</h1>
      </div>
      <WordleGrid
        wordleGuessList={wordleGuessList}
        SquareColours={SquareColours}
      />
      <Keyboard handleKeyPress={handleKeyPress} letterColour={letterColour} />
    </div>
  );
}

// Wordle Grid / Wordle Board ....................

const WordleGrid = ({ wordleGuessList, SquareColours }) => {
  return (
    <div className="Wordle-grid">
      {wordleGuessList.map((row, index) => {
        return (
          <WordleRows
            key={`row-${index}`}
            rowIndex={index}
            row={row}
            SquareColours={SquareColours}
          ></WordleRows>
        );
      })}
    </div>
  );
};

const WordleRows = ({ rowIndex, row, SquareColours }) => {
  return (
    <div className="Wordle-row">
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

// Onscreen Keyboard............................

const Keyboard = ({ handleKeyPress, letterColour }) => {
  return (
    <div className="Keyboard">
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
    <div className="Keyboard-row">
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

export default App;

/*
Use import/export syntax with react
User require/module.export syntax with express
// Default Export / Only exporting 1 thing
export default App;
import App from "./app.js"
module.exports = App
const App = require("./app.js")
---
// Module Export / Exporting multiple things
export App
import { App } from "./app.js"
module.exports = {
  App: App
}
const { App } = require("./app.js") 
*/
