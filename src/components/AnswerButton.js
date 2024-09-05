import React from 'react';
import { Button } from '@mui/material';
import { grey } from '@mui/material/colors';

const AnswerButton = ({ answered, isCorrect, label, onClick }) => {
    return (
        <Button
            fullWidth
            variant="contained"
            color={answered && isCorrect ? 'success' : 'primary'}
            onClick={onClick}
            disabled={answered}
            sx={{ bgcolor: grey[800], '&:hover': { bgcolor: grey[600] } }}
        >
            {label}
        </Button>
    );
};

export default AnswerButton;
