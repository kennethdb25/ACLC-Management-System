import { useState, useContext, useRef, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { tokens } from '../../theme';
import { Table, Divider, Drawer, Space, Form, Row, Col, Input, Tag, Radio, InputNumber, Popconfirm, message } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { LoginContext } from '../../context/Context';
import Highlighter from "react-highlight-words";
// import moment from 'moment';
import { ViewDetailsMOdal } from './Modal';
// import dayjs from 'dayjs';

const RequestForm = () => {
  const [form] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [visible, setVisible] = useState(false);
  const [requestForms, setRequestForms] = useState();
  const [viewDetailsData, setViewDetailsData] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const initialValues = {
    id: updateData?._id,
    studentName: updateData?.studentName,
    studentId: updateData?.studentId,
    contact: updateData?.contact,
    gender: updateData?.gender,
    email: updateData?.email,
    adviser: updateData?.adviser,
    course: updateData?.course,
    yearSec: updateData?.yearSec,
    subjects: updateData?.subjects,
  };


  //Pagination
  let requestCount = 0;
  for (var request in requestForms) {
    if (requestForms.hasOwnProperty(request)) {
      requestCount++;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [paginationRequest, setPaginationRequest] = useState({
    defaultCurrent: 1,
    pageSize: 6,
    total: requestCount,
  });

  const getRequestForms = async () => {
    const data = await fetch('/api/performance/all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();

    if (res.status === 200) {
      setRequestForms(res.body);
    }
  };

  const onViewDetails = async (record, e) => {
    form.resetFields();
    e.defaultPrevented = true;
    setViewDetailsData(record);
    setUpdateData(record);
    setViewDetailsModal(true);
  };

  const toUpdateRecord = () => {
    form.resetFields();
    setViewDetailsModal(false);
    setViewUpdateModal(true);
  };

  const onCloseUpdate = () => {
    setUpdateData('');
    setViewDetailsData('');
    setViewUpdateModal(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const correct = values.subjects.map((value) => {
      value.status = value['Grade(%)'] >= 75 && value['Attendance(%)'] >= 75 ? "Passing" : "Failing";
      return value;
    });
    values.subjects = correct;

    const data = await fetch("/api/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 200) {
      // getRequestForms();
      setVisible(false);
      setRequestForms('');
      form.resetFields();
      toast.success("Added Successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.error(res.body, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const onFinishFailed = (error) => {
    console.log(error);
  };

  const onClose = () => {
    setViewUpdateModal(false);
    setVisible(false);
    form.resetFields();
  };

  // Table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 100,
            }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              confirm({
                closeDropdown: true,
              });
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: colors.grey[100],
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      width: "10%",
      ...getColumnSearchProps("studentName"),
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      width: "10%",
      ...getColumnSearchProps("studentId"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "10%",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: "10%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (_, { status }) => {
        let color;
        if (status === 'Completed') {
          color = 'green';
        } else if (status === 'Added') {
          color = 'blue';
        } else {
          color = 'red';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Added",
          value: "Added",
        },
        {
          text: "Work In Progress",
          value: "Work In Progress",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "10%",
      render: (record) => (
        <>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={(e) => {
                onViewDetails(record, e);
              }}
            >
              <VisibilityIcon sx={{ mr: "10px", marginTop: "2px" }} />
              VIEW DETAILS
            </Button>
          </div>
        </>
      ),
    },
  ];

  const onFinishUpdate = async (values) => {
    const correct = values.subjects.map((value) => {
      value.status = value['Grade(%)'] >= 75 && value['Attendance(%)'] >= 75 ? "Passing" : "Failing";
      return value;
    });
    values.subjects = correct;
    const data = await fetch(`/api/performance/${viewDetailsData?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    form.resetFields();
    getRequestForms();
    onCloseUpdate();
    const res = await data.json();

    if (res.status === 200) {
      toast.success("Added Successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.error(res.body, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const cancel = e => {
    console.log(e);
    message.info('CANCELLED');
  };

  useEffect(() => {
    getRequestForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = window.innerWidth;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="Monitoring Academic Performance" subtitle="Student Academic Perfomance" />
      {loginData?.body?.userType === "GUIDANCE OFFICER" ? (
        <>
          <Popconfirm
            title="ADD STUDENT"
            description="Are you sure to add a record?"
            onConfirm={() => {
              setVisible(true);
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={() => { form.resetFields(); }}
            >
              <NoteAddOutlinedIcon sx={{ mr: "10px" }} />
              ADD STUDENT
            </Button>
          </Popconfirm>
        </>
      ) : null}
      <Divider orientation="center" orientationMargin="0" style={{ borderColor: 'blue' }}>
        <Header subtitle="PERFORMANCE LISTS" />
      </Divider>
      <Table columns={columns} dataSource={requestForms} pagination={paginationRequest} />

      {/* Request Form Drawer  */}
      <Drawer
        title="ADD STUDENT"
        placement={width >= 450 ? 'right' : 'left'}
        onClose={onClose}
        open={visible}
        height="100%"
        width={800}
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={() => form.submit()}
            >
              <CheckCircleOutlinedIcon sx={{ mr: "10px" }} />
              CONFIRM
            </Button>
          </div>,
        ]}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Form
              form={form}
              labelCol={{
                span: 24,
              }}
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{
                width: "100%",
              }}
            >
              <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
                <h3>STUDENT INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={24} md={8} layout="vertical">
                  <Form.Item
                    label="Student Name"
                    name="studentName"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student name!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter student name" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Student ID"
                    name="studentId"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your student ID!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your student ID" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Contact Number"
                    name="contact"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your 11 digits mobile number!",
                      },
                      { whitespace: true },
                      { min: 11, message: 'Contact Number must be at least 11 characters' },
                      { max: 11, message: 'Contact Number cannot be longer than 11 characters' },
                      {
                        pattern:
                          /[0-9]/,
                        message:
                          "Invalid Character",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your 11 digits mobile number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please select your gender!",
                      },
                    ]}
                  >
                    <Radio.Group style={{ width: "100%" }}>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Email"
                    name="email"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Adviser Name"
                    name="adviser"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Please input adviser name!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter adviser name" />
                  </Form.Item>
                </Col>
              </Row><Row gutter={12}>
                <Col xs={24} md={8} layout="vertical">
                  <Form.Item
                    label="Course"
                    name="course"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student course!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter student course" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Year and Section"
                    name="yearSec"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student year and section!",
                      },
                    ]}
                  >
                    <Input placeholder="(e.g. 4A)" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
                <h3>PERFORMANCE INFORMATION</h3>
              </Divider>
              <Form.List name="subjects">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='start'>
                        <Form.Item
                          {...restField}
                          name={[name, 'Subject']}
                          rules={[{ required: true, message: "Missing Subject Name" }]}
                        >
                          <Input placeholder='Subject Name' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'Grade(%)']}
                          rules={[{ required: true, type: "number", min: 0, max: 100, message: '0-100 only' }]}
                        >
                          <InputNumber placeholder='Grade' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'Attendance(%)']}
                          rules={[{ required: true, type: "number", min: 0, max: 100, message: '0-100 only' }]}
                        >
                          <InputNumber placeholder='Attendance' />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        sx={{
                          backgroundColor: colors.blueAccent[500],
                          color: colors.grey[100],
                          fontSize: "14px",
                          fontWeight: "bold",
                          padding: "10px 20px",
                        }}
                        onClick={() => add()}
                      >
                        <PlusOutlined />
                        ADD SUBJECT
                      </Button>
                      {/* <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>Add Subject</Button> */}
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Col>
        </Row>
      </Drawer>

      <Drawer
        title="UPDATE STUDENT RECORD"
        placement={width >= 450 ? 'right' : 'left'}
        onClose={onCloseUpdate}
        open={viewUpdateModal}
        height="100%"
        width={800}
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={() => form.submit()}
            >
              <CheckCircleOutlinedIcon sx={{ mr: "10px" }} />
              CONFIRM
            </Button>
          </div>,
        ]}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Form
              form={form}
              labelCol={{
                span: 24,
              }}
              layout="horizontal"
              initialValues={initialValues}
              onFinish={onFinishUpdate}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{
                width: "100%",
              }}
            >
              <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
                <h3>STUDENT INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={24} md={8} layout="vertical">
                  <Form.Item
                    label="Student Name"
                    name="studentName"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student name!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter student name" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Student ID"
                    name="studentId"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your student ID!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your student ID" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Contact Number"
                    name="contact"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your 11 digits mobile number!",
                      },
                      { whitespace: true },
                      { min: 11, message: 'Contact Number must be at least 11 characters' },
                      { max: 11, message: 'Contact Number cannot be longer than 11 characters' },
                      {
                        pattern:
                          /[0-9]/,
                        message:
                          "Invalid Character",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your 11 digits mobile number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please select your gender!",
                      },
                    ]}
                  >
                    <Radio.Group style={{ width: "100%" }}>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Email"
                    name="email"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Adviser Name"
                    name="adviser"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Please input adviser name!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter adviser name" />
                  </Form.Item>
                </Col>
              </Row><Row gutter={12}>
                <Col xs={24} md={8} layout="vertical">
                  <Form.Item
                    label="Course"
                    name="course"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student course!",
                      },
                      {
                        pattern: /^[a-zA-Z_ ]*$/,
                        message: "Numbers or special character are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter student course" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Year and Section"
                    name="yearSec"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input student year and section!",
                      },
                    ]}
                  >
                    <Input placeholder="(e.g. 4A)" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
                <h3>PERFORMANCE INFORMATION</h3>
              </Divider>
              <Form.List name="subjects">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='start'>
                        <Form.Item
                          {...restField}
                          name={[name, 'Subject']}
                          rules={[{ required: true, message: "Missing Subject Name" }]}
                        >
                          <Input placeholder='Subject Name' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'Grade(%)']}
                          rules={[{ required: true, type: "number", min: 0, max: 100, message: '0-100 only' }]}
                        >
                          <InputNumber placeholder='Grade' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'Attendance(%)']}
                          rules={[{ required: true, type: "number", min: 0, max: 100, message: '0-100 only' }]}
                        >
                          <InputNumber placeholder='Attendance' />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        sx={{
                          backgroundColor: colors.blueAccent[500],
                          color: colors.grey[100],
                          fontSize: "14px",
                          fontWeight: "bold",
                          padding: "10px 20px",
                        }}
                        onClick={() => add()}
                      >
                        <PlusOutlined />
                        ADD SUBJECT
                      </Button>
                      {/* <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>Add Subject</Button> */}
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Col>
        </Row>
      </Drawer>

      {/* View Details Modal */}
      {viewDetailsData ? (
        <ViewDetailsMOdal
          viewDetailsData={viewDetailsData}
          viewDetailsModal={viewDetailsModal}
          setViewDetailsData={setViewDetailsData}
          setViewDetailsModal={setViewDetailsModal}
          loginData={loginData}
          getRequestForms={getRequestForms}
          toUpdateRecord={toUpdateRecord}
        />
      ) : null}
    </Box >
  );
};



export default RequestForm;
