import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        blue: {
            main: '#1043C1',
        },        
        red: {
            main: '#D8484D'
        },
        yellow: {
            main: '#FFC010',
        },
        green: {
            main: '#009B43',
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
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        button: {
            textTransform: "none",
        },
    },
});

export default theme