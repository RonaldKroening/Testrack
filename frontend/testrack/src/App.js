import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import PracticeExams from './components/PracticeExams';
import RunExam from './components/RunExam';
import React, { useState } from 'react';
import LogInForm from './components/LogInForm';

function App() {
    const [user, setUser] = useState("");
    const [userData, setUserData] = useState({});
    const [loggingIn, setLoggingIn] = useState(false);

    const handleSign = (data) => {
        setUser(data.name);
        setUserData(data);
        setLoggingIn(false);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                {/* Header */}
                <header className="w-full max-w-4xl text-center mb-8">
                    {user !== "" ? (
                        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user}!</h1>
                    ) : (
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome! Log in or sign up to save data.
                        </h1>
                    )}
                    {!user && (
                        <button
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            onClick={() => setLoggingIn(!loggingIn)}
                        >
                            Log In
                        </button>
                    )}
                </header>

                {/* Login Form */}
                {loggingIn && (
                    <LogInForm
                        handleSignIn={handleSign}
                        onClose={() => setLoggingIn(false)}
                    />
                )}

                {/* Navigation */}
                <nav className="w-full max-w-4xl flex justify-center space-x-4 mb-8">
                    <Link
                        to="/PracticeExams"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        View Exams
                    </Link>
                    <Link
                        to="/Paths"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        See Exam Paths
                    </Link>
                    
                    <Link
                        to="/history"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Review Your History
                    </Link>
                </nav>

                {/* Main Content */}
                <main className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                    <Routes>
                        <Route path="/PracticeExams" element={<PracticeExams />} />
                        <Route path="/run-exam/:id/" element={<RunExam username={user} />} />
                        <Route path="/take-test" element={<div>Take a Test Page</div>} />
                        <Route path="/history" element={<div>Review Your History Page</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;