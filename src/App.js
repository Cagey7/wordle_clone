import { useState, useEffect } from 'react';
import { words } from './words.js';
import './App.css';


function checkWords(userWord, hiddenWord) {
  const wordInfo = [];
  for (let i = 0; i < userWord.length; i++) {
    if (userWord[i] === hiddenWord[i]) {
      wordInfo.push({ name: userWord[i], status: "correct"});
    } else {
      wordInfo.push({ name: userWord[i], status: "incorrect"});
    }
  }

  for (const letter of hiddenWord) {
    let letterHiddenCounter = hiddenWord.split(letter).length - 1;
    let letterUserCounter = wordInfo.filter(wiLetter => wiLetter.name === letter).length;
    let paintedCounter = wordInfo.filter(wiLetter => 
      wiLetter.name === letter && (wiLetter.status === "correct" || wiLetter.status === "correct")
    ).length;

    if (letterUserCounter > letterHiddenCounter) letterUserCounter = letterHiddenCounter;
    let timesToPaint = letterUserCounter - paintedCounter;

    if (letterUserCounter > 0 && (letterUserCounter > paintedCounter)) {
      for (let wordInfoLetter of wordInfo) {
        if (wordInfoLetter.name === letter)
        if (wordInfoLetter.status === "incorrect" && wordInfoLetter.status !== "correct" && wordInfoLetter.name === letter) {
          wordInfoLetter.status = "exist";
          timesToPaint -= 1;
        }
        if (timesToPaint === 0) break;
      }
    }
  }
  return wordInfo;
}

function paintKeyboard(word, keyboard) {
  const newLetters = [];

  // Подготовка букв для покраски
  for (const letter of word) {
    if (!newLetters.some((newLetter) => newLetter.name === letter.name)) {
      newLetters.push(letter);
    } else {
      const index = newLetters.findIndex((newLetter) => newLetter.name === letter.name);
      if ((newLetters[index].status === "incorrect" && (letter.status === "exist" || letter.status === "correct")) ||
          (newLetters[index].status === "exist" && letter.status === "correct")) {
        newLetters.splice(index, 1); 
        newLetters.push(letter);
      }
    }
  }

  // Покраска клавиатуры
  for (const letter of newLetters) {
    for (const row of keyboard) {
      row.forEach(rowLetter => {
        if (rowLetter.name === letter.name) {
          if (rowLetter.status === "") {
            rowLetter.status = letter.status;
          } else if ((rowLetter.status === "incorrect" && (letter.status === "exist" || letter.status === "correct")) ||
              (rowLetter.status === "exist" && letter.status === "correct")) {
            rowLetter.status = letter.status;
          }
        }
      });
    }
  }
  return keyboard;
}


function getStatusClass(letter) {
  let statusClass = "";
  if (letter.status === "correct") {
    statusClass = "correct";
  } else if (letter.status === "incorrect") {
    statusClass = "incorrect";
  } else if (letter.status === "exist") {
    statusClass = "exist";
  }
  return statusClass;
}


