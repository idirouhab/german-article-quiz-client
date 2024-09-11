import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CircularProgress, Grid } from '@mui/material';

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [averagesByGame, setAveragesByGame] = useState({ vocabulary: {}, articles: {} });

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/scores`)
            .then(response => response.json())
            .then(data => {
                calculateAverages(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const calculateAverages = (data) => {
        const scoresByGame = { vocabulary: {}, articles: {} };

        data.forEach(player => {

            const { player_name, score, game } = player;

            if (!scoresByGame[game][player_name]) {
                scoresByGame[game][player_name] = [];
            }

            scoresByGame[game][player_name].push(parseInt(score));
        });

        const calculateGameAverages = (playerScores) => {
            return Object.keys(playerScores).reduce((acc, player) => {
                const scores = playerScores[player];
                const average = scores.reduce((sum, score) => sum + score) / scores.length;
                acc[player] = average.toFixed(2);

                return acc;
            }, {});
        };

        setAveragesByGame({
            vocabulary: calculateGameAverages(scoresByGame.vocabulary),
            articles: calculateGameAverages(scoresByGame.articles),
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Player Statistics
            </Typography>

            {/* Vocabulary Stats */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Vocabulary Game Averages
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.keys(averagesByGame.vocabulary).map(player => (
                            <Grid item xs={12} sm={6} key={player}>
                                <Typography variant="body1">
                                    {player}: {averagesByGame.vocabulary[player]} points
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Articles Stats */}
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Articles Game Averages
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.keys(averagesByGame.articles).map(player => (
                            <Grid item xs={12} sm={6} key={player}>
                                <Typography variant="body1">
                                    {player}: {averagesByGame.articles[player]} points
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Statistics;
