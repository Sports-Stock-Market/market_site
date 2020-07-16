import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
    breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 1080,
          lg: 1280,
          xl: 1920,
        },
    },
    palette: {
        background: {
            default: "#FFF",
        },
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#9FAFBA',
            light: '#F4F9FC'
        },
        blue: {
            main: '#1043C1',
        },        
        red: {
            main: '#D61B23'
        },
        yellow: {
            main: '#FFC010',
        },
        green: {
            main: '#0C9045',
        }
    },
    typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        h3: {
            fontWeight: 800,
            fontSize: "2.5rem",
        },
        h4: {
            fontWeight: 800,
            fontSize: "1.8rem",
        },
        h5: {
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.15,
        },
        h6: {
            fontSize: "1.5rem",
            fontWeight: 700,
        },
        subtitle1: {
            fontSize: "1rem",
            fontWeight: 600,
        },
        subtitle2: {
            fontSize: "0.1rem",
            fontWeight: 500,
        },
        body1: {
            fontSize: "0.9rem",
        },
        body2: {
            fontSize: "0.7rem",
        },
        button: {
            textTransform: "none",
        },
    },
});

export default theme;