import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import moment from "moment";
import { Row, Col, DatePicker, Form, Input, Button, Modal, Select } from "antd";
import Layout from "../../components/layout";
import { baseUrl } from "../../utils/api";
import HoursTable from "../../components/admin/hours-table";
import "../../utils/numeral/locale/en-ph";
import rangePreset from "../../utils/date-range-preset";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "MM/DD/YYYY hh:mm:ss A";
const defaultDateRange = [moment().subtract(30, "d"), moment()];

export default function Payroll() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const response = await axios(`${baseUrl}/employee/names`);
      setEmployees(response.data);
    };

    getEmployees();
  }, []);

  const getData = async (filterValues) => {
    setLoading(true);
    try {
      const response = await axios(`${baseUrl}/hour`, {
        params: filterValues,
      });
      const hours = response.data;
      const data = hours?.map((hour) => ({
        key: hour.employeeHourId,
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
    getData({
      startDate: moment(defaultDateRange[0]).format(),
      endDate: moment(defaultDateRange[1]).format(),
    });
  }, []);

  const onEdit = (record) => {
    const { timeIn, timeOut, employeeHourId } = record;
    form.setFieldsValue({
      timeIn: moment(timeIn),
      timeOut: timeOut && moment(timeOut),
      employeeHourId,
    });
    setEditModalVisible(true);
  };

  const onFinish = async (values) => {
    try {
      const { timeIn, timeOut, employeeHourId } = values;

      setEditing(true);
      await axios.put(`${baseUrl}/hour`, {
        employeeHourId,
        timeIn: moment(timeIn).format(),
        timeOut: timeOut && moment(timeOut).format(),
      });

      form.resetFields();

      const dateRange = filterForm.getFieldValue("dateRange");
      const [start, end] = dateRange;

      getData({
        startDate: moment(start).format(),
        endDate: moment(end).format(),
        firstName: filterForm.getFieldValue("firstName"),
        lastName: filterForm.getFieldValue("lastName"),
      });

      setEditModalVisible(false);

      Modal.success({
        title: "Success",
        content: "Successfully Saved!",
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: error?.response?.data ?? JSON.stringify(error),
      });
    } finally {
      setEditing(false);
    }
  };

  const onFilter = (values) => {
    const { dateRange, firstName, lastName } = values;
    const [start, end] = dateRange;

    getData({
      startDate: moment(start).format(),
      endDate: moment(end).format(),
      firstName,
      lastName,
    });
  };

  const onAddFinish = async (values) => {
    try {
      const { timeIn, timeOut, employeeId } = values;
      await axios.post(`${baseUrl}/hour/manual`, {
        timeIn: moment(timeIn).format(),
        timeOut: timeOut && moment(timeOut).format(),
        employeeId,
      });

      addForm.resetFields();
      setManualModalVisible(false);
      Modal.success({
        title: "Success",
        content: "Hour Successfully Added!",
      });

      const dateRange = filterForm.getFieldValue("dateRange");
      const [start, end] = dateRange;

      getData({
        startDate: moment(start).format(),
        endDate: moment(end).format(),
        firstName: filterForm.getFieldValue("firstName"),
        lastName: filterForm.getFieldValue("lastName"),
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: error?.response?.data ?? JSON.stringify(error),
      });
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Payroll</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <span className="text-2xl font-bold">Employee Hours History</span>
          </Col>
          <Col span={24}>
            <Form layout="inline" form={filterForm} onFinish={onFilter}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                initialValue={defaultDateRange}
              >
                <RangePicker format="MM/DD/YYYY" ranges={rangePreset} />
              </Form.Item>
              <Form.Item name="firstName" label="First Name">
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                  Filter
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => setManualModalVisible(true)}
                >
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <HoursTable
              dataSource={dataSource}
              loading={loading}
              showEdit
              onEdit={onEdit}
            />
          </Col>
        </Row>
      </Layout>

      <Modal
        title="Edit"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        okText="Submit"
        onOk={() => form.submit()}
        okButtonProps={{
          loading: editing,
        }}
      >
        <Form
          form={form}
          labelCol={{
            span: 5,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="employeeHourId" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="timeIn"
            label="Time In"
            rules={[
              {
                required: true,
                message: "Please enter time in",
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item name="timeOut" label="Time Out">
            <DatePicker
              format={dateFormat}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Manual"
        visible={manualModalVisible}
        onCancel={() => setManualModalVisible(false)}
        okText="Submit"
        onOk={() => addForm.submit()}
      >
        <Form
          form={addForm}
          labelCol={{
            span: 5,
          }}
          onFinish={onAddFinish}
        >
          <Form.Item name="employeeId" label="Employee">
            <Select showSearch optionFilterProp="children">
              {employees.map(({ empployeeId, firstName, lastName }) => (
                <Option key={empployeeId} value={empployeeId}>
                  {lastName}, {firstName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="timeIn" label="Time In">
            <DatePicker
              format={dateFormat}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item name="timeOut" label="Time Out">
            <DatePicker
              format={dateFormat}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
