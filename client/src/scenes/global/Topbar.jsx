import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { LoginContext } from '../../context/Context';
import UserProfileModal from './UserProfileModal/UserProfileModal';
import { List, Badge, App, Avatar, Drawer, Empty } from 'antd';
import VirtualList from 'rc-virtual-list';


const Topbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useNavigate();

  const { isNotifDrawerVisibile, setIsNotifDrawerVisible, setData, notificationData, getNotifications, setSelected } = props;

  // mark as read
  // const markAsRead = (id) => {
  //   setNotificationList((prev) => {
  //     prev.map((item) =>
  //       item.id === id ? { ...item, read: true } : item
  //     );
  //   });
  // };

  // show notifcations
  const openNotification = async (item) => {
    const data = await fetch(`/api/push-notification/update-read/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    if (res.status === 201) {
      getNotifications();
      history(`/${item.type.toLowerCase()}`);
      setSelected(item.type === "Appointment" ? "Request an Appointment" : "Performance");
      setIsNotifDrawerVisible(false);
    }
    console.log(res);
  };

  const user = {
    name: `${loginData?.body.firstName} ${loginData?.body.lastName}`,
    id: loginData?.body.identification,
    contact: loginData?.body.contact,
    email: loginData?.body.email,
    gender: loginData?.body.gender,
    address: loginData?.body.address,
    user: loginData?.body?.userType,
    acctStatus: loginData?.body.acctStatus
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      {/* SEARCH BAR */}

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => { setIsNotifDrawerVisible(true); getNotifications(); }}>
          <Badge count={notificationData.length}>
            <NotificationsOutlinedIcon style={{ color: colors.grey[100] }} />
          </Badge>
        </IconButton>
        <IconButton onClick={() => setIsModalVisible(true)} >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* User Profile Modal */}
      <UserProfileModal
        user={user}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setData={setData}
      />

      {/* Notification List Drawer */}
      <Drawer
        title="NOTIFICATION LIST"
        placement='right'
        onClose={() => setIsNotifDrawerVisible(false)}
        open={isNotifDrawerVisibile}
        height="100%"
      >
        <List>
          {notificationData.length > 0 ? (
            <>
              <VirtualList
                data={notificationData}
                height='100%'
                itemHeight={47}
                itemKey="email"
              // onScroll={onScroll}
              >
                {item => (
                  <List.Item key={item._id}
                    style={{
                      cursor: "pointer",
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 5
                    }}
                    onClick={() => openNotification(item)}
                  >
                    <List.Item.Meta
                      key={item._id}
                      avatar={<Avatar icon={<NotificationsOutlinedIcon />} />}
                      title={item.title}
                      description={item.description}
                    />
                    <div style={{ color: 'red' }}>New</div>
                  </List.Item>
                )}
              </VirtualList>
            </>
          ) :
            <>
              <Empty />
            </>
          }
        </List>
      </Drawer>
    </Box>
  );
};

export default Topbar;
