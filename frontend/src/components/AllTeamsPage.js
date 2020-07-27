import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { 
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Typography, LinearProgress
 } from "@material-ui/core";
import * as NBAIcons from 'react-nba-logos';
import { connect } from 'react-redux';

const startingElos = {
  PHI: 1525, MIL: 1575, CHI: 1200, CLE: 1000, 
  BOS: 1455, LAC: 1600, MEM: 1100, ATL: 1200, 
  MIA: 1325, CHA: 1050, UTA: 1475, SAC: 1250, 
  NYK: 1200, LAL: 1580, ORL: 1200, DAL: 1300, 
  BKN: 1350, DEN: 1450, IND: 1300, NOP: 1250,
  DET: 1100, TOR: 1345, HOU: 1525, SAS: 1300, PHX: 1250,
  OKC: 1250, MIN: 1200, POR: 1415, GSW: 1400,
  WAS: 1200
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "abr",
    numeric: false,
    disablePadding: false,
    label: "Abbreviation",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
    format: (value) => value.toFixed(2),
  },
  {
    id: "growth",
    numeric: true,
    disablePadding: false,
    label: "Season Growth %",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id=="name" ? "" : "right"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  title: {
    margin: theme.spacing(2, 0)
  },
  row: {
    '&:hover': {
      cursor: "pointer",
    }
  },
  good: {
    color: theme.palette.green.main,
  },
  bad: {
    color: theme.palette.red.main,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const AllTeamsPage = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("price");

  function createData([abr, data]) {
    const price = data['price']['price'];
    const name = data['name'];
    const growth = ((price - startingElos[abr])/startingElos[abr]) * 100
    return { name, abr, price, growth };
  };

  useEffect(() => {
    setRows(Object.entries(props.teams.teams).map(createData));
  }, [props.teams]);

  const handleClick = (e, abr) => {
    history.push(`/team/${abr.toLowerCase()}`);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.root}>
        <Typography
          className={classes.title}
          variant="h3"
          id="tableTitle"
          component="div"
        >
          All Teams
        </Typography>
        { rows.length == 0 ? 
          <LinearProgress /> :
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const Logo = NBAIcons[row.abr];
                  return (
                    <TableRow 
                    hover
                    onClick={(event) => handleClick(event, row.abr)}
                    className={classes.row}>
                      <TableCell>
                      <span><Logo size={30}/></span>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        {row.abr}
                      </TableCell>
                      <TableCell align="right">${row.price.toFixed(2)}</TableCell>
                      <TableCell 
                        className={row.growth > 0 ? classes.good : classes.bad} 
                        align="right"
                      >
                        {row.growth.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow style={{ height: 53}}>
                  <TableCell colSpan={5} />
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        }
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    teams: state.teams
  };
}

export default connect(mapStateToProps, { })(AllTeamsPage);
