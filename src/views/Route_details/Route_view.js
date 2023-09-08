
import { Box, IconButton, Checkbox, Grid, makeStyles, Table, TableBody, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BASE_URL, PATH_ROUTE } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";
import { routeViewConfig } from "../../utils/display_configuration";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    margin: "12px 18px",
    width: "100%",
  },
  titleCell: {
    display: "flex",
    borderBottom: "none",
  },
  valueCell: {
    borderBottom: "none",
  },
});

const ViewRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const styles = useStyles();

  const [route, setRoute] = useState({});

  useEffect(() => {
    if (id) {
      const fetchRouteById = async () => {
        const RouteResponse = await makeApiCall(
          `${BASE_URL}${PATH_ROUTE}(${id})`
        );
        const RouteJsonResp = await RouteResponse.json();
        setRoute(RouteJsonResp);
      };
      fetchRouteById();
    }
  }, [id]);

  return (
    <>
      {route && (
        <Box 
          padding={2}
          style={{
            background: "rgba(247, 249, 253, 1)",
            marginBottom: "100px",
          }}
        >
          <Grid>
            <Grid item lg={12} xs={12}>
              <Box 
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "30px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" style={{ fontWeight: "800" }}>
                  View Route
                </Typography>
                <IconButton
                  onClick={() => navigate(`/Routes/edit/${id}`)}
                  style={{ width: "42px", height: "42px" }}
                  color="primary"
                  size="small"
                >
                  <img src="/tabler_edit.svg" alt="edit Routes" />
                </IconButton>
              </Box>
            </Grid>
            <Box marginTop={2} className="form-container">
              <Grid container item lg={12} xs={12}>
                {Object.keys(routeViewConfig).map((config, ind) => (
                  <>
                    <Grid item lg={5} md={5} xs={12}>
                      <Box 
                        marginTop={1}
                        style={{
                          border: "0.5px solid rgba(0, 0, 0, 0.5)",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 1)",
                        }}
                      >
                        <Table size="small" className={styles.table}>
                          <Typography 
                            variant="h5"
                            style={{ fontWeight: "600", marginBottom: "22px" }}
                          >
                            {config}
                          </Typography>
                          <TableBody>
                            {routeViewConfig[config].map(
                              ({ key, value, type }) => (
                                <TableRow key={key} className="responsive-table-row">
                                  {
                                    <div
                                      className={
                                        type === "file" ? "conditional" : ""
                                      }
                                    >
                                      <div>{value}: </div>
                                      {type === "file" && (
                                        <div
                                          style={{
                                            alignItems: "flex-end",
                                          }}
                                        >
                                          <span>{"<"}</span>
                                          <span>1-3/4</span>
                                          <span>{">"}</span>
                                        </div>
                                      )}
                                    </div>
                                  }
                                  {
                                      type === "date" ? (
                                      <Typography variant="h6">
                                        {route[key] !== null &&
                                          moment.utc(route[key]).format(
                                            "DD-MMMM-YYYY HH:mm:ss A"
                                          )}
                                      </Typography>
                                    ) : 
                                    type === "boolean" ? (
                                      <Checkbox
                                        checked={route[key] || false}
                                        disabled
                                      />
                                    ) : (
                                      <Typography variant="h6">
                                        {route[key]}
                                      </Typography>
                                    )
                                  }
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                    <Grid item lg={1} md={1} xs={false} />
                  </>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ViewRoute;
