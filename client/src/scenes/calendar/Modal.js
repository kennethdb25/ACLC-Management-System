import { useState } from "react";
import {
  Descriptions,
  Drawer,
  Tag,
  Button,
  Input,
  Space,
  Form,
  Col,
  Modal,
} from "antd";
import {
  RollbackOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { ToastContainer, toast, Bounce } from "react-toastify";

const { TextArea } = Input;

export const ViewDetailsMOdal = (props) => {
  const [form] = Form.useForm();
  const {
    viewDetailsData,
    viewDetailsModal,
    setViewDetailsData,
    setViewDetailsModal,
    loginData,
    appointmentDataFetch,
  } = props;
  const [requestStatusChange, setRequestStatusChange] = useState(null);
  const [addNoteModal, setAddNoteModal] = useState(false);

  const buttonClick = async (action) => {
    setRequestStatusChange(action);
    setAddNoteModal(true);
    setViewDetailsModal(false);
  };

  const onConfirmUpdate = () => {
    form.submit();
    setAddNoteModal(false);
    appointmentDataFetch();
  };

  const onFinishUpdate = async (values) => {
    values.requestStatus = requestStatusChange;
    const data = await fetch(
      `/api/appointments/status/${viewDetailsData._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
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
      appointmentDataFetch();
      setRequestStatusChange("");
      setAddNoteModal(false);
      setViewDetailsData("");
      form.resetFields();
    }
  };
  const onFinishUpdateFailed = async () => {};
  return (
    <>
      <ToastContainer />
      <Drawer
        title="Appointment Details & Status"
        placement="right"
        width={900}
        onClose={() => {
          setViewDetailsModal(false);
          setViewDetailsData();
        }}
        open={viewDetailsModal}
        styles={{ body: { paddingBottom: 80 } }}
        footer={[
          loginData &&
          loginData?.body?.userType !== "STUDENT" &&
          viewDetailsData &&
          viewDetailsData.appointmentStatus === "PENDING" ? (
            <Button
              style={{ marginRight: "10px" }}
              type="primary"
              icon={<CheckCircleOutlined />}
              key="approve"
              onClick={() => {
                buttonClick("APPROVED");
              }}
            >
              APPROVE
            </Button>
          ) : null,
          loginData &&
          loginData?.body?.userType !== "STUDENT" &&
          viewDetailsData &&
          viewDetailsData.appointmentStatus === "PENDING" ? (
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              danger
              icon={<CloseCircleOutlined />}
              key="reject"
              onClick={() => {
                buttonClick("REJECTED");
              }}
            >
              REJECT
            </Button>
          ) : null,
          loginData &&
          loginData?.body?.userType === "STUDENT" &&
          viewDetailsData.appointmentStatus === "PENDING" ? (
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              key="cancel"
              onClick={() => {
                buttonClick("CANCELLED");
              }}
            >
              CANCEL
            </Button>
          ) : null,

          <Button
            danger
            style={{ marginRight: "10px" }}
            icon={<RollbackOutlined />}
            key="close"
            onClick={() => {
              setViewDetailsModal(false);
              setViewDetailsData();
            }}
          >
            CLOSE
          </Button>,
        ]}
        extra={<Space></Space>}
      >
        {/* User Profile */}
        <Descriptions
          title="Appointment Information"
          layout="horizontal"
          column={1}
          bordered
        >
          <Descriptions.Item label="Requestor Name">
            {viewDetailsData?.requestorName}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose">
            {viewDetailsData?.purpose}
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
          <Descriptions.Item label="Request Creation Date">
            {new Date(viewDetailsData?.created).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Date" span={2}>
            {viewDetailsData.date}
          </Descriptions.Item>
          <Descriptions.Item label="Time" span={2}>
            {viewDetailsData.time}
          </Descriptions.Item>
          <Descriptions.Item label="Appointment Status">
            <Tag
              color={
                viewDetailsData?.appointmentStatus === "APPROVED"
                  ? "green"
                  : viewDetailsData?.appointmentStatus === "REJECTED"
                  ? "red"
                  : "orange"
              }
            >
              {viewDetailsData?.appointmentStatus}
            </Tag>
          </Descriptions.Item>
          {viewDetailsData?.appointmentStatus === "REJECTED" ||
          viewDetailsData?.appointmentStatus === "APPROVED" ||
          viewDetailsData?.appointmentStatus === "CANCELLED" ? (
            <Descriptions.Item
              label={
                viewDetailsData?.appointmentStatus === "REJECTED"
                  ? "Rejection Notes"
                  : viewDetailsData?.appointmentStatus === "APPROVED"
                  ? "Approval Notes"
                  : "Cancellation Notes"
              }
              span={2}
            >
              {viewDetailsData.notes}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
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
