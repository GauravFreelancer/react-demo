import { Paper, Table, TableBody, TableRow, TableCell, TableHead, TableContainer, TableSortLabel, TablePagination, TableFooter, TextField, InputAdornment, IconButton, Button, Box } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import classes from './User.module.css';
import SearchIcon from "@material-ui/icons/Search";
import { Add } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const headCells = [
    { id: 'FirstName', label: 'First Name' },
    { id: 'LastName', label: 'Last Name' },
    { id: 'Email', label: 'Email Address' },
    { id: 'MobileNumber', label: 'Mobile Number' },
    { id: 'Address', label: 'Address'},
    { id: 'Action', label: 'Action', disableSorting: true}
]
 
function User(props) {

    const pages = [2, 5, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("FirstName")
    const [records, setRecords] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [search, setSearch] = useState("")

    useEffect(() => {
        getUserList(page, rowsPerPage, order, orderBy, search);
    },[])

    const getUserList = (page, rowsPerPage, order, orderBy, search) => {
        fetch('http://localhost:8080/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: page,
                rowsPerPage: rowsPerPage,
                order: order,
                orderBy: orderBy,
                search: search
            })
        }).then(result => {
            return result.json();
        }).then(data => {
            setRecords(data.data);
            setTotalRecords(data.totalRecord);
        })
    }

    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        const Order = isAsc ? 'desc' : 'asc';
        setOrder(Order);
        setOrderBy(cellId);
        setPage(0);
        getUserList(0, rowsPerPage, Order, cellId, search);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getUserList(newPage, rowsPerPage, order, orderBy, search);
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0);
        getUserList(0, parseInt(event.target.value, 10), order, orderBy, search);
    }

    const searchHandler = () => {
        setPage(0);
        setRowsPerPage(2);
        setOrder("asc");
        setOrderBy("FirstName");
        getUserList(0, 2, "asc", "FirstName", search);
    }
 
    return (
        <Paper>
            <Box display="flex" justifyContent="space-between">
                <TextField
                    label="Search"
                    name="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment>
                            <IconButton onClick={searchHandler}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                />
                <Link to="/manage-user" className={classes.LinkUnderlineRemove}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                </Link>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                headCells.map(headCell => (
                                <TableCell key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : false}>
                                    {headCell.disableSorting ? headCell.label :
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => { handleSortRequest(headCell.id) }}>
                                            {headCell.label}
                                        </TableSortLabel>
                                    }
                                </TableCell>))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            records.map(item => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.FirstName}</TableCell>
                                    <TableCell>{item.LastName}</TableCell>
                                    <TableCell>{item.Email}</TableCell>
                                    <TableCell>{item.MobileNumber}</TableCell>
                                    <TableCell>{item.Address}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            className={classes.IconButton}
                                            onClick={() => props.history.push('/manage-user/'+ item._id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton className={classes.IconButton}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                page={page}
                                rowsPerPageOptions={pages}
                                rowsPerPage={rowsPerPage}
                                count={totalRecords}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default User
