import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { LoginContext } from "../../context/Context";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const { firstName, lastName, userType } = loginData?.body;

  const { selected, setSelected } = props;

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ height: "100vh" }}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/logo.jpeg`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {`${firstName} ${lastName}`}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {`${userType}`}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Tooltip title="Dashboard">
              <p style={{ margin: "0" }}>
                <Item
                  title="Dashboard"
                  to="/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </p>
            </Tooltip>
            {loginData?.body?.userType !== "STUDENT" &&
            loginData?.body?.userType !== "TEACHER" ? (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Data
                </Typography>
                <Tooltip title="Manage Accounts">
                  <p style={{ margin: "0" }}>
                    <Item
                      title="Manage Accounts"
                      to="/accounts"
                      icon={<PeopleOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </p>
                </Tooltip>
                <Tooltip title="Students Information">
                  <p style={{ margin: "0" }}>
                    <Item
                      title="Students Information"
                      to="/students-information"
                      icon={<ContactsOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </p>
                </Tooltip>
                <Tooltip title="Reports">
                  <p style={{ margin: "0" }}>
                    <Item
                      title="Reports"
                      to="/reports"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </p>
                </Tooltip>
              </>
            ) : null}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            {loginData?.body?.userType !== "STUDENT" ? (
              <Tooltip title="Performance">
                <p style={{ margin: "0" }}>
                  <Item
                    title="Performance"
                    to="/form"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </p>
              </Tooltip>
            ) : null}

            {loginData?.body?.userType !== "TEACHER" ? (
              <Tooltip title="Request an Appointment">
                <p style={{ margin: "0" }}>
                  <Item
                    title="Request an Appointment"
                    to="/appointment"
                    icon={<CalendarTodayOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </p>
              </Tooltip>
            ) : null}
            {loginData?.body?.userType !== "STUDENT" &&
            loginData?.body?.userType !== "TEACHER" ? (
              <>
                <Tooltip title="Student Violations">
                  <p style={{ margin: "0" }}>
                    <Item
                      title="Student Violations"
                      to="/violation"
                      icon={<WarningAmberOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </p>
                </Tooltip>
                <Tooltip title="Login History">
                  <p style={{ margin: "0" }}>
                    <Item
                      title="Login History"
                      to="/history"
                      icon={<HistoryToggleOffOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </p>
                </Tooltip>
              </>
            ) : null}
            <Tooltip title="FAQ Page">
              <p style={{ margin: "0" }}>
                <Item
                  title="FAQ Page"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </p>
            </Tooltip>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
