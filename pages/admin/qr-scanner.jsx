import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Modal, Typography, Space } from "antd";
import dynamic from "next/dynamic";

import Head from "next/head";
import Layout from "../../components/layout";
import { baseUrl } from "../../utils/api";
import { useLocaleString, useLocaleDateString } from "../../utils/hooks";

const { Title } = Typography;

const QrReaderWithNoSSR = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

const QrScanner = () => {
  const { getLocaleDateString: getLocaleString } = useLocaleString();
  const { getLocaleDateString } = useLocaleDateString();
  const [employeeId, setEmployeeId] = useState(null);
  const [employee, setEmployee] = useState(null);

  const timeInOutUser = async (id) => {
    axios(`${baseUrl}/Employee/hour/${id}`)
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        Modal.error({
          title: "Error",
          content: error?.response?.data?.message ?? "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    if (!employeeId) return;
    timeInOutUser(employeeId);
  }, [employeeId]);

  const onScan = (data) => {
    setEmployeeId(data);
  };

  const onError = (err) => {
    Modal.error({
      title: "Error",
      content: (
        <Row gutter={[12, 12]}>
          <Col span={24}>Camera error please refresh!</Col>
          <Col span={24}>{JSON.stringify(err)}</Col>
        </Row>
      ),
    });
  };

  return (
    <Layout>
      <Head>
        <title>QR Scanner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" gutter={[12, 12]}>
        <Col>
          {!employee ? (
            <>
              <QrReaderWithNoSSR
                delay={500}
                resolution={1080}
                onError={onError}
                onScan={onScan}
                style={{ width: 250 }}
                showViewFinder={false}
              />
              <p>{employeeId ?? "scan"}</p>
            </>
          ) : (
            <>
              <Title>
                {employee?.lastName}, {employee?.firstName}
              </Title>
              <p>
                <Space>
                  <span className="font-bold text-2xl">Date:</span>
                  <span className="text-2xl">
                    {getLocaleDateString(employee?.timeInOutInfo?.date)}
                  </span>
                </Space>
              </p>
              <p>
                <Space>
                  <span className="font-bold text-2xl">Time In:</span>
                  <span className="text-2xl">
                    {getLocaleString(employee?.timeInOutInfo?.timeIn)}
                  </span>
                </Space>
              </p>
              <p>
                <Space>
                  <span className="font-bold text-2xl">Time Out:</span>
                  <span className="text-2xl">
                    {employee?.timeInOutInfo?.timeOut &&
                      getLocaleString(employee?.timeInOutInfo?.timeOut)}
                  </span>
                </Space>
              </p>
              {employee?.timeInOutInfo?.timeOut && (
                <p>
                  <Space>
                    <span className="font-bold text-2xl">
                      Total Hours Worked:
                    </span>
                    <span className="text-2xl">
                      {employee?.timeInOutInfo?.totalHoursWorked}
                    </span>
                  </Space>
                </p>
              )}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default QrScanner;
