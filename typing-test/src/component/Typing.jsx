import React, { useState, useEffect } from 'react';
import Result from './Result'; // Import the Result component

const Typing = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [time, setTime] = useState(0); // Start time from 0
  const [timer, setTimer] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showResult, setShowResult] = useState(false); // State to control result visibility

  // Paragraph text
  const paragraphText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  // Split paragraph into lines
  useEffect(() => {
    const paragraphLines = paragraphText.split('\n');
    setLines(paragraphLines);
  }, []);

  // Update Timer
  const updateTimer = () => {
    setTime(prevTime => prevTime + 1); // Increment time by 1 second
  };
  
  // Start Timer
  const startTest = () => {
    setMistakes(0);
    setUserInput('');
    setIsTestRunning(true);
    setTime(0); // Start timer from 0
    setShowResult(false); // Hide result when test starts
    setTimer(setInterval(updateTimer, 1000)); // Start timer
  };

  // Stop Test
  const stopTest = () => {
    clearInterval(timer);
    setIsTestRunning(false);
    setCurrentLine(0);
    setUserInput('');
    clearCharacterStyles(); // Clear character styles
    setShowResult(true); // Show result when test stops
  };

  // Function to clear character styles
  const clearCharacterStyles = () => {
    const quoteChars = document.querySelectorAll('.quote-chars');
    quoteChars.forEach(char => {
      char.classList.remove('success', 'fail');
    });
  };

  // Display Result

const displayResult = () => {
  // Calculate elapsed time in minutes
  const elapsedTimeInMinutes = time / 60;

  // Calculate words per minute (WPM)
  const wpm = userInput.trim().split(/\s+/).length / elapsedTimeInMinutes;

  // Calculate total number of words in the paragraph
  const totalWords = paragraphText.split(/\s+/).length;

  // Calculate accuracy percentage
  let accuracy = totalWords > 0 ? Math.round(((totalWords - mistakes) / totalWords) * 100) : 100;
  accuracy = Math.max(0, Math.min(100, accuracy)); // Ensure accuracy is between 0 and 100

  // Calculate inaccuracy percentage
  let inaccuracyPercentage = 100 - accuracy;
  inaccuracyPercentage = Math.max(0, Math.min(100, inaccuracyPercentage)); // Ensure inaccuracy is between 0 and 100

  // Find correct and wrong words
  const wordsTyped = userInput.split(/\s+/);
  const wordsInParagraph = paragraphText.split(/\s+/);
  let correctWordsCount = 0;
  let wrongWordsCount = 0;

  wordsTyped.forEach((word, index) => {
    if (word === wordsInParagraph[index]) {
      correctWordsCount++;
    } else {
      wrongWordsCount++;
    }
  });

  // Return the result object
  return {
    wpm: isNaN(wpm) ? 0 : wpm.toFixed(1), // Set WPM to 0 if it's NaN
    accuracy,
    totalWords,
    inaccuracyPercentage,
    correctWordsCount,
    wrongWordsCount,
  };
};



// Handle user input


const handleInputChange = (event) => {
  const userInputChars = event.target.value.split("");
  const quoteChars = lines[currentLine].split("");
  let currentWordIndex = 0;
  let currentWord = "";
  let wordError = false;

  quoteChars.forEach((char, index) => {
    if (char === userInputChars[index] && !wordError) {
      document.getElementById(`${currentLine}-${index}`).classList.add("success");
      currentWord += char;
    } else if (userInputChars[index] === undefined) {
      document.getElementById(`${currentLine}-${index}`).classList.remove("success", "fail");
    } else {
      if (!wordError) {
        setMistakes(prevMistakes => prevMistakes + 1);
        wordError = true;
      }
      document.getElementById(`${currentLine}-${index}`).classList.add("fail");
      currentWord += char;
    }

    if (char === " " || index === quoteChars.length - 1) {
      if (wordError) {
        markWordAsFail(currentWordIndex, currentWord.length);
      }
      currentWordIndex = index + 1;
      currentWord = "";
      wordError = false; // Reset wordError flag for the next word
    }
  });

  // Check for spacebar press
  if (event.key === " ") {
    setCurrentLine(prevLine => prevLine + 1); // Move to the next line
    setUserInput(''); // Clear user input
    clearCharacterStyles(); // Clear character styles
    return; // Exit the function to prevent further execution
  }

  // Check for extra spaces at the end of the input
  if (userInputChars.length > quoteChars.length) {
    setMistakes(prevMistakes => prevMistakes + 1);
  }

  setUserInput(event.target.value);
};


  const markWordAsFail = (startIndex, length) => {
    for (let i = startIndex; i < startIndex + length; i++) {
      document.getElementById(`${currentLine}-${i}`).classList.add("fail");
    }
  };
  return (
    <div className="container">
    
      {showResult ? (
        <Result {...displayResult()}
        startTest={startTest}
        stopTest={stopTest}
        isTestRunning={isTestRunning} />
      ) : (
        <>
          <div className="stats">
            <p>Time: <span id="timer">{time}s</span></p>
            <p>Mistakes: <span id="mistakes">{mistakes}</span></p>
          </div>

          <div className="main-section">
            <div id="quote" onMouseDown={() => false} onSelectStart={() => false}>
              {lines.map((line, lineIndex) => (
                <div key={lineIndex} className="quote-line">
                  {line.split("").map((char, charIndex) => (
                    <span key={`${lineIndex}-${charIndex}`} id={`${lineIndex}-${charIndex}`} className="quote-chars">{char}</span>
                  ))}
                </div>
              ))}
            </div>

            <textarea
              rows="3"
              id="quote-input"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type here ..."
              disabled={!isTestRunning}
            ></textarea>
          </div>

          <div className="buttons">
            {!isTestRunning ? (
              <button id="start-test" onClick={startTest}>Start Test</button>
            ) : (
              <button id="stop-test" onClick={stopTest}>Submit</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Typing;
