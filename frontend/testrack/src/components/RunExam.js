import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TableLoader from './TableLoader';
import Score from './Score';
import Quiz from './Quiz';
const RunExam = ({username}) => {
    const [data, setData] = useState({});
    const [examId, setId] = useState(0);
    const [name, setName] = useState("");
    const [examStarted, setStarted] = useState(false);
    const [finished_exam, setFinished] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [examType, setType] = useState("");
    const navigate = useNavigate();
    const { id} = useParams();
    
    const [error, setError] = useState(null);
    const [exam_results, setResults] = useState([]);

    const goBack = () => {
        navigate(-1); 
      };


      useEffect(() => {
          console.log(`using id ${id} and username ${username || 'Guest'}`); // Default to 'Guest' if username is undefined
          if (id) {
              axios.get(`http://localhost:8000/get_test_data/${id}`)
                  .then((response) => {
                      if (response.data) {
                          console.log("Exam data fetched successfully:", response.data);
                          let res = response.data;
                          setQuestions(res['data']);
                          var name = res['info']['name'];
                          while (name.includes("_")) {
                              name = name.replace('_', " ");
                          }
                          name = name.replace(".json", "");
                          setName(name);
                          setType(res['info']['exam_type']);
                          setError(null);
                      } else {
                          console.error("No data received from the server.");
                          setError("No data received from the server.");
                      }
                  })
                  .catch((error) => {
                      console.error("Failed to fetch exam data:", error);
                      setError("Failed to fetch exam data.");
                  });
          } else {
              console.error("No ID found in URL parameters.");
              setError("No ID found in URL parameters.");
          }
      }, [id, username]);


    function whenStart(){
        setStarted(true);
    }

    function whenDone(results){
        setStarted(false);
        setFinished(true);
        setResults(results);
    }

    return (
        <div className="p-6" id="run_ex">
            <button className="mt-16 bg-gray-800 text-white border-2 border-white p-2 rounded-lg text-sm" onClick={goBack}>Go Back</button>
            <h1 className="text-2xl font-bold mb-4">{name} for Exam Series: {examType}. Total of {questions.length} Questions.</h1>
            {examStarted === false && <button className="mt-16 bg-gray-800 text-white border-2 border-white p-2 rounded-lg text-sm" onClick={whenStart}>Start Exam</button>}
            {examStarted && <Quiz questions={questions} handleExam={whenDone} />}
            {finished_exam && examStarted === false &&(
            <div>
                <Score results={exam_results} questions={questions} exam_id={examId} username={username}/>
            </div>
            )}
        </div>
    );
};

export default RunExam; // Prevent unnecessary re-renders