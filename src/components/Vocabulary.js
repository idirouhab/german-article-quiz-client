import React, {useState, useEffect, useCallback, useRef} from 'react';
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
    LinearProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel, FormControlLabel, Switch
} from '@mui/material';

const Quiz = () => {
    const [playerName, setPlayerName] = useState('');
    const [numberOfWords, setNumberOfWords] = useState(5);
    const [difficulty, setDifficulty] = useState(1); // Added difficulty state
    const [gameStarted, setGameStarted] = useState(false);
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerStatus, setAnswerStatus] = useState(null);
    const [points, setPoints] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [readyToMove, setReadyToMove] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const answerInputRef = useRef(null);

    useEffect(() => {
        const savedName = localStorage.getItem('playerName');
        if (savedName) {
            setPlayerName(savedName);
        }
    }, []);

    useEffect(() => {
        if (playerName) {
            localStorage.setItem('playerName', playerName);
        }
    }, [playerName]);

    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

    useEffect(() => {
        if (gameStarted) {
            setLoading(true);
            fetch(`${process.env.REACT_APP_API_URL}/vocabulary?difficulty=${difficulty}`)
                .then(response => response.json())
                .then(data => {
                    setWords(shuffleArray(data).slice(0, numberOfWords));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [gameStarted, numberOfWords, difficulty]); // Added difficulty as a dependency

    useEffect(() => {
        if (quizCompleted) {
            fetch(`${process.env.REACT_APP_API_URL}/scores/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player: playerName,
                    game: 'vocabulary',
                    score: ((points * 10) / numberOfWords).toFixed(2)
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
    }, [quizCompleted, playerName, points, numberOfWords]); // Added difficulty as a dependency

    const handleStartGame = useCallback(() => {
        if (playerName.trim()) {
            setGameStarted(true);
            localStorage.setItem('playerName', playerName.trim());
            setTimeout(() => {
                answerInputRef.current?.focus();
            }, 100);
        } else {
            alert("Please enter your name to start the game!");
        }
    }, [playerName]);

    const handleAnswer = useCallback(() => {
        const correct = userAnswer.trim().toLowerCase() === words[currentWordIndex].word.toLowerCase();
        setPoints(prevPoints => (correct ? prevPoints + 1 : prevPoints));
        setAnswerStatus(correct ? 'correct' : 'incorrect');
        setShowAnswer(true);
        setAnswered(true);
    }, [userAnswer, currentWordIndex, words]);

    const handleNextQuestion = useCallback(() => {
        if (currentWordIndex + 1 < numberOfWords) {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
            setAnswered(false);
            setShowAnswer(false);
            setAnswerStatus(null);
            setUserAnswer('');
            setTimeout(() => {
                answerInputRef.current?.focus();
            }, 100);
        } else {
            setQuizCompleted(true);
        }
    }, [currentWordIndex, numberOfWords]);


    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Enter') {
                if (!gameStarted && playerName.trim()) {
                    handleStartGame();
                } else if (gameStarted && !answered) {
                    handleAnswer();
                    setReadyToMove(true);
                } else if (gameStarted && answered && showAnswer && readyToMove) {
                    handleNextQuestion();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [handleAnswer, handleStartGame, handleNextQuestion, answered, gameStarted, showAnswer, playerName, readyToMove]);

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
                            type="number"
                            value={numberOfWords}
                            onChange={(e) => setNumberOfWords(Number(e.target.value))}
                            sx={{mb: 3}}
                        />
                        <FormControl fullWidth sx={{mb: 3}}>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                value={difficulty}
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                                label="Difficulty"
                            >
                                {[1, 2, 3, 4, 5].map(level => (
                                    <MenuItem key={level} value={level}>
                                        Difficulty {level}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showHint}
                                    onChange={(e) => setShowHint(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Show hint"
                            sx={{mb: 2}}
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

    if (quizCompleted) {
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
    const progressPercentage = ((currentWordIndex + 1) / numberOfWords) * 100;

    const showFirstLetters = (word) => {
        const arrayWord = word.split(" ");
        const articles = ['der', 'die', 'das'];
        if (articles.includes(arrayWord[0])) {
            return arrayWord[1].substring(0, 3)
        }
        return word.substring(0, 3);
    }

    return (
        <Container maxWidth="sm" sx={{mt: 5}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        What is the article for:
                    </Typography>
                    <Typography variant="h4" align="center" sx={{mb: 4}}>
                        {currentWord.translation}
                    </Typography>

                    {showHint ? (<Typography variant="h6" align="center"
                                             sx={{mb: 1}}>{showFirstLetters(currentWord.word)}</Typography>) : ("")}
                    <LinearProgress variant="determinate" value={progressPercentage} sx={{mb: 2}}/>
                    <Typography variant="body2" align="center" sx={{mb: 4}}>
                        Question {currentWordIndex + 1} of {numberOfWords}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom sx={{mb: 2}}>
                        Points: {points}
                    </Typography>
                    <TextField
                        fullWidth
                        inputRef={answerInputRef}
                        label="Enter the answer"
                        variant="outlined"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={answered}
                    />
                    <Box textAlign="center" sx={{mt: 2}}>
                        <Button variant="contained" color="primary" onClick={handleAnswer} disabled={answered}>
                            Submit Answer
                        </Button>
                    </Box>
                    {showAnswer && (
                        <Box sx={{mt: 4, textAlign: 'center'}}>
                            <Alert severity={answerStatus === 'correct' ? 'success' : 'error'} sx={{mb: 2}}>
                                {answerStatus === 'correct' ? 'Correct answer!' : `Incorrect! The correct answer was ${currentWord.word}.`}
                            </Alert>
                            <Typography variant="subtitle1">
                                {currentWord.translation} means "{currentWord.word}" in German.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleNextQuestion}>
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
