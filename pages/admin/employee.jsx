import { useState } from "react";
import moment from "moment";
import Link from "next/link";
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
import RateModal from "../../components/admin/rate-modal";

const DeleteButton = ({ employeeId, setIsModalVisible }) => {
  const { mutate } = useSWRConfig();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`${baseUrl}/Employee/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsModalVisible(false);
        mutate(`${baseUrl}/Employee`);
        Modal.success({
          title: "Success",
          content: "User successfully deleted!",
        });
      } else {
        Modal.error({
          title: "Error",
          content: "Something went wrong",
        });
      }
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
            <span
              className="cursor-pointer"
              onClick={() => onEdit(record)}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
            >
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
              onClick={() => {
                setRateModalVisible(true);
                setCurrentEmpId(record.empployeeId);
              }}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
            >
              <WalletOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Personal Info",
      children: [
        {
          title: "Name",
          dataIndex: "firstName",
          render: (text, { firstName, lastName, empployeeId }) => (
            <Tooltip title="Click to see employee info">
              <a>
                <Link href={`/employee/${empployeeId}`}>
                  <a href>
                    {lastName}, {firstName}
                  </a>
                </Link>
              </a>
            </Tooltip>
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
      ],
    },
    {
      title: "Rate per Day",
      dataIndex: "dailyRate",
      render: (text, { rate }) => rate?.ratePerDay,
    },
    {
      title: "Benefits",
      children: [
        {
          title: "SSS",
          dataIndex: "sss",
          render: (text, { rate }) => rate?.sss,
        },
        {
          title: "Pag-ibig",
          dataIndex: "rate",
          render: (text, { rate }) => rate?.pagibig,
        },
      ],
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

      <RateModal
        rateModalVisible={rateModalVisible}
        setRateModalVisible={setRateModalVisible}
        employeeId={currentEmpId}
      />
    </>
  );
};

export default Employee;
