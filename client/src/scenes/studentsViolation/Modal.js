import { useState } from "react";
import {
  Button,
  Input,
  Space,
  Form,
  Col,
  Modal,
  Drawer,
  Descriptions,
  Tag,
} from "antd";
import {
  RollbackOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { toast, Bounce } from "react-toastify";
const { TextArea } = Input;

export const ViewDetailsMOdal = (props) => {
  const [form] = Form.useForm();
  const {
    viewDetailsData,
    viewDetailsModal,
    setViewDetailsData,
    setViewDetailsModal,
    violationDataFetch,
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
    violationDataFetch();
  };

  const onFinishUpdate = async (values) => {
    values.requestStatus = requestStatusChange;
    const data = await fetch(`/api/violation/status/${viewDetailsData._id}`, {
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
      violationDataFetch();
      setRequestStatusChange("");
      setAddNoteModal(false);
      setViewDetailsData("");
      form.resetFields();
    }
  };
  console.log(viewDetailsData);
  const onFinishUpdateFailed = async () => {};
  return (
    <>
      {/* <ToastContainer /> */}
      <Drawer
        title="Student Violation"
        placement="right"
        width={900}
        onClose={() => {
          setViewDetailsModal(false);
          setViewDetailsData();
        }}
        open={viewDetailsModal}
        styles={{ body: { paddingBottom: 80 } }}
        footer={[
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
            <Button
              style={{ marginRight: "10px" }}
              type="primary"
              icon={<CheckCircleOutlined />}
              key="approve"
              onClick={() => {
                buttonClick("COMPLETED");
              }}
            >
              COMPLETED
            </Button>
          ) : null,
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
            <Button
              style={{ marginRight: "10px" }}
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              key="reject"
              onClick={() => {
                buttonClick("INCOMPLETE");
              }}
            >
              INCOMPLETE
            </Button>
          ) : null,
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
            <Button
              style={{ marginRight: "10px" }}
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
        <Descriptions
          title="Profile Information"
          layout="horizontal"
          column={1}
          bordered
        >
          <Descriptions.Item label="First Name">
            {viewDetailsData?.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Middle Name">
            {viewDetailsData?.middleName}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {viewDetailsData?.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Student ID">
            {viewDetailsData?.studentId}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Number">
            {viewDetailsData?.contact}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {viewDetailsData?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {viewDetailsData?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Creation Date" span={2}>
            {new Date(viewDetailsData.created).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions
          title="Violation Details"
          layout="horizontal"
          column={1}
          bordered
        >
          <Descriptions.Item label="Violation">
            {viewDetailsData?.violation}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Violation">
            {viewDetailsData?.violationDate}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                viewDetailsData?.violationStatus === "IN PROGRESS"
                  ? "blue"
                  : viewDetailsData?.violationStatus === "COMPLETED"
                  ? "green"
                  : viewDetailsData?.violationStatus === "CANCELLED"
                  ? "red"
                  : "orange"
              }
            >
              {viewDetailsData?.violationStatus}
            </Tag>
          </Descriptions.Item>
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
