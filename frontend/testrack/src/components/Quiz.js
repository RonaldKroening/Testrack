import React, { useEffect, useState } from 'react';

const Quiz = ({ questions, handleExam }) => {
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [choices, setChoices] = useState(Array(questions.length).fill(null));
  const [currentChoice, setCurrentChoice] = useState(null);
  const [currentAllowedChoice, setCurrentAllowedChoice] = useState(1);

  // Update the current question and options when the index or questions change
  useEffect(() => {
    const questionObj = questions[index];
    setCurrentQuestion(questionObj.question);
    setOptions(questionObj.choices);
    setCurrentAllowedChoice(questionObj.answer.length);
    setCurrentChoice(choices[index] || (questionObj.answer.length > 1 ? [] : null));
  }, [questions, index]);

  // Update the current choice when the index changes
  useEffect(() => {
    setCurrentChoice(choices[index] || (currentAllowedChoice > 1 ? [] : null));
  }, [index, choices, currentAllowedChoice]);

  // Save the current choice before moving to the next or previous question
  const updateChoice = () => {
    const newChoices = [...choices];
    newChoices[index] = currentChoice;
    setChoices(newChoices);
  };

  // Navigate to the next or previous question
  const navigateQuestion = (step) => {
    updateChoice();
    const newIndex = index + step;
    if (newIndex >= 0 && newIndex < questions.length) {
      setIndex(newIndex);
    }
  };

  // Handle the completion of the quiz
  const completeQuiz = () => {
    updateChoice();

    const unanswered = choices
      .map((choice, idx) => {
        const isEmpty = choice === null || choice === undefined || 
                        (Array.isArray(choice) && choice.length === 0);
        return isEmpty ? idx + 1 : null;
      })
      .filter((idx) => idx !== null);

    if (unanswered.length > 0) {
      alert(`You have not answered the following questions: ${unanswered.join(", ")}`);
    } else {
      handleExam(choices); // Call the whenDone function with the final choices
    }
  };

  // Handle changes to the selected options
  const handleOptionChange = (optionKey) => {
    if (currentAllowedChoice === 1) {
      setCurrentChoice(optionKey); // Single choice
      choices[index] = optionKey;
    } else {
      let newChoices = Array.isArray(currentChoice) ? [...currentChoice] : [];
      if (newChoices.includes(optionKey)) {
        newChoices = newChoices.filter(item => item !== optionKey); // Deselect
      } else if (newChoices.length < currentAllowedChoice) {
        newChoices.push(optionKey); // Selec
      }
      setCurrentChoice(newChoices);
      choices[index] = newChoices;
    }
  };

  // Check if an option is selected
  const isOptionSelected = (optionKey) => {
    if (currentAllowedChoice === 1) {
      return currentChoice === optionKey;
    } else {
      return Array.isArray(currentChoice) && currentChoice.includes(optionKey);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="space-y-4">
        <h1 className='"text-2xl font-bold text-gray-800"'>Question {index+1}</h1>
        <h2 className="text-2xl font-bold text-gray-800">{currentQuestion}</h2>
        <div className="space-y-2">
          {options && Object.keys(options).length > 0 ? (
            Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type={currentAllowedChoice === 1 ? "radio" : "checkbox"}
                    name="option"
                    value={key}
                    checked={isOptionSelected(key)}
                    onChange={() => handleOptionChange(key)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{value}</span>
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No options available.</p>
          )}
        </div>
        {currentAllowedChoice > 1 && (
          <p className="text-sm text-gray-600">
            Please select up to {currentAllowedChoice} options.
            {Array.isArray(currentChoice) && (
              <span> ({currentChoice.length}/{currentAllowedChoice} selected)</span>
            )}
          </p>
        )}
        <div className="flex gap-4 mt-8">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={() => navigateQuestion(-1)}
            disabled={index === 0}
          >
            Previous
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={() => navigateQuestion(1)}
            disabled={index === questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      <button
        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        onClick={completeQuiz}
      >
        Finish Exam
      </button>
    </div>
  );
};

export default Quiz;