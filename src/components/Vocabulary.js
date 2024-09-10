import React, {useState, useEffect} from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
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
    const [userAnswer, setUserAnswer] = useState('');

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
            fetch(`${process.env.REACT_APP_API_URL}/vocabulary`)
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
    }, [gameStarted, numberOfWords]);

    const handleStartGame = () => {
        if (playerName.trim()) {
            setGameStarted(true);
        } else {
            alert("Please enter your name to start the game!");
        }
    };

    const handleAnswer = () => {
        const correct = userAnswer.trim().toLowerCase() === words[currentWordIndex].translation.toLowerCase();
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
    };

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setAnswered(false);
        setCurrentWordIndex(currentWordIndex + 1);
        setAnswerStatus(null);
        setUserAnswer(''); // Reset the input field
    };


    useEffect(() => {
        if (playerName && currentWordIndex >= words.length && !quizCompleted) {
            setQuizCompleted(true);
        }
    }, [playerName, currentWordIndex, words.length, quizCompleted]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !answered) {
            handleAnswer();
        }
    };

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

                    <TextField
                        fullWidth
                        label="Enter the article"
                        variant="outlined"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={answered}
                        onKeyDown={handleKeyDown}

                    />

                    <Box textAlign="center" sx={{mt: 2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAnswer}
                            disabled={answered}
                        >
                            Submit Answer
                        </Button>
                    </Box>

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
                                handleKeyDown={handleNextQuestion}
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
