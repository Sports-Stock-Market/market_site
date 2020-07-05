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
            main: '#EC1C24'
        },
        yellow: {
           main: '#FFC010',
        },
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
        h5: {
            fontWeight: 700,
        },
        button: {
            textTransform: "none",
        },
    },
});

export default theme