import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./style.css";

const Dashboard = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();
  const onDownloadClick = () => {
    history("/reports");
    setSelected("Reports");
  };

  const {
    fetchData,
    dashboardData,
    upcomingData,
    setSelected,
    appointmentData,
    appointmentDataFetch,
    upcomingStudentData,
  } = props;

  useEffect(() => {
    fetchData();
    appointmentDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(appointmentData);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="DASHBOARD"
          subtitle="Welcome to Guidance Counseling Management System"
        />
        <Box>
          {loginData?.body?.userType !== "STUDENT" ? (
            <>
              <Button
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
                onClick={() => onDownloadClick()}
              >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download Reports
              </Button>
            </>
          ) : null}
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {loginData?.body?.userType !== "STUDENT" ? (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={dashboardData?.request}
                subtitle="Student Performance Record"
                progress="0.75"
                increase="+14%"
                icon={
                  <PersonIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={dashboardData?.appointment}
                subtitle="Appointments"
                progress="0.50"
                increase="+21%"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={dashboardData?.student}
                subtitle="Students"
                progress="0.30"
                increase="+5%"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={dashboardData?.violation}
                subtitle="STUDENT VIOLATION"
                progress="0.50"
                increase="+43%"
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            {/* ROW 2 */}
            <Box
              gridColumn="span 8"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Violation Received Metrics
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    {dashboardData?.violation}
                  </Typography>
                </Box>
                <Box>
                  <IconButton>
                    <DownloadOutlinedIcon
                      sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box height="400px" m="-20px 0 0 0">
                <LineChart isDashboard={true} />
              </Box>
            </Box>
            <Box
              gridColumn="span 4"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                >
                  Upcoming Appointments
                </Typography>
              </Box>
              {upcomingData
                ? upcomingData.map((transaction, i) => (
                    <Box
                      key={`${transaction.txId}-${i}`}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom={`4px solid ${colors.primary[500]}`}
                      p="15px"
                    >
                      <Box>
                        <Typography
                          color={colors.greenAccent[500]}
                          variant="h5"
                          fontWeight="600"
                        >
                          {transaction.txId}
                        </Typography>
                        <Typography color={colors.grey[100]}>
                          {transaction.user}
                        </Typography>
                      </Box>
                      <Box color={colors.grey[100]}>{transaction.date}</Box>
                      <Box
                        backgroundColor={colors.greenAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                      >
                        {transaction.cost}
                      </Box>
                    </Box>
                  ))
                : null}
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={
                  appointmentData?.find((item) => item.name === "Approved")
                    ?.value || 0
                }
                subtitle="Approved Appointment"
                progress="0.75"
                increase="+14%"
                icon={
                  <AssignmentTurnedInIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={
                  appointmentData?.find((item) => item.name === "Pending")
                    ?.value || 0
                }
                subtitle="Pending Appointment"
                progress="0.50"
                increase="+21%"
                icon={
                  <PendingActionsIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={
                  appointmentData?.find((item) => item.name === "Rejected")
                    ?.value || 0
                }
                subtitle="Rejected Appointment"
                progress="0.30"
                increase="+5%"
                icon={
                  <EventBusyIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={
                  appointmentData?.find((item) => item.name === "Rescheduled")
                    ?.value || 0
                }
                subtitle="Rescheduled Appointment"
                progress="0.50"
                increase="+43%"
                icon={
                  <EditCalendarIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 5"
              gridRow="span 4"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <div className="chart-container">
                  <h2 className="chart-title">Appointment Status</h2>
                  <PieChart width={550} height={450}>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </Box>
            </Box>
            <Box
              gridColumn="span 7"
              gridRow="span 4"
              backgroundColor={colors.primary[400]}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                >
                  Upcoming Appointments
                </Typography>
              </Box>
              {upcomingStudentData
                ? upcomingStudentData.map((transaction, i) => (
                    <Box
                      key={`${transaction.txId}-${i}`}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom={`4px solid ${colors.primary[500]}`}
                      p="15px"
                    >
                      <Box>
                        <Typography
                          color={colors.greenAccent[500]}
                          variant="h5"
                          fontWeight="600"
                        >
                          {transaction.txId}
                        </Typography>
                        <Typography color={colors.grey[100]}>
                          {transaction.user}
                        </Typography>
                      </Box>
                      <Box color={colors.grey[100]}>{transaction.date}</Box>
                      <Box
                        backgroundColor={colors.greenAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                      >
                        {transaction.cost}
                      </Box>
                    </Box>
                  ))
                : null}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
