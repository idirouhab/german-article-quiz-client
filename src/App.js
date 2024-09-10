import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import Quiz from './components/Quiz';
import Statistics from './components/Statistics';
import Vocabulary from './components/Vocabulary';
import {AppBar, Tabs, Tab, Box} from '@mui/material';

function NavigationTabs() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Set the tab index based on the current path
    const [selectedTab, setSelectedTab] = useState(() => {

        let ret = 0;
        if (currentPath === '/statistics') {
            ret = 1;
        } else if (currentPath === '/vocabulary') {
            ret = 2;
        }
        console.log(currentPath);
        console.log(ret);
        return ret
    });

    const handleTabChange = (event, newValue) => {
        console.log(newValue);

        setSelectedTab(newValue);
        if (newValue === 0) {
            navigate('/');
        } else if (newValue === 1) {
            navigate('/statistics');
        } else if (newValue === 2) {
            navigate('/vocabulary');
        }
    };

    return (
        <AppBar position="static" sx={{mb: 4}}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                centered
                textColor="inherit"
                indicatorColor="secondary"
            >
                <Tab label="Quiz"/>
                <Tab label="Statistics"/>
                <Tab label="Vocabulary"/>
            </Tabs>
        </AppBar>
    );
}

const App = () => {
    return (
        <Router>
            <NavigationTabs/>
            <Box sx={{mt: 3}}>
                <Routes>
                    <Route path="/vocabulary" element={<Vocabulary/>}/>
                    <Route path="/statistics" element={<Statistics/>}/>
                    <Route path="/" element={<Quiz/>}/>
                </Routes>
            </Box>
        </Router>
    );
};

export default App;
