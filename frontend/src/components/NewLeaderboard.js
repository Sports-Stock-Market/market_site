import React, { useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { 
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Typography, LinearProgress, TablePagination, Avatar
 } from "@material-ui/core";

import { refreshToken } from '../actions/authActions';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

function moneyFromRank(rank) {
    if (rank == 1) {
        return 100;
    } else if (rank == 2) {
        return 50;
    } else if (rank == 3) {
        return 20;
    } else if (4 <= rank <= 10) {
        return 5;
    } else {
        return 0;
    }
}

function createData(name, fans) {
    const growth = (((fans - 1500) / 1500) * 100).toFixed(2);
    return { name, fans, growth };
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
    id: "rank",
    numeric: true,
    disablePadding: false,
    label: "Rank",
  },
  {
    id: "fans",
    numeric: true,
    disablePadding: false,
    label: "Fans",
    format: (value) => value.toFixed(2),
  },
  {
    id: "growth",
    numeric: true,
    disablePadding: false,
    label: "Growth %",
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
  userRow: {
    backgroundColor: theme.palette.secondary.light,
  },
  money: {
    fontSize: "0.7rem",
    fontWeight: 700,
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: "#000",
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

const NewLeaderboard = (props) => {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("fans");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const cookies = new Cookies();
  useLayoutEffect(() => {
    props.refreshToken(cookies.get('csrf_refresh_token')).then(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }, []);
  const requestOpts = {
    method: 'GET',
    headers: {'Content-type': 'application/JSON'},
    credentials: 'include'
  };
  const getLeaderboard = () => {
    fetch('http://localhost:5000/api/users/leaderboard', requestOpts).then(
      res => res.json().then(data => {
        data = data.map(o => createData(o['username'], o['value']));
        setRows(data);
      })
    );
  }
  useEffect(() => {
    getLeaderboard();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.root}>
        <Typography
          className={classes.title}
          variant="h3"
          id="tableTitle"
          component="div"
        >
          Leaderboard
        </Typography>
        { rows.length == 0 ? 
          <LinearProgress /> :
        <>
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
                  return (
                    <TableRow 
                    hover
                    className={row.name == props.auth.user.username ? classes.userRow : null}>
                      <TableCell>
                      <span>
                        <Avatar className={classes.money}>
                            ${moneyFromRank(index + 1)}
                        </Avatar>
                      </span>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">${row.fans.toFixed(2)}</TableCell>
                      <TableCell 
                        className={row.growth >= 0 ? classes.good : classes.bad} 
                        align="right"
                      >
                        {row.growth}%
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </>
        }
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    teams: state.teams
  };
}

export default connect(mapStateToProps, { refreshToken })(NewLeaderboard);
