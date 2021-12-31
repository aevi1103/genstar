import { Modal, Form, Input, DatePicker } from "antd";
import { useSWRConfig } from "swr";
import { baseUrl } from "../../utils/api";

const { TextArea } = Input;

const EmployeeForm = ({
  setSubmitting,
  setIsModalVisible,
  currentEmpId,
  form,
}) => {
  const { mutate } = useSWRConfig();
  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      await fetch(`${baseUrl}/Employee`, {
        method: currentEmpId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      setIsModalVisible(false);
      form.resetFields();
      mutate(`${baseUrl}/Employee`);
      Modal.success({
        title: "Success",
        content: `User successfully ${currentEmpId ? "updated" : "added"}!`,
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: JSON.stringify(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{
        span: 6,
      }}
    >
      <Form.Item
        name="empployeeId"
        style={{
          display: "none",
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          {
            required: true,
            message: "Please enter first name",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          {
            required: true,
            message: "Please enter last name",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="phoneNumber" label="Mobile Number">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="dateHired" label="Date Hired">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="notes" label="Notes">
        <TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
