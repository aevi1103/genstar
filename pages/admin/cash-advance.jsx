import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import moment from "moment";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  Button,
  Table,
  Space,
  Tooltip,
  DatePicker,
  InputNumber,
} from "antd";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import Layout from "../../components/layout";
import { useLocaleString, useLocaleDateString } from "../../utils/hooks";
import { baseUrl } from "../../utils/api";

const { TextArea } = Input;
const dateFormat = "MM/DD/YYYY";

export default function CashAdvance() {
  const { getLocaleDateString } = useLocaleString();
  const { getLocaleDateString: formatDate } = useLocaleDateString();
  const [filterForm] = Form.useForm();
  const [cashAdvanceForm] = Form.useForm();
  const [cashAdvancePaymentForm] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [cashAdvanceVisible, setCashAdvanceVisible] = useState(false);
  const [cashAdvancePaymentVisible, setCashAdvancePaymentVisible] =
    useState(false);

  const [cashAdvanceSubmitLoading, setCashAdvanceSubmitLoading] =
    useState(false);
  const [cashAdvancePaymentSubmitLoading, setCashAdvanceSubmitPaymentLoading] =
    useState(false);

  const getData = async (params) => {
    setLoading(true);
    try {
      const response = await axios(`${baseUrl}/cashadvance`, {
        params,
      });
      const hours = response.data;
      const data = hours?.map((hour) => ({
        key: hour.empployeeId,
        ...hour,
        name: `${hour.lastName}, ${hour.firstName}`,
      }));
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      Modal.error({
        title: "Error",
        content: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFilter = async ({ name }) => {
    getData({
      name: name?.length === 0 ? "" : name,
    });
  };

  const onAddCashAdvance = (record) => {
    setRowData(record);
    setCashAdvanceVisible(true);
  };

  const onAddCashAdvancePayment = (record) => {
    setRowData(record);
    setCashAdvancePaymentVisible(true);
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      width: 50,
      render: (text, record) => (
        <Space>
          <Tooltip title="Add Cash Advance">
            <span
              className="cursor-pointer"
              onClick={() => onAddCashAdvance(record)}
              onKeyPress={() => {}}
              tabIndex={0}
              role="button"
            >
              <UserAddOutlined />
            </span>
          </Tooltip>
          <Tooltip title="Pay Cash Advance">
            <span
              className="cursor-pointer"
              onClick={() => onAddCashAdvancePayment(record)}
              onKeyPress={() => {}}
              tabIndex={0}
              role="button"
            >
              <UserDeleteOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Total Cash Advance",
      dataIndex: "totalCashAdvance",
    },
    {
      title: "Total Cash Advance Paid",
      dataIndex: "totalCashAdvancePaid",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
  ];

  const getDataFromForm = () => {
    const name = filterForm.getFieldValue("name");
    getData({
      name: name?.length === 0 ? "" : name,
    });
  };

  const onAddCashAdvanceFinish = async (values) => {
    try {
      setCashAdvanceSubmitLoading(true);
      await axios.post(`${baseUrl}/cashadvance`, {
        ...values,
        employeeId: rowData?.empployeeId,
      });
      setCashAdvanceVisible(false);
      Modal.success({
        title: "Cash Advance Successfully Added!",
      });
      cashAdvanceForm.resetFields();
      getDataFromForm();
    } catch (error) {
      Modal.error({
        title: "Error",
        content: error?.response?.data ?? JSON.stringify(error),
      });
    } finally {
      setCashAdvanceSubmitLoading(false);
    }
  };

  const onAddCashAdvancePaymentFinish = async (values) => {
    try {
      setCashAdvanceSubmitPaymentLoading(true);
      await axios.post(`${baseUrl}/cashadvance/payment`, {
        ...values,
        employeeId: rowData?.empployeeId,
      });
      setCashAdvancePaymentVisible(false);
      Modal.success({
        title: "Cash Advance Payment Successfully Added!",
      });
      cashAdvancePaymentForm.resetFields();
      getDataFromForm();
    } catch (error) {
      Modal.error({
        title: "Error",
        content: error?.response?.data ?? JSON.stringify(error),
      });
    } finally {
      setCashAdvanceSubmitPaymentLoading(false);
    }
  };

  const expandedRowRender = (pageData) => {
    const { cashAdvances, cashAdvancePayment } = pageData;

    const cashAdvancesColumns = [
      {
        title: "Date",
        dataIndex: "date",
        render: (text, { date }) => formatDate(date),
      },
      {
        title: "Amount",
        dataIndex: "amount",
      },
      {
        title: "Notes",
        dataIndex: "notes",
      },
      {
        title: "Date Modified",
        dataIndex: "dateModified",
        render: (text, { dateModified }) => getLocaleDateString(dateModified),
      },
      {
        title: "Date Created",
        dataIndex: "dateCreated",
        render: (text, { dateCreated }) => getLocaleDateString(dateCreated),
      },
    ];

    const cashAdvanceTitle = () => (
      <div className="font-bold">Cash Advance History</div>
    );

    const cashAdvancesPaymentColumns = [
      {
        title: "Date",
        dataIndex: "date",
        render: (text, { date }) => formatDate(date),
      },
      {
        title: "Amount Paid",
        dataIndex: "amountPaid",
      },
      {
        title: "Notes",
        dataIndex: "notes",
      },
      {
        title: "Date Modified",
        dataIndex: "dateModified",
        render: (text, { dateMnodified }) => getLocaleDateString(dateMnodified),
      },
      {
        title: "Date Created",
        dataIndex: "dateCreated",
        render: (text, { dateCreated }) => getLocaleDateString(dateCreated),
      },
    ];

    const cashAdvancePaymentTitle = () => (
      <div className="font-bold">Cash Advance Payments History</div>
    );

    return (
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Table
            columns={cashAdvancesColumns}
            dataSource={cashAdvances.map((item) => ({
              ...item,
              key: item.cashAdvanceId,
            }))}
            pagination={false}
            title={cashAdvanceTitle}
            size="small"
          />
        </Col>
        <Col span={12}>
          <Table
            columns={cashAdvancesPaymentColumns}
            dataSource={cashAdvancePayment.map((item) => ({
              ...item,
              key: item.cashAdvancePaymentId,
            }))}
            pagination={false}
            title={cashAdvancePaymentTitle}
            size="small"
          />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Layout>
        <Head>
          <title>CashAdvance</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <span className="text-2xl font-bold">Cash Advance</span>
          </Col>
          <Col span={24}>
            <Form layout="inline" form={filterForm} onFinish={onFilter}>
              <Form.Item name="name" label="Employee Name">
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                  Filter
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              bordered
              size="small"
              expandable={{
                expandedRowRender,
                rowExpandable: ({ cashAdvances }) => cashAdvances.length > 0,
              }}
            />
          </Col>
        </Row>
      </Layout>

      <Modal
        title={<span>Cash Advance: {rowData?.name}</span>}
        visible={cashAdvanceVisible}
        onCancel={() => setCashAdvanceVisible(false)}
        okText="Submit"
        onOk={() => cashAdvanceForm.submit()}
        okButtonProps={{
          loading: cashAdvanceSubmitLoading,
        }}
      >
        <Form
          form={cashAdvanceForm}
          labelCol={{
            span: 6,
          }}
          onFinish={onAddCashAdvanceFinish}
        >
          <Form.Item
            name="date"
            label="Date"
            initialValue={moment()}
            rules={[
              {
                required: true,
                message: "Please enter date",
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
                message: "Please enter amount",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item name="note" label="Comments">
            <TextArea row={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span>Cash Advance Payment: {rowData?.name}</span>}
        visible={cashAdvancePaymentVisible}
        onCancel={() => setCashAdvancePaymentVisible(false)}
        onOk={() => cashAdvancePaymentForm.submit()}
        okText="Submit"
        okButtonProps={{
          loading: cashAdvancePaymentSubmitLoading,
        }}
      >
        <Form
          form={cashAdvancePaymentForm}
          labelCol={{
            span: 6,
          }}
          onFinish={onAddCashAdvancePaymentFinish}
        >
          <Form.Item
            name="date"
            label="Date"
            initialValue={moment()}
            rules={[
              {
                required: true,
                message: "Please enter date",
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="amountPaid"
            label="Amount to Pay"
            rules={[
              {
                required: true,
                message: "Please enter amount to pay",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item name="note" label="Comments">
            <TextArea row={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
