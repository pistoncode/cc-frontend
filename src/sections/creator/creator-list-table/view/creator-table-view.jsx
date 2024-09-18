/* eslint-disable no-unused-vars */
import React from 'react';
import isEqual from 'lodash/isEqual';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { TableRow, TableCell } from '@mui/material';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import useGetCreators from 'src/hooks/use-get-creators';
import { useCreator } from 'src/hooks/zustands/useCreator';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';
import withPermission from 'src/auth/guard/withPermissions';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';


import { calculateAge } from 'src/utils/formatTime';
import CreatorTableRow from '../creator-table-row';
import CreatorTableToolbar from '../creator-table-toolbar';
import CreatorTableFilter from '../creator-table-filters-result';

import MediaKitCreator from 'src/sections/creator/media-kit-creator-view/mediakit-view-by-id';



const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'pronounce', label: 'Pronounce', width: 100 },
  { id: 'tiktok', label: 'Tiktok Account', width: 120 },
  { id: 'instagram', label: 'Instagram Account', width: 150 },
  { id: 'country', label: 'Country', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'mediaKit', label: 'Media Kit', width: 180 },
  { id: '', label: 'Operation', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
  ageRange: [18, 100],
  pronounce: [],
};

// ----------------------------------------------------------------------

function CreatorTableView() {
  useGetCreators();
  const { creators } = useCreator();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [ageRange, setAgeRange] = useState(defaultFilters.ageRange);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleAgeRangeChange = (newValue) => {
    setAgeRange(newValue);
  };

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(creators);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    ageRange
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAgeRange([18, 100]);
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(`${endpoints.creators.deleteCreator}/${id}`);
        const deleteRows = tableData.filter((row) => row.id !== id);
        confirm.onFalse();
        setTableData(deleteRows);
        enqueueSnackbar('Successfully deleted Creator');
      } catch (error) {
        enqueueSnackbar('Error delete Creator', { variant: 'error' });
        // toast.error('Error delete Creator');
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleViewMediaKit = useCallback((id) => {
    setExpandedRow(expandedRow === id ? null : id);
  }, [expandedRow]);

  useEffect(() => {
    setTableData(creators);
  }, [creators]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List Creators"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Creators' },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <CreatorTableToolbar filters={filters} onFilters={handleFilters} ageRange={ageRange} onAgeRangeChange={handleAgeRangeChange} pronounceOptions={['he/him', 'she/her', 'they/them', 'others']} />

          {canReset && (
            <CreatorTableFilter
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <React.Fragment key={row.id}>
                        <CreatorTableRow
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewMediaKit={() => handleViewMediaKit(row.id)}
                          expanded={expandedRow === row.id}
                        />
                        {expandedRow === row.id && (
                          <TableRow>
                            <TableCell colSpan={TABLE_HEAD.length} sx={{ py: 3 }}>
                              <MediaKitCreator creatorId={row.id} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      <Toaster />
    </>
  );
}

export default withPermission(['list:creator'], CreatorTableView);

// export default CreatorTableView;

function applyFilter({ inputData, comparator, filters, ageRange }) {
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (filters.pronounce.length) {
    inputData = inputData.filter((user) => filters.pronounce.includes(user.creator.pronounce));
  }

  // Filter by age range
  inputData = inputData.filter((user) => {
    const age = calculateAge(user.creator.birthDate);
    return age >= ageRange[0] && age <= ageRange[1];
  });

  return inputData;
}
