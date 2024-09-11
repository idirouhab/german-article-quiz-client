// App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import Articles from './components/Articles';
import Statistics from './components/Statistics';
import Vocabulary from './components/Vocabulary';
import HomePage from './components/HomePage';  // Import the new HomePage component
import {AppBar, Tabs, Tab, Box} from '@mui/material';

function NavigationTabs() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Set the tab index based on the current path
    const [selectedTab, setSelectedTab] = React.useState(() => {
        let ret = 0;
        if (currentPath === '/articles') {
            ret = 1;
        } else if (currentPath === '/vocabulary') {
            ret = 2;
        } else if (currentPath === '/statistics') {
            ret = 3;
        }
        return ret;
    });

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            navigate('/');
        } else if (newValue === 1) {
            navigate('/articles');
        } else if (newValue === 2) {
            navigate('/vocabulary');
        } else if (newValue === 3) {
            navigate('/statistics');
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
                <Tab label="Home"/>
                <Tab label="Articles"/>
                <Tab label="Vocabulary"/>
                <Tab label="Statistics"/>
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
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/articles" element={<Articles/>}/>
                    <Route path="/vocabulary" element={<Vocabulary/>}/>
                    <Route path="/statistics" element={<Statistics/>}/>
                </Routes>
            </Box>
        </Router>
    );
};

export default App;
