import React, { useState, useEffect } from "react";
import { answerList, wordList } from "./wordleWords";
import { Keyboard } from "./Keyboard";
import { WordleGrid } from "./Board";
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

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [rowError, setRowError] = useState({ row: "", error: false });

  const dayIncrementor = () => {
    var startDate = new Date("6-11-2022");
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
      handleMessage("missing");
      setRowError({ row: wordleGuessIndex, error: true });
      return;
    } else if (!answerList.includes(guess) && !wordList.includes(guess)) {
      handleMessage("not-word");
      setRowError({ row: wordleGuessIndex, error: true });
      return;
    } else if (guess === wordleAnswer) {
      changeColour();
      setGameState("won");
      handleMessage("won");
    } else if (wordleGuessIndex >= 5) {
      changeColour();
      setGameState("lost");
      handleMessage("lost");
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
    if (key === "Backspace" || key === "←") {
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

  useEffect(
    function removeShake() {
      const rowShake = setTimeout(() => {
        setRowError({ ...rowError, error: false });
      }, 600);
      return () => clearTimeout(rowShake);
    },
    [rowError]
  );

  //Message pop-up
  const wonMessages = {
    0: "Genius",
    1: "Amazing",
    2: "Impressive",
    3: "Fantastic",
    4: "Great",
    5: "Phew",
  };

  const Message = ({ message }) => {
    const showMessage = () => {
      return message.isVisible ? "show" : "";
    };
    return <div className={`message ${showMessage()}`}>{message.message}</div>;
  };

  const [message, setMessage] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  const handleMessage = (type) => {
    if (type.includes("lost")) {
      setMessage({
        message: wordleAnswer.toUpperCase(),
        type: type,
        isVisible: true,
      });
    } else if (type.includes("won")) {
      setMessage({
        message: wonMessages[wordleGuessIndex],
        type: type,
        isVisible: true,
      });
    } else if (gameState === "playing") {
      if (type === "missing") {
        setMessage({
          message: "Not enough letters",
          type: type,
          isVisible: true,
        });
      } else if (type === "not-word") {
        setMessage({
          message: "Not in word list",
          type: type,
          isVisible: true,
        });
      }
    }
  };

  useEffect(() => {
    if (message.type === "missing" || message.type === "not-word") {
      window.errorOut = setTimeout(() => {
        setMessage({ ...message, isVisible: false });
      }, 900);
    } else if (message.type === "won" || message.type === "lost") {
      window.wonOut = setTimeout(() => {
        setMessage({ ...message, isVisible: false });
      }, 4000);
    }
    return () => {
      clearTimeout(window.errorOut);
      clearTimeout(window.wonOut);
    };
  }, [message]);

  const changeColour = () => {
    const guessLetterCount = {};
    const answerLetterCount = {};
    const currentGuessArray = wordleGuessList[wordleGuessIndex];
    const currentSquareColours = SquareColours;
    const currentLetterColourCopy = letterColour;

    //GreyCount Loop
    for (let i = 0; i < currentGuessArray.length; i++) {
      currentSquareColours[wordleGuessIndex][i] = "grey";

      if (
        currentLetterColourCopy[currentGuessArray[i]] !== "green" &&
        currentLetterColourCopy[currentGuessArray[i]] !== "yellow"
      ) {
        currentLetterColourCopy[currentGuessArray[i]] = "grey";
      }

      const wordleAnswerLower = wordleAnswer[i];
      if (!answerLetterCount.hasOwnProperty(wordleAnswerLower)) {
        answerLetterCount[wordleAnswerLower] = 1;
      } else {
        answerLetterCount[wordleAnswerLower]++;
      }
    }

    //GreenYellow Loop
    for (let i = 0; i < currentGuessArray.length; i++) {
      const letterLower = currentGuessArray[i].toLowerCase();
      if (!guessLetterCount.hasOwnProperty(letterLower)) {
        guessLetterCount[letterLower] = 1;
      }

      if (wordleAnswer[i] === letterLower) {
        currentSquareColours[wordleGuessIndex][i] = "green";
        currentLetterColourCopy[currentGuessArray[i]] = "green";

        guessLetterCount[letterLower]--;
      }

      if (
        answerLetterCount.hasOwnProperty(letterLower) &&
        guessLetterCount[letterLower] > 0
      ) {
        currentSquareColours[wordleGuessIndex][i] = "yellow";

        if (currentLetterColourCopy[currentGuessArray[i]] !== "green") {
          currentLetterColourCopy[currentGuessArray[i]] = "yellow";
        }

        guessLetterCount[letterLower]--;
      }
    }
    setSquareColours([...currentSquareColours]);
    setLetterColour(currentLetterColourCopy);
    // console.log(SquareColours);
    // console.log(currentLetterColourCopy);
  };

  return (
    <div className='App' data-darkTheme={darkTheme}>
      <header id='topBar-header'>
        <h1 className='Title'>Wordle</h1>
        <a className='smallTitle'>Clone</a>
        <div className='switch-container'>
          <label className='switch'>
            <input
              type='checkbox'
              defaultChecked={darkTheme}
              onChange={() => setDarkTheme(!darkTheme)}
            />
            <span className='slider'></span>
          </label>
          <span>☾</span>
        </div>
      </header>
      <Message message={message} />
      <WordleGrid
        wordleGuessList={wordleGuessList}
        SquareColours={SquareColours}
        rowError={rowError}
      />
      <Keyboard handleKeyPress={handleKeyPress} letterColour={letterColour} />
    </div>
  );
}

export default App;
