import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Box,
  IconButton
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
  handleErrorToastr,
  handleSuccessToastr
} from '../../../../utils/toastr';
import { Api } from '../../../../config/constants';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  TableCell: {
    whiteSpace: 'nowrap'
  }
}));

const ModeratorsTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { users } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user._id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const handleDelete = async id => {
    try {
      await axios.put(`${Api.baseURL}/hide_unhide_User/${id}`, {
        state: 'inactive'
      });

      users.filter(user => user._id !== id);
    } catch (error) {
      if (error.message === 'Network Error') {
        handleErrorToastr(error.message, () => {});
      }
      return Error();
    }

    handleSuccessToastr('Participant deleted successfully', () => {});
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.TableCell}>username</TableCell>
                  <TableCell className={classes.TableCell}>Email</TableCell>
                  <TableCell className={classes.TableCell}>groupes</TableCell>

                  <TableCell className={classes.TableCell}>Contact</TableCell>
                  <TableCell className={classes.TableCell}>Password</TableCell>

                  <TableCell>Joined at </TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(user => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user._id}
                      selected={selectedUsers.indexOf(user._id) !== -1}>
                      <TableCell>
                        <Typography>{user.username}</Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>

                      <TableCell>{user.groupes}</TableCell>
                      <TableCell>{user.contact}</TableCell>

                      <TableCell>{user.password}</TableCell>

                      <TableCell>
                        {moment(user.created_at).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          <IconButton>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user._id)}>
                            <HighlightOffIcon
                              fontSize="small"
                              style={{
                                color: red[500]
                              }}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={''}
          rowsPerPage={rowsPerPage}
        />
      </CardActions>
    </Card>
  );
};

ModeratorsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default ModeratorsTable;