function App() {
  const [gameField, setGameField] = useState([]);
  const [keyboard, setKeyboard] = useState([]);
  const [hiddenWord, setHiddenWord] = useState("");
  const [win, setWin] = useState(false);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    
    if (win) {
      localStorage.clear();
    }

    if (localStorage.getItem("gameField") && localStorage.getItem("keyboard") && localStorage.getItem("hiddenWord")) {
      setGameField(JSON.parse(localStorage.getItem("gameField")));
      setKeyboard(JSON.parse(localStorage.getItem("keyboard")));
      setHiddenWord(localStorage.getItem("hiddenWord"));
    } else {
      const keyBoardLetters = [
        ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
        ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
        ["<", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "Enter"]
      ];
  
      const initGameField = Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => ({ name: "", status: "" }))
      );
      const initKeyboard = keyBoardLetters.map(row =>
        row.map(letter => ({ name: letter, status: "" }))
      );
  
      const initHiddenWord = words[Math.floor(Math.random() * words.length)];
  
      localStorage.setItem("gameField", JSON.stringify(initGameField));
      localStorage.setItem("keyboard", JSON.stringify(initKeyboard));
      localStorage.setItem("hiddenWord", initHiddenWord);
      setGameField(initGameField);
      setKeyboard(initKeyboard);
      setHiddenWord(initHiddenWord);
    }
  }, [trigger]);
  

  function handleKeyboardClick(clickedLetter) {
    let changed = false;
  
    if (win) return;  

    // Проврека когда можно добавлять новую букву
    for (const word of gameField) {
      if (word.at(-1).name !== "" && word.at(-1).status === "") {
        return
      }
    }

    // Добавление новой буквы
    const newGameField = gameField.map((word) => (
      word.map((letter) => {
        if (!changed && letter.name === "") {
          changed = true;
          return { name: clickedLetter.name, status: "" };
        }
        return letter;
      })
    ))

    localStorage.setItem("gameField", JSON.stringify(newGameField));
    setGameField(newGameField);
  }

  function deleteLastLetter() {
    let changed = false;

    // Проверка, чтобы не удалять окрашенные буквы
    const letterToDelete = gameField.some(word =>
      word.some(letter => letter.name !== "" && letter.status === "")
    );
    if (!letterToDelete) return;

    // Удаление буквы
    const newGameField = gameField.toReversed().map((word) => 
      word.toReversed().map((letter) => {
        if (!changed && letter.name !== "") {
          changed = true;
          return { name: "", status: "" };
        }
        return letter;
      })
    ).toReversed().map((row) => row.toReversed());
    
    localStorage.setItem("gameField", JSON.stringify(newGameField));
    setGameField(newGameField);
  }
  
  function confirmWord() {
    let userWord = "";

    // Обработка слова пользователя
    for (const word of gameField.toReversed()) {
      if (word[0].name !== "") {
        for (const letter of word) {
          userWord += `${letter.name}`;
        }
        break
      }
    }
    // Проверка длины слова
    if (userWord.length >= 5) {
      // Проверка слова на существование
      if (words.includes(userWord)) {
        console.log("СЛОВО СУЩЕВСТВУЕТ");
        // Закрашивание букв игрового поля
        const newGameField = gameField.map((word) => {
          // Проверка новое ли слово
          if ((word.at(-1).name === "" && word.at(-1).status === "") || 
              (word.at(-1).name !== "" && word.at(-1).status !== "")) {
            return word;
          } else {
            localStorage.setItem("keyboard", JSON.stringify(paintKeyboard(checkWords(userWord, hiddenWord), keyboard)));
            setKeyboard(paintKeyboard(checkWords(userWord, hiddenWord), keyboard))
            return checkWords(userWord, hiddenWord);
          }
        })
        if (userWord === hiddenWord) {
          setWin(true);
        }
        localStorage.setItem("gameField", JSON.stringify(newGameField));
        setGameField(newGameField);
      } else {
        console.log("СЛОВО НЕ СУЩЕВСТВУЕТ")
      }
    } else {
      console.log(`Слово ${userWord} не готово`);
    }
  }

  function startNewGame() {
    localStorage.clear();
    setTrigger(prev => !prev);
  }

  return (
    <>
      <br></br>
      <div className="words-field">
        {gameField.map((word, wordIndex) => (
          word.map((letter, letterIndex) => {
            return <div className={`cell ${getStatusClass(letter)} `} 
                        key={letterIndex}>{letter.name}</div>;
          })
        ))}
      </div>
      <br></br>
      {keyboard.map((row, rowKey) => (
        <div className="keyboard" key={rowKey}>
          {row.map((letter, letterKey) => {
            if (letter.name === "Enter") {
              return (
                <div className={`key key-wide ${getStatusClass(letter)}`} key={letterKey} onClick={() => confirmWord()}>
                  {letter.name}
                </div>
              );
            } else if (letter.name === "<") {
              return (
                <div className={`key key-wide ${getStatusClass(letter)}`} key={letterKey} onClick={() => deleteLastLetter()}>
                  {letter.name}
                </div>
              );
            } else {
              return (
                <div className={`key ${getStatusClass(letter)}`} key={letterKey} onClick={() => handleKeyboardClick(letter)}>
                  {letter.name}
                </div>
              );
            }
          })}
        </div>
      ))}
      <button onClick={() => startNewGame()}>Новая игра</button>
    </>
  );
}

export default App;
