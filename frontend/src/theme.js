import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#AAA',
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
        h4: {
            fontWeight: 800,
        },
        h5: {
            fontSize: "0.9rem",
            fontWeight: 700,
            lineHeight: 1.15,
        },
        h6: {
            fontWeight: 700,
        },
        subtitle2: {
            fontSize: "0.5rem",
            fontWeight: 600,
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

export default theme