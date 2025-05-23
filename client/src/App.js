import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AccountLogin from "./scenes/accountLogin";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Accounts from "./scenes/accounts";
import Reports from "./scenes/reports";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import RequestForm from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import ForgotPassword from "./scenes/forgotPassword";
import { LoginContext } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider, Spin } from "antd";
import LoginHistory from "./scenes/loginHistory";
import StudentsViolation from "./scenes/studentsViolation";
import PageNotFound from "./scenes/PageNotFound";

const contentStyle = {
  padding: 50,
  // background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [dashboardData, setDashboardData] = useState();
  const [upcomingData, setUpcomingData] = useState();
  const [appointmentData, setAppointmentData] = useState();
  const [upcomingStudentData, setUpcomingStudentData] = useState();
  const [notificationData, setNotificationData] = useState();
  const [selected, setSelected] = useState("Dashboard");
  const [isNotifDrawerVisibile, setIsNotifDrawerVisible] = useState(false);
  const [data, setData] = useState("");
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();

  const LoginValidation = async () => {
    if (localStorage.getItem("accountToken")) {
      let validToken = localStorage.getItem("accountToken");
      const data = await fetch("/api/validate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: validToken,
        },
      });
      const res = await data.json();

      if (res.status === 401 || !res || !location.pathname === "/") {
        // console.log(res);
      } else {
        console.log("Verified User");
        setLoginData(res);
        history("/dashboard");
      }
    }
  };

  const getNotifications = async () => {
    let data;

    if (
      loginData?.body?.userType === "STUDENT" ||
      loginData?.body?.userType === "TEACHER"
    ) {
      data = await fetch(`/api/push-notification/${loginData?.body._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      data = await fetch("/api/push-admin-notification/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const res = await data.json();

    if (res.status === 200) {
      setNotificationData(res.body);
    }
  };

  const appointmentDataFetch = async () => {
    const data = await fetch(
      `/api/dashboard/student-count?studentId=${loginData?.body?.identification}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await data.json();

    if (res.status === 201) {
      setAppointmentData(res.body || []);
    }

    const upcomingData = await fetch(
      `/api/dashboard/student-upcoming?studentId=${loginData?.body?.identification}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const upcomingRes = await upcomingData.json();
    if (upcomingRes.status === 201) {
      setUpcomingStudentData(upcomingRes.body || []);
    }
  };

  const fetchData = async () => {
    const data = await fetch("/api/dashboard/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    if (res.status === 200) {
      setDashboardData(res.body || []);
    }

    const upcomingData = await fetch("/api/dashboard/upcoming", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const upcomingRes = await upcomingData.json();
    if (upcomingRes.status === 200) {
      setUpcomingData(upcomingRes.body || []);
    }
  };

  useEffect(() => {
    appointmentDataFetch();
    setTimeout(() => {
      LoginValidation();
    }, 3000);
    setTimeout(() => {
      setData(true);
    }, 3000);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#00b96b",
            borderRadius: 10,
            headerBg: "#00b96b",
            // Alias Token
            // colorBgContainer: '#e1e2fe',
          },
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {data ? (
            <div className="app">
              {loginData ? (
                <>
                  <Sidebar
                    isSidebar={isSidebar}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              ) : (
                <></>
              )}
              <main className="content">
                {loginData ? (
                  <>
                    <Topbar
                      isNotifDrawerVisibile={isNotifDrawerVisibile}
                      setIsNotifDrawerVisible={setIsNotifDrawerVisible}
                      setIsSidebar={setIsSidebar}
                      setData={setData}
                      notificationData={notificationData}
                      getNotifications={getNotifications}
                      setSelected={setSelected}
                    />
                  </>
                ) : (
                  <></>
                )}
                <Routes>
                  <Route
                    path="/"
                    element={<AccountLogin LoginValidation={LoginValidation} />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/dashboard"
                    element={
                      <Dashboard
                        fetchData={fetchData}
                        dashboardData={dashboardData}
                        upcomingData={upcomingData}
                        setSelected={setSelected}
                        appointmentData={appointmentData}
                        appointmentDataFetch={appointmentDataFetch}
                        upcomingStudentData={upcomingStudentData}
                      />
                    }
                  />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/students-information" element={<Contacts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/form" element={<RequestForm />} />
                  <Route path="/history" element={<LoginHistory />} />
                  <Route path="/violation" element={<StudentsViolation />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/appointment" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/*" element={<PageNotFound />} />
                </Routes>
              </main>
            </div>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                color: "white",
              }}
            >
              <Spin tip="Loading" size="large">
                {content}
              </Spin>
            </Box>
          )}
        </ThemeProvider>
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
