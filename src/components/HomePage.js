// HomePage.js
import React from 'react';
import { Container, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Welcome to the Quiz Games!
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2 }}
                            onClick={() => handleNavigate('/articles')}
                        >
                            Play Articles Game
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleNavigate('/vocabulary')}
                        >
                            Play Vocabulary Game
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default HomePage;
