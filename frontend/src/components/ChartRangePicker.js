import React, {useState} from 'react';

// Material-UI Components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { 
    Tabs, Tab,
} from '@material-ui/core';

const StockTabs = withStyles((theme) => ({
    root: {
      borderBottom: '1px solid #d6d6d6',
    },
    indicator: {
      backgroundColor: theme.palette.primary,
      display: 'flex',
      justifyContent: 'center',
    },
  }))(Tabs);

const StockTab = withStyles((theme) => ({
    root: {
      color: "#d6d6d6",
      textTransform: 'none',
      marginRight: theme.spacing(1),
      minWidth: 30,
      fontWeight: 500,
      '&:hover': {
        color: theme.palette.primary.main,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.primary,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.primary,
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);  

const ChartRangePicker = () => {
    const [value, setValue] = useState(0);

    const labels = ["1D", "1W", "1M", "1Y", 'ALL'];

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