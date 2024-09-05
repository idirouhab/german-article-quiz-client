import React, { useEffect, useState } from 'react';
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
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import { blue, grey, red } from '@mui/material/colors';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

const Statistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/statistics`)
            .then((response) => response.json())
            .then((data) => {
                setStatistics(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleSort = () => {
        setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
    };

    const sortedStatistics = [...statistics].sort((a, b) => {
        return sortOrder === 'desc'
            ? (b.times_shown - b.times_correct) - (a.times_shown - a.times_correct)
            : (a.times_shown - a.times_correct) - (b.times_shown - b.times_correct);
    });

    if (loading) {
        return (
            <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: blue[700] }}>
                        Quiz Statistics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Word</TableCell>
                                    <TableCell align="right">Times Shown</TableCell>
                                    <TableCell align="right">Times Correct</TableCell>
                                    <TableCell align="right">Success Rate (%)</TableCell>
                                    <TableCell align="right">Failures</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={`Sort by failures (${sortOrder === 'desc' ? 'Descending' : 'Ascending'})`}>
                                            <IconButton onClick={handleSort}>
                                                {sortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedStatistics.map((stat) => (
                                    <TableRow
                                        key={stat.word}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: grey[200],
                                            },
                                            '&:hover': {
                                                backgroundColor: grey[300],
                                            },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {stat.word}
                                        </TableCell>
                                        <TableCell align="right">{stat.times_shown}</TableCell>
                                        <TableCell align="right">{stat.times_correct}</TableCell>
                                        <TableCell align="right">
                                            {stat.success_rate.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: red[700] }}>
                                            {stat.times_shown - stat.times_correct}
                                        </TableCell>
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
