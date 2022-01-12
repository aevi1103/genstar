import { useState, useEffect } from "react";
import { Form, Modal, InputNumber, Input } from "antd";
import { useSWRConfig } from "swr";
import { baseUrl } from "../../utils/api";

const RateModal = ({ rateModalVisible, setRateModalVisible, employeeId }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const getRate = async () => {
      const response = await fetch(`${baseUrl}/Rate/${employeeId}`);

      if (response.ok) {
        const data = await response?.json();
        const { ratePerDay, pagibig, sss, empployeeId } = data || {};

        form.setFieldsValue({
          empployeeId,
          ratePerDay,
          pagibig,
          sss,
        });
        return;
      }

      form.resetFields();
    };

    getRate();
  }, [employeeId, form]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      await fetch(`${baseUrl}/Rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          empployeeId: employeeId,
        }),
      });
      setRateModalVisible(false);
      form.resetFields();
      mutate(`${baseUrl}/Employee`);
      Modal.success({
        title: "Success",
        content: `Rate successfully added!`,
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
    <Modal
      title="Add Rate"
      visible={rateModalVisible}
      onCancel={() => {
        setRateModalVisible(false);
        // form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Submit"
      okButtonProps={{
        loading: submitting,
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 10,
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
          name="ratePerDay"
          label="Rate Per Day"
          rules={[
            {
              required: true,
              message: "Please enter rate",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="sss" label="SSS">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="pagibig" label="Pag-ibig">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RateModal;
