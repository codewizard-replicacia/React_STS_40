
import { Box, IconButton, Checkbox, Grid, makeStyles, Table, TableBody, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BASE_URL, PATH_TRIP } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";
import { tripViewConfig } from "../../utils/display_configuration";
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

const ViewTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const styles = useStyles();

  const [trip, setTrip] = useState({});
  const [RouteName, setRouteName] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTripById = async () => {
        const TripResponse = await makeApiCall(
          `${BASE_URL}${PATH_TRIP}(${id})`
        );
        const TripJsonResp = await TripResponse.json();
        setTrip(TripJsonResp);
        const RouteNameResponse = await makeApiCall(
          `${BASE_URL}${PATH_TRIP}(${id})/Route`
        );
        const RouteNameJsonResp = await RouteNameResponse.json();
        setRouteName(RouteNameJsonResp.RouteName);
      };
      fetchTripById();
    }
  }, [id]);

  return (
    <>
      {trip && (
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
                  View Trip
                </Typography>
                <IconButton
                  onClick={() => navigate(`/Trips/edit/${id}`)}
                  style={{ width: "42px", height: "42px" }}
                  color="primary"
                  size="small"
                >
                  <img src="/tabler_edit.svg" alt="edit Trips" />
                </IconButton>
              </Box>
            </Grid>
            <Box marginTop={2} className="form-container">
              <Grid container item lg={12} xs={12}>
                {Object.keys(tripViewConfig).map((config, ind) => (
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
                            {tripViewConfig[config].map(
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
                                    key === "TripRoute" ? (
                                      <Typography variant="h6">
                                        {RouteName}
                                      </Typography>
                                    ) : 
                                      type === "date" ? (
                                      <Typography variant="h6">
                                        {trip[key] !== null &&
                                          moment.utc(trip[key]).format(
                                            "DD-MMMM-YYYY HH:mm:ss A"
                                          )}
                                      </Typography>
                                    ) : 
                                    type === "boolean" ? (
                                      <Checkbox
                                        checked={trip[key] || false}
                                        disabled
                                      />
                                    ) : (
                                      <Typography variant="h6">
                                        {trip[key]}
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

export default ViewTrip;
