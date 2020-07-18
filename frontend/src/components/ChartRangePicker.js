import React, {useState} from 'react';

// Material-UI Components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { 
    Tabs, Tab,
} from '@material-ui/core';

const StockTabs = withStyles((theme) => ({
    root: {
      borderBottom: '1px solid #9FAFBA',
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,

    },
  }))(Tabs);

const StockTab = withStyles((theme) => ({
    root: {
      color: theme.palette.secondary.main,
      textTransform: 'none',
      marginRight: theme.spacing(0.5),
      minWidth: 20,
      fontWeight: 500,
      transition: "all 0.6s cubic-bezier(.25,.8,.25,1)",
      '&:hover': {
        color: theme.palette.primary.main,
        opacity: 1,
      },
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.primary,
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);  

const ChartRangePicker = (props) => {
    const [value, setValue] = useState(0);

    const labels = ["1D", "1W", "1M", "YTD"];

    const handleChange = (e, newValue) => {
        setValue(newValue);
        props.pickRange(newValue);
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