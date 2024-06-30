import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { TextField, Box, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FetchRandomUser = ({ onClick }) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [filteredRows, setFilteredRows] = useState([]);
  const [activeColumn, setActiveColumn] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://api.randomuser.me/?results=10';
      const response = await fetch(url);
      const data = await response.json();
      const formattedData = data.results.map((user, index) => ({
        id: index,
        title: user.name.title,
        first: user.name.first,
        last: user.name.last,
        email: user.email,
        phone: user.phone,
        largePicture: user.picture.large,
      }));
      setRows(formattedData);
      setFilteredRows(formattedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearchChange = (event, field) => {
    const { value } = event.target;
    setSearchValues({ ...searchValues, [field]: value });
    filterRows({ ...searchValues, [field]: value });
  };

  const filterRows = (searchValues) => {
    let filtered = [...rows];
    for (const field in searchValues) {
      if (searchValues[field]) {
        filtered = filtered.filter((row) =>
          row[field].toLowerCase().includes(searchValues[field].toLowerCase())
        );
      }
    }
    setFilteredRows(filtered);
  };

  const handleHeaderClick = (field) => {
    setActiveColumn(activeColumn === field ? '' : field);
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'first', headerName: 'First Name', width: 150 },
    { field: 'last', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 200 },
    {
      field: 'largePicture',
      headerName: 'Picture',
      width: 150,
      renderCell: (params) => <img src={params.value} alt="random user" width={50} />,
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns.map((column) => ({
          ...column,
          renderHeader: (params) => (
            <div>
              <div onClick={() => handleHeaderClick(params.field)}>{params.colDef.headerName}</div>
              {activeColumn === params.field && (
                <TextField
                  fullWidth
                  label={`Search ${params.colDef.headerName}`}
                  variant="outlined"
                  size="small"
                  onChange={(event) => handleSearchChange(event, params.field)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
          ),
        }))}
        pageSize={10}
        loading={loading}
        onRowClick={(params) => onClick(params.row)}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default FetchRandomUser;
