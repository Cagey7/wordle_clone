import { useState } from 'react';
import './App.css';


function getStatusClass(letter) {
  let statusClass = '';
  if (letter.status === "correct") {
    statusClass = "correct";
  } else if (letter.status === "incorrect") {
    statusClass = "incorrect";
  } else if (letter.status === "exist") {
    statusClass = "exist";
  }
  return statusClass;
}


const keyBoardLetters = [["й","ц","у","к","е","н","г","ш","щ","з","х","ъ"],
                  ["ф","ы","в","а","п","р","о","л","д","ж","э"],
                  ["<","я","ч","с","м","и","т","ь","б","ю","Enter"]]


let initGameField = Array.from({ length: 5 }, () =>
  Array.from({ length: 6 }, () => ({ name: "", status: "" }))
);


const initialKeyboard = keyBoardLetters.map(row => 
  row.map(letter => ({ name: letter, status: "" }))
);


function App() {
  const [gameField, setGameField] = useState(initGameField);
  const [keyboard, setKeyboard] = useState(initialKeyboard);

  function handleKeyboardClick(clickedLetter) {
    let changed = false;

    for (const word of gameField) {
      if (word.at(-2).name !== "") {
        return
      }
    }

    const newGameField = gameField.map((word) => (
      word.map((letter) => {
        if (!changed && letter.name === "") {
          changed = true;
          return { name: clickedLetter.name, status: "" };
        }
        return letter;
      })
    ))

    setGameField(newGameField);
  }

  function deleteLastLetter() {
    return
  }

  return (
    <>
      <div className="words-field">
        {gameField.map((word, wordIndex) => (
          word.map((letter, letterIndex) => {
            return <div className={`cell ${getStatusClass(letter)} `} 
                        key={letterIndex}>{letter.name}</div>;
          })
        ))}
      </div>

      {keyboard.map((row, rowKey) => (
        <div className="keyboard" key={rowKey}>
          {row.map((letter, letterKey) => {
            if (letter.name === "enter") {
              return (
                <div className={`key key-wide ${getStatusClass(letter)}`} key={letterKey}>
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

    </>

  );
}

export default App;
