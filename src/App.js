import { useState } from 'react';
import './App.css';

class Letter {
  constructor(name, status) {
    this.name = name;
    this.status = status;
  }
}


class Word {
  constructor(letters) {
    this.letters = letters;
  }
}


class GameField {
  constructor(words) {
    this.words = words;
  }
}

const words = new Array(6).fill(null).map(() => {
  const letters = new Array(5).fill(null).map(() => new Letter("a", "correct"));
  return new Word(letters);
});


const initialGameField = new GameField(words)

const keyBoardLetters = [["й","ц","у","к","е","н","г","ш","щ","з","х","ъ"],
                  ["ф","ы","в","а","п","р","о","л","д","ж","э"],
                  ["<","я","ч","с","м","и","т","ь","б","ю","Enter"]]

const initialKeyboard = []
for (const row of keyBoardLetters){
  const newRow = []
  for (const letter of row) {
    newRow.push(new Letter(letter, ""))
  }
  initialKeyboard.push(newRow)
}


console.log(initialGameField)

function App() {
  const [gameField, setgameField] = useState(initialGameField);
  const [keyboard, setKeyboard] = useState(initialKeyboard);

  return (
    <>
      <div className="words-field">
        {gameField.words.map((word, wordIndex) => (
          word.letters.map((letter, letterIndex) => {
            
            return <div className={`cell ${letter.status === "correct" ? "correct" : ""} ${letter.status === "incorrect" ? "incorrect" : ""} ${letter.status === "exist" ? "exist" : ""} `} key={letterIndex}>{letter.name}</div>;
          })
        ))}
      </div>

      {keyboard.map((row, rowKey) => (
        <div className="keyboard" key={rowKey}>
          {row.map((letter, letterKey) => (
            letter.name === "enter" || letter.name === "<" ? (
              <div className="key key-wide" key={letterKey}>{letter.name}</div>
            ) : (
              <div className="key" key={letterKey}>{letter.name}</div>
            )
          ))}
        </div>
      ))}

    </>

  );
}

export default App;
