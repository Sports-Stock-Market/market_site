import React, {useState} from 'react';

// Material-UI Components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { 
    Tabs, Tab,
} from '@material-ui/core';

const StockTabs = withStyles((theme) => ({
    root: {
      
    },
    indicator: {
      display: 'none',
      justifyContent: 'center',
    },
  }))(Tabs);

const StockTab = withStyles((theme) => ({
    root: {
      color: theme.palette.primary.main,
      textTransform: 'none',
      marginRight: theme.spacing(1),
      minWidth: 30,
      minHeight: 42,
      fontWeight: 500,
      borderRadius: "20px",
      transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.common.white,
        fontWeight: theme.typography.fontWeightMedium,
        backgroundColor: theme.palette.primary.main
      },
      '&:focus': {
        color: theme.palette.primary,
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);  

const ChartRangePicker = () => {
    const [value, setValue] = useState(0);

    const labels = ["1D", "1W", "1M", "YTD"];

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <StockTabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                {labels.map((label) => 
                    <StockTab label={label} />
                )}
            </StockTabs>
        </div>
    );
}

export default ChartRangePicker;