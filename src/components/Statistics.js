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
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { grey, red } from '@mui/material/colors';

const Statistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/statistics`)
            .then((response) => response.json())
            .then((data) => {
                const updatedStatistics = data.map((stat) => ({
                    ...stat,
                    failed_attempts: stat.times_shown - stat.times_correct
                }));
                setStatistics(updatedStatistics);
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
        const diff = b.failed_attempts - a.failed_attempts;
        return sortOrder === 'desc' ? diff : -diff;
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
                    <Typography variant="h4" align="center" gutterBottom>
                        Word Statistics
                    </Typography>
                    <Divider sx={{ mb: 4 }} />
                    <TableContainer component={Paper}>
                        <Table aria-label="failed words table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Word</TableCell>
                                    <TableCell align="left">Times Shown</TableCell>
                                    <TableCell align="left">Times Correct</TableCell>
                                    <TableCell align="right" aria-label="failed attempts column">
                                        Failed Attempts
                                        <Tooltip title={`Sort by failed attempts (${sortOrder === 'asc' ? 'ascending' : 'descending'})`}>
                                            <IconButton onClick={handleSort} size="small">
                                                {sortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedStatistics.map((row) => (
                                    <TableRow key={row.word}>
                                        <TableCell align="left">{row.word}</TableCell>
                                        <TableCell align="left">{row.times_shown}</TableCell>
                                        <TableCell align="left">{row.times_correct}</TableCell>
                                        <TableCell align="right" style={{ color: row.failed_attempts > 5 ? red[500] : grey[800] }}>
                                            {row.failed_attempts}
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
