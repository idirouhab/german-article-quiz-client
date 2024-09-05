import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Quiz from './components/Quiz';
import Statistics from './components/Statistics';
import { AppBar, Tabs, Tab, Box } from '@mui/material';

function NavigationTabs() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Set the tab index based on the current path
    const [selectedTab, setSelectedTab] = useState(currentPath === '/statistics' ? 1 : 0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            navigate('/');
        } else if (newValue === 1) {
            navigate('/statistics');
        }
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                centered
                textColor="inherit"
                indicatorColor="secondary"
            >
                <Tab label="Quiz" />
                <Tab label="Statistics" />
            </Tabs>
        </AppBar>
    );
}

const App = () => {
    return (
        <Router>
            <NavigationTabs />
            <Box sx={{ mt: 3 }}>
                <Routes>
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/" element={<Quiz />} />
                </Routes>
            </Box>
        </Router>
    );
};

export default App;
