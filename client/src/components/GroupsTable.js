import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Toolbar,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  if (stabilizedThis?.length) {
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return b[1] - a[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
}

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'groupName';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead({ order, orderBy, onRequestSort, headers }) {
  const handleSort = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: 'secondary.main' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={handleSort(headCell.id)}
              sx={{ color: 'secondary.main' }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar({ tableName, tableCaption }) {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        pt: { sm: 2 },
        justifyContent: 'space-between',
        borderRadius: '4px 4px 0 0'
      }}
    >
      <Typography
        sx={{ fontWeight: 700, flexBasis: '100%' }}
        variant="h6"
        color="secondary.main"
      >
        {tableName}
      </Typography>
      <Link to="/group-form">
        <Button
          sx={{
            bgcolor: 'tertiary.main',
            color: 'primary.main',
            '&:hover': { backgroundColor: 'tertiary.main', opacity: 0.9}
          }}
          color="tertiary.main"
          variant="filled"
        >
          New
        </Button>
      </Link>
    </Toolbar>
  );
}

/**
 * Enhanced Table creates a table component with given data.
 * @param {Object} 'rows' is an object where keys represent column headers and values represent data.
 * @param {String} 'tableName' is a string used for the table label.
 * @param {Array} 'headers' is an array of objects containing configuration data for each header/column.
 * @param {String} 'rowKey' is the key/property of the 'rows' object that should be used as a key.
 * @returns
 */
export default function EnhancedGroupsTable({ rows, tableName, tableCaption, headers, rowKey }) {
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  useEffect(() => {
    if (rows?.length) {
      let rowsOnMount = stableSort(
        rows,
        getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
      );
      rowsOnMount = rowsOnMount.slice(
        0 * DEFAULT_ROWS_PER_PAGE,
        0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
      );
      setVisibleRows(rowsOnMount);
    }
  }, [rows]);

  const handleRequestSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);
      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [rows, order, orderBy, page, rowsPerPage],
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage);
      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [rows, order, orderBy, rowsPerPage],
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [rows, order, orderBy],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          width: '100%', mb: 2,
          paddingX: 2,
          bgcolor: 'primary.main'
        }}
      >
        <EnhancedTableToolbar tableName={tableName} tableCaption={tableCaption} />
        <TableContainer sx={{ paddingX: 1.5 }} >
          <Table aria-labelledby="tableTitle" >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headers={headers}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                  return (
                    <TableRow key={row[rowKey]} >
                      {headers.map((header) => (
                        <TableCell
                          align={header.numeric ? 'right' : 'left'}
                          sx={{ color: 'secondary.main' }}
                          key={`${row[rowKey]}${header.label}${row[header.id]}`}
                        >
                          {header.route ?
                            <Link
                              key={`${header.route}${row[rowKey]}`}
                              to={`${header.route}${row[rowKey]}`}
                              style={{
                                textDecoration: 'none',
                                color: '#214C67',
                                fontWeight: 600
                              }} >
                              {row[header.id]}
                            </Link> :
                            row[header.id]
                          }
                        </TableCell>)
                      )}
                    </TableRow>
                  );
                })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          align="left"
          sx={{ color: 'secondary.main', width: '100%', paddingLeft: '0' }}
        />
      </Paper>
    </Box>
  );
}
