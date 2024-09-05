import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Statistics from './components/Statistics';
import Quiz from './components/Quiz';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/" element={<Quiz />} />
            </Routes>
        </Router>
    );
};

export default App;
