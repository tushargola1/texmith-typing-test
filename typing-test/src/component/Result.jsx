import React from 'react';

const Result = ({
  wpm,
  accuracy,
  totalWords,
  inaccuracyPercentage,
  correctWordsCount,
  wrongWordsCount,
  startTest,
  stopTest,
  isTestRunning
}) => {
  return (
    <>
      <div className="container-fluid result-show">
        <div className="row gy-2 my-3">
          <div className="col-sm border border-primary col-md-6 p-2 ">
            Words per minute: {wpm}
          </div>
          <div className="col-sm border border-primary col-md-6 p-2">
            Correct Words: {correctWordsCount}
          </div>
          <div className="col-sm border border-primary col-md-6 p-2">
            Total Words: {totalWords}
          </div>
          <div className="col-sm border border-primary col-md-6 p-2">
            Accuracy: {accuracy}
          </div>
          <div className="col-sm border border-primary col-md-6 p-2">
            Wrong Words: {wrongWordsCount}
          </div>
          <div className="col-sm border border-primary  col-md-6 p-2">
            Inaccuracy: {inaccuracyPercentage}
          </div>
        </div>
        <div className="buttons">
          {!isTestRunning ? (
            <button id="start-test" onClick={startTest}>Start Test</button>
          ) : (
            <button id="stop-test" onClick={stopTest}>Submit</button>
          )}
        </div>
      </div>
    </>
  )
}

export default Result;

