import React, {useState, useEffect, useCallback} from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Box,
    Alert,
    TextField,
    LinearProgress
} from '@mui/material';

const Quiz = () => {
    const [playerName, setPlayerName] = useState('');
    const [numberOfWords, setNumberOfWords] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerStatus, setAnswerStatus] = useState(null);
    const [points, setPoints] = useState(0);
    const [correctStreak, setCorrectStreak] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Fetch words when the game starts
    useEffect(() => {
        if (gameStarted) {
            fetch(`${process.env.REACT_APP_API_URL}/words/words-with-rates`)
                .then((response) => response.json())
                .then((data) => {
                    let randomData = shuffleArray(data)
                    setWords(randomData.slice(0, numberOfWords));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [gameStarted, numberOfWords]); // Added numberOfWords as a dependency

    const handleStartGame = () => {
        if (playerName.trim()) {
            setGameStarted(true);
        } else {
            alert("Please enter your name to start the game!");
        }
    };

    const handleAnswer = (selectedArticle) => {
        const correct = selectedArticle === words[currentWordIndex].article;
        if (correct) {
            setPoints(points + 5);
            setCorrectStreak(correctStreak + 1);
            if ((correctStreak + 1) % 5 === 0) {
                setPoints(points + 10); // Bonus points
            }
            setAnswerStatus('correct');
        } else {
            setPoints(points - 5);
            setCorrectStreak(0);
            setAnswerStatus('incorrect');
        }
        setShowAnswer(true);
        setAnswered(true);

        // Optionally update tracking information
        fetch(`${process.env.REACT_APP_API_URL}/words/update-tracking`, {
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

    const handleSubmitResults = useCallback(() => {
        if (quizCompleted) {
            fetch(`${process.env.REACT_APP_API_URL}/results/submit-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerName,
                    score: points,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Result submitted successfully:', data);
                })
                .catch((error) => {
                    console.error('Error submitting result:', error);
                });
        }

    }, [playerName, points, quizCompleted]); // Memoized handleSubmitResults with dependencies

    useEffect(() => {
        if (playerName && currentWordIndex >= words.length && !quizCompleted) {
            handleSubmitResults(); // Send results to backend
            setQuizCompleted(true);
        }
    }, [handleSubmitResults, playerName, currentWordIndex, words.length, quizCompleted]);

    if (!gameStarted) {
        return (
            <Container maxWidth="sm" sx={{mt: 5}}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Welcome to the Quiz Game!
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter your name"
                            variant="outlined"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            sx={{mb: 3}}
                        />
                        <TextField
                            fullWidth
                            label="Number of words"
                            variant="outlined"
                            value={numberOfWords}
                            onChange={(e) => setNumberOfWords(e.target.value)}
                            sx={{mb: 3}}
                        />
                        <Box textAlign="center">
                            <Button variant="contained" color="primary" onClick={handleStartGame}>
                                Start Game
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (currentWordIndex >= words.length) {
        return (
            <Container maxWidth="sm" sx={{mt: 5}}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Quiz Complete
                        </Typography>
                        <Typography variant="h6" align="center" sx={{mb: 2}}>
                            Well done, {playerName}! Your final score is: {points}
                        </Typography>
                        <Box textAlign="center" sx={{mt: 2}}>
                            <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
                                Play Again
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const currentWord = words[currentWordIndex];
    const progressPercentage = ((currentWordIndex + 1) / numberOfWords) * 100; // Calculate the progress

    return (
        <Container maxWidth="sm" sx={{mt: 5}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        What is the article for:
                    </Typography>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{mb: 4}}
                    >
                        {currentWord.word} <Typography variant="body1" component="span">
                        (Success Rate: {currentWord.success_rate.toFixed(2)}%)
                    </Typography>
                    </Typography>

                    {/* Progress Bar */}
                    <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        sx={{mb: 2}}
                    />
                    <Typography variant="body2" align="center" sx={{mb: 4}}>
                        Question {currentWordIndex + 1} of {numberOfWords}
                    </Typography>

                    <Typography variant="h6" align="center" gutterBottom sx={{mb: 2}}>
                        Points: {points}
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color={answered && currentWord.article === 'der' ? 'success' : 'primary'}
                                onClick={() => handleAnswer('der')}
                                disabled={answered}
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
                            >
                                die (Plural)
                            </Button>
                        </Grid>
                    </Grid>

                    {showAnswer && (
                        <Box sx={{mt: 4, textAlign: 'center'}}>
                            {answerStatus === 'correct' && (
                                <Alert severity="success" sx={{mb: 2}}>
                                    Correct answer!
                                </Alert>
                            )}
                            {answerStatus === 'incorrect' && (
                                <Alert severity="error" sx={{mb: 2}}>
                                    Incorrect! The correct answer was <strong>{currentWord.article}</strong>.
                                </Alert>
                            )}
                            <Typography variant="subtitle1">
                                {currentWord.word} means "{currentWord.translation}" in English.
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{mt: 2}}
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
