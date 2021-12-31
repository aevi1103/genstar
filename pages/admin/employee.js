import { useState } from "react";
import moment from "moment";
import { useSWRConfig } from "swr";
import Head from "next/head";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import Layout from "../../components/layout";
import { useLocaleString, useEmployee } from "../../utils/hooks";
import { baseUrl } from "../../utils/api";
import EmployeeForm from "../../components/admin/employee-form";
import RateForm from "../../components/admin/rate-form";

const DeleteButton = ({ employeeId, setIsModalVisible }) => {
  const { mutate } = useSWRConfig();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setDeleting(true);
      await fetch(`${baseUrl}/Employee/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsModalVisible(false);
      mutate(`${baseUrl}/Employee`);
      Modal.success({
        title: "Success",
        content: "User successfully deleted!",
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: JSON.stringify(error),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Tooltip title="Delete">
      <Popconfirm
        onConfirm={onDelete}
        title="Are you sure you want to delete this employee?"
        okText="Yes"
        cancelText="No"
      >
        <span className="cursor-pointer">
          {deleting ? <LoadingOutlined /> : <DeleteOutlined />}
        </span>
      </Popconfirm>
    </Tooltip>
  );
};

const Employee = () => {
  const { getLocaleDateString } = useLocaleString();
  const { employees = [], isLoading } = useEmployee();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  const [rateModalVisible, setRateModalVisible] = useState(false);

  const onEdit = (employee) => {
    const { dateHired, dateModified, dateCreated, empployeeId } = employee;
    setCurrentEmpId(empployeeId);
    form.setFieldsValue({
      ...employee,
      dateHired: dateHired && moment(dateHired),
      dateModified: dateModified && moment(dateModified),
      dateCreated: dateCreated && moment(dateCreated),
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      render: (text, record) => (
        <Space>
          <Tooltip title="Edit">
            <span className="cursor-pointer" onClick={() => onEdit(record)}>
              <EditOutlined />
            </span>
          </Tooltip>
          <DeleteButton
            employeeId={record.empployeeId}
            setIsModalVisible={setIsModalVisible}
          />
          <Tooltip title="Daily Rate">
            <span
              className="cursor-pointer"
              onClick={() => setRateModalVisible(true)}
            >
              <WalletOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "firstName",
      render: (text, { firstName, lastName }) => (
        <span>
          {lastName}, {firstName}
        </span>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Date Hired",
      dataIndex: "dateHired",
      render: (text, { dateHired }) =>
        dateHired && getLocaleDateString(dateHired),
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (text, { dateCreated }) => getLocaleDateString(dateCreated),
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      render: (text, { dateModified }) => getLocaleDateString(dateModified),
    },
  ];

  const dataSource = employees?.map((employee) => ({
    key: employee.empployeeId,
    ...employee,
  }));

  return (
    <>
      <Layout>
        <Head>
          <title>Employee</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <span className="text-2xl font-bold">Employees</span>
              </Col>
              <Col>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  Add Employee
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              loading={isLoading}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </Col>
        </Row>
      </Layout>

      <Modal
        visible={isModalVisible}
        title={currentEmpId ? "Edit Employee" : "Add Employee"}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentEmpId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Submit"
        okButtonProps={{
          loading: submitting,
        }}
      >
        <EmployeeForm
          setSubmitting={setSubmitting}
          setIsModalVisible={setIsModalVisible}
          currentEmpId={currentEmpId}
          form={form}
        />
      </Modal>

      <Modal
        title="Add Rate"
        visible={rateModalVisible}
        onCancel={() => setRateModalVisible(false)}
        okText="Submit"
      >
        <RateForm />
      </Modal>
    </>
  );
};

export default Employee;
