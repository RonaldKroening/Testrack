import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TableLoader from './TableLoader';


const Score = ({ results, questions, username, exam_id }) => {
    const [rows, setRows] = useState([]);
    const [score, setScore] = useState(0);
    const [wrong_ans, setWrong] = useState([]);

    const columns = ['Question', 'Answer', 'Correct Answer'];

    // Use refs to store previous values of results and questions
    const prevResultsRef = useRef();
    const prevQuestionsRef = useRef();

    function compare(answer, correct) {
        if (answer.length !== correct.length) {
            return 0;
        } else {
            while (answer.length > 0) {
                let rem = answer.pop();
                if (correct.indexOf(rem) === -1) {
                    return 0;
                }
            }
            return 1;
        }
    }

    function add_score(score, username) {
        axios.post('http://localhost:8000/{username}/{exam_id}/{score}')
            .then((response) => {
                if (response.data) {
                    console.log(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        // Check if results or questions have changed
        if (results !== prevResultsRef.current || questions !== prevQuestionsRef.current) {
            var wrong_arr = [];
            let new_rows = [];
            let new_score = 0;

            for (let result in results) {
                let current_question = questions[result];
                new_rows.push({
                    'Question': current_question.question,
                    'Answer': results[result],
                    'Correct Answer': current_question.answer
                });
                let truth = compare([...results[result]], [...current_question.answer]);
                if(truth == 0){
                    wrong_arr.push(result+1);
                }
                new_score += truth;
            }

            let pct = (new_score / results.length) * 100;
            pct = pct.toFixed(2);

            setScore(pct);
            setRows(new_rows);
            add_score(pct, username);
            setWrong(wrong_arr);
            // Update the refs with the current values
            prevResultsRef.current = results;
            prevQuestionsRef.current = questions;
        }
    }, [results, questions]);
    function emptyFunc() {}
    return (
        <div className="p-6">
            <h1 className='font-bold'>Results</h1>
            <h2 className='text-2xl p-6'>Your score: {score}%</h2>
            <p className='text-1.25xl p-6'>Incorrect Answers: {" ".join(wrong_ans)}</p>
            <TableLoader columns={columns} rows={rows} onRowClick={emptyFunc} />
        </div>
    );
};

export default Score;