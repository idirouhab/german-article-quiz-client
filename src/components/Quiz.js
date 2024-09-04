import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Box,
    Alert
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';

const shuffleArray = (array) => {
    let shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const Quiz = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [answerStatus, setAnswerStatus] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/words-with-rates`)
            .then((response) => response.json())
            .then((data) => {
                const shuffledWords = shuffleArray(data);
                setWords(shuffledWords);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleAnswer = (selectedArticle) => {
        const correct = selectedArticle === words[currentWordIndex].article;
        if (correct) {
            setCorrectAnswers(correctAnswers + 1);
            setAnswerStatus('correct');
        } else {
            setAnswerStatus('incorrect');
        }
        setShowAnswer(true);
        setAnswered(true);

        // Update tracking information
        fetch(`${process.env.REACT_APP_API_URL}/update-tracking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: words[currentWordIndex].word,
                wasCorrect: correct,
            }),
        }).catch((error) => console.error('Error updating tracking:', error));
    };

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setAnswered(false);
        setCurrentWordIndex(currentWordIndex + 1);
        setAnswerStatus(null);
    };

    if (loading) {
        return (
            <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (currentWordIndex >= words.length) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Quiz Complete
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                            Your score: {correctAnswers} / {words.length}
                        </Typography>
                        <Box textAlign="center" sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const currentWord = words[currentWordIndex];

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        What is the article for:
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        sx={{ mb: 4, color: blue[700] }}
                    >
                        {currentWord.word} <Typography variant="body1" component="span" sx={{ color: grey[600] }}>
                        (Success Rate: {currentWord.success_rate.toFixed(2)}%)
                    </Typography>
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color={answered && currentWord.article === 'der' ? 'success' : 'primary'}
                                onClick={() => handleAnswer('der')}
                                disabled={answered}
                                sx={{ bgcolor: grey[800], '&:hover': { bgcolor: grey[600] } }}
                            >
                                der
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color={answered && currentWord.article === 'die' ? 'success' : 'primary'}
                                onClick={() => handleAnswer('die')}
                                disabled={answered}
                                sx={{ bgcolor: grey[800], '&:hover': { bgcolor: grey[600] } }}
                            >
                                die
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color={answered && currentWord.article === 'das' ? 'success' : 'primary'}
                                onClick={() => handleAnswer('das')}
                                disabled={answered}
                                sx={{ bgcolor: grey[800], '&:hover': { bgcolor: grey[600] } }}
                            >
                                das
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color={answered && currentWord.article === 'die' && currentWord.translation === 'plural' ? 'success' : 'primary'}
                                onClick={() => handleAnswer('die_plural')}
                                disabled={answered}
                                sx={{ bgcolor: grey[800], '&:hover': { bgcolor: grey[600] } }}
                            >
                                die (Plural)
                            </Button>
                        </Grid>
                    </Grid>

                    {showAnswer && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            {answerStatus === 'correct' && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Correct answer!
                                </Alert>
                            )}
                            {answerStatus === 'incorrect' && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    Incorrect! The correct answer was <strong>{currentWord.article}</strong>.
                                </Alert>
                            )}
                            <Typography variant="subtitle1">
                                {currentWord.word} means "{currentWord.translation}" in English.
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleNextQuestion}
                            >
                                Next Question
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default Quiz;
