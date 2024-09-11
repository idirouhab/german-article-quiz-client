// Statistics.js
import React, {useEffect, useState} from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Divider
} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageScores, setAverageScores] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/scores`)
            .then((response) => response.json())
            .then((data) => {
                setScores(data);
                calculateAverages(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching scores:', error);
                setLoading(false);
            });
    }, []);

    const calculateAverages = (data) => {
        const playerScores = data.reduce((acc, score) => {
            if (!acc[score.player_name]) {
                acc[score.player_name] = [];
            }
            acc[score.player_name].push(parseInt(score.score));
            return acc;
        }, {});

        const averages = Object.keys(playerScores).reduce((acc, player) => {
            const scores = playerScores[player];
            const average = scores.reduce((sum, score) => {
                return sum + score
            }) / scores.length;
            acc[player] = average.toFixed(2);
            return acc;
        }, {});
        console.log(averages);
        setAverageScores(averages);
    };

    const chartData = {
        labels: scores.map(score => score.player_name),
        datasets: [{
            label: 'Scores',
            data: scores.map(score => score.score),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{mt: 5, textAlign: 'center'}}>
                <CircularProgress/>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{mt: 5}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Player Statistics
                    </Typography>
                    <Divider sx={{mb: 2}}/>
                    <Box sx={{mb: 4}}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw}`
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        beginAtZero: true
                                    },
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </Box>
                    <Typography variant="h6" gutterBottom align="center">
                        Average Scores Per Player
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Player Name</TableCell>
                                    <TableCell>Average Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(averageScores).map((name) => (
                                    <TableRow key={name}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{averageScores[name] || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Statistics;
