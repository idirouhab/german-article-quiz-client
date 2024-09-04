import { ThemeProvider, createTheme } from '@mui/material/styles';
import Quiz from "./components/Quiz";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',  // Change the primary color
        },
    },
    typography: {
        h4: {
            fontWeight: 'bold', // Make h4 bolder
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Quiz />
        </ThemeProvider>
    );
};

export default App;
