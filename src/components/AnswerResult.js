import React from 'react';
import { Box, Alert, Typography, Button } from '@mui/material';

const AnswerResult = ({ answerStatus, currentWord, handleNextQuestion }) => {
    return (
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
    );
};

export default AnswerResult;
