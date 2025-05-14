import { useState } from "react";
import {
  Button,
  Input,
  Space,
  Form,
  Col,
  Modal,
  Typography,
  Drawer,
  Descriptions,
  Tag,
  Table,
} from "antd";
import {
  RollbackOutlined,
  CheckCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { ToastContainer, toast, Bounce } from "react-toastify";

const { Title } = Typography;
const { TextArea } = Input;

export const ViewDetailsMOdal = (props) => {
  const [form] = Form.useForm();
  const {
    viewDetailsData,
    viewDetailsModal,
    setViewDetailsData,
    setViewDetailsModal,
    getRequestForms,
    toUpdateRecord,
  } = props;
  const [requestStatusChange, setRequestStatusChange] = useState(null);
  const [addNoteModal, setAddNoteModal] = useState(false);

  const onConfirmUpdate = () => {
    form.submit();
  };

  const onFinishUpdate = async (values) => {
    values.requestStatus = requestStatusChange;
    const data = await fetch(`/api/requests/status/${viewDetailsData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const res = await data.json();

    if (res.status === 200) {
      toast.success(`${requestStatusChange} SUCCESSFULLY`, {
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
      getRequestForms();
      setRequestStatusChange("");
      setAddNoteModal(false);
      setViewDetailsData("");
      form.resetFields();
    }
  };
  const onFinishUpdateFailed = async () => {};

  console.log(viewDetailsData);

  const gradeColumns = [
    {
      title: "Subject",
      dataIndex: "Subject",
      key: "Subject",
    },
    {
      title: "Grade(%)",
      dataIndex: "Grade(%)",
      key: "Grade(%)",
      render: (grade) => (
        <Tag color={grade >= 90 ? "green" : grade >= 75 ? "green" : "red"}>
          {grade}
        </Tag>
      ),
    },
    {
      title: "Attendance(%)",
      dataIndex: "Attendance(%)",
      key: "Attendance(%)",
      render: (grade) => (
        <Tag color={grade >= 90 ? "green" : grade >= 75 ? "green" : "red"}>
          {grade}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Passing" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];
  return (
    <>
      <ToastContainer />
      <Drawer
        title="Student Details & Performance"
        placement="right"
        width={900}
        onClose={() => {
          setViewDetailsModal(false);
          setViewDetailsData();
        }}
        open={viewDetailsModal}
        styles={{ body: { paddingBottom: 80 } }}
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              key="approve"
              onClick={() => toUpdateRecord()}
            >
              UPDATE
            </Button>
            <Button
              danger
              icon={<RollbackOutlined />}
              key="close"
              onClick={() => {
                setViewDetailsModal(false);
                setViewDetailsData();
              }}
            >
              CLOSE
            </Button>
          </div>,
        ]}
        extra={<Space></Space>}
      >
        {/* User Profile */}
        <Descriptions
          title="Profile Information"
          layout="horizontal"
          column={1}
          bordered
        >
          <Descriptions.Item label="Student Name">
            {viewDetailsData?.studentName}
          </Descriptions.Item>
          <Descriptions.Item label="Student ID">
            {viewDetailsData?.studentId}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {viewDetailsData?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Number">
            {viewDetailsData?.contact}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {viewDetailsData?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Creation Date" span={2}>
            {new Date(viewDetailsData.created).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={viewDetailsData?.status === "Added" ? "blue" : "green"}>
              {viewDetailsData?.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {/* Performance Table */}
        <div style={{ marginTop: 32 }}>
          <Title level={5}>Performance Record</Title>
          <Table
            columns={gradeColumns}
            dataSource={viewDetailsData.subjects}
            rowKey={(record) => record.Subject}
            pagination={false}
            bordered
          />
        </div>
      </Drawer>

      <Modal
        key="addNotesModal"
        title="ADD NOTE"
        width={400}
        open={addNoteModal}
        onCancel={() => {
          setAddNoteModal(false);
        }}
        footer={[
          <Button
            icon={<FormOutlined />}
            type="primary"
            key="update"
            onClick={() => onConfirmUpdate()}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>,
          <Button
            type="primary"
            danger
            icon={<RollbackOutlined />}
            key="cancel"
            onClick={() => {
              setAddNoteModal(false);
              setViewDetailsData("");
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 12,
          }}
          layout="horizontal"
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishUpdateFailed}
          autoComplete="off"
          style={{
            width: "100%",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
            <Form.Item
              label="Notes"
              name="notes"
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
                  message: "Please input notes!",
                },
              ]}
            >
              <TextArea
                rows={5}
                maxLength={500}
                showCount
                placeholder="Enter Notes"
              />
            </Form.Item>
            <br />
            <br />
          </Col>
        </Form>
      </Modal>
    </>
  );
};
