
import { useState, useEffect, createRef } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import MuiTable from "../../components/table/table_index";
import { BASE_URL, PATH_TRIP } from "../../utils/constants";
import { PATH_ROUTE } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";
import { Paper, TablePagination } from "@material-ui/core";
import { MTableToolbar } from "material-table";
import chroma from "chroma-js";

function TripTable() {

  const tableRef = createRef();
  const snackbar = useSnackbar();
  const navigate =  useNavigate();



  const [Routes, setRoutes] = useState({});

  useEffect(() => {
    const fetchRoutes = async () => {
      const typesResponse = await makeApiCall(
        `${BASE_URL}${PATH_ROUTE}`
      );
      const jsonResp = await typesResponse.json();
      const types = {};
      jsonResp.value.forEach(
        (item) =>
        (types[`${item.RouteId}`] = item.RouteName)
      );
      setRoutes(types);
    };
    fetchRoutes();
  }, []);

  const colorAssignments = {};

  const columns = [
    { 
      title: "TripId",
      field: "TripId",
      editable: "never",
      cellStyle: {
        fontWeight: "bold",
      }, 
    },
      { 
        title: "StartTime",
        field: "StartTime",
        cellStyle: {
          fontWeight: "bold",
        },
      },
      { 
        title: "Route Name",
        field: "TripRoute",
        lookup: Routes,
        render: (rowData, index) => {
        const route = Routes[rowData.TripRoute];
        let backgroundColor;     
        if (colorAssignments.hasOwnProperty(route)) {
          backgroundColor = colorAssignments[route];
        } else {
          backgroundColor = chroma.random().alpha(0.2).css();
          colorAssignments[route] = backgroundColor;
        }
        const randomBorderColor = chroma(backgroundColor).saturate(2).brighten(1).css();
        return (
          <div
            style={{
              width: "min-content",
              padding: "8px",
              textAlign: "center",
              border: `1px solid ${randomBorderColor}`,
              color: "black",
              borderRadius: "7px",
              backgroundColor: backgroundColor
            }}
          >
            {route}
          </div>
        );
      },
      },
  ];
  
  const fetchData = async (query) => {
    return new Promise((resolve, reject) => {
      const { page, orderBy, orderDirection, search, pageSize } = query;
      const url = `${BASE_URL}${PATH_TRIP}`;
      let temp = url; // Initialize with the base URL
      let filterQuery = ""; // Initialize filter query as an empty string
  
      // Handle sorting
      if (orderBy) {
        temp += `?$orderby=${orderBy.field} ${orderDirection}`;
      }
  
      // Handle searching
      if (search) {
        filterQuery = `$filter=contains($screen.getSearchField().getName(), '${search}')`;
        temp += orderBy ? `&${filterQuery}` : `?${filterQuery}`;
      }
  
      // Handle pagination
      if (page > 0) {
        const skip = page * pageSize;
        temp += orderBy || search ? `&$skip=${skip}` : `?$skip=${skip}`;
      }
  
      const countUrl = search ? `${url}/$count?${filterQuery}` : `${BASE_URL}${PATH_TRIP}/$count`;
      let total = null;
  
      makeApiCall(countUrl)
        .then((res) => res.text())
        .then((e) => {
          total = parseInt(e, 10);
        })
        .then(() => makeApiCall(temp))
        .then((res) => res.json())
        .then(({ value }) => {
          return resolve({
            data: value,
            page: page,
            totalCount: total,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div className="product-container">
      {
      Object.keys(Routes).length > 0 && 
      (
        <MuiTable
          tableRef={tableRef}
          title="Trip Table"
          cols={columns}
          data={fetchData}
          size={5}
          options={{
            toolbar: true,
            search: false,
          }}
          components={{
            Container: (props) => (
              <Paper
                {...props}
                elevation={0}
                style={{ marginLeft: "30px", marginRight: "30px" }}
              />
            ),
            Toolbar: (props) => (
              <div style={{ border: "none", background: "#F7F9FD" }}>
                <MTableToolbar {...props} />
              </div>
            ),

            Pagination: (props) => <TablePagination {...props} />,
          }}
          actions={[
            {
              icon: () => (
                <img src="/charm_search.svg" height={30} alt="search icon" />
              ),
              tooltip: "Search",
              style: "font-size:10px;",
              // onClick: () => navigate("/Trips/create"),
              isFreeAction: true,
            },
            {
              icon: () => (
                <img src="/carbon_filter.svg" height={30} alt="filter icon" />
              ),
              tooltip: "Filter",
              style: "font-size:10px;",
              // onClick: () => navigate("/Trips/create"),
              isFreeAction: true,
            },
            {
              icon: () => <img src="/gg_add.svg" height={30} alt="add icon" />,
              tooltip: "Add",
              style: "font-size:10px;",
              onClick: () => navigate("/Trips/create"),
              isFreeAction: true,
            },
            {
              icon: () => <img src="./view.svg" alt="view icon" />,
              tooltip: "View",
              onClick: (event, rowData) =>
                navigate(`/Trips/view/${rowData.TripId}`),
            },
            {
              icon: () => <img src="./Group-74.svg" alt="edit icon" />,
              tooltip: "Edit",
              onClick: (event, rowData) =>
                navigate(`/Trips/edit/${rowData.TripId}`),
            },
          ]}
          onRowDelete={async (oldData) => {
            const resp = await makeApiCall(
              `${BASE_URL}${PATH_TRIP}(${oldData.TripId})`,
              "DELETE"
            );
            if (resp.ok) {
              tableRef.current.onQueryChange();
              snackbar.enqueueSnackbar("Successfully deleted Trips", {
                variant: "success",
              });
            } else {
              const jsonData = await resp.json();
              snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
                variant: "error",
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default TripTable;
