import { Modal, Form, Input, InputNumber } from "antd";

const RateForm = () => {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Form
      // form={form}
      onFinish={onFinish}
      labelCol={{
        span: 6,
      }}
    >
      <Form.Item name="ratePerDay" label="Rate Per Day">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="sss" label="SSS">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="pagibig" label="Pag-ibig">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  );
};

export default RateForm;
