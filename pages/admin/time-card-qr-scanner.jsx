import { useEffect, useState } from "react";
import numeral from "numeral";
import axios from "axios";
import { Row, Col, Modal, Typography, Space } from "antd";
import dynamic from "next/dynamic";

import Head from "next/head";
import Layout from "../../components/layout";
import { baseUrl } from "../../utils/api";
import { useLocaleString, useLocaleDateString } from "../../utils/hooks";

const { Title } = Typography;

const QrReaderWithNoSSR = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const TimeCardQrScanner = () => {
  const { getLocaleDateString: getLocaleString } = useLocaleString();
  const { getLocaleDateString } = useLocaleDateString();
  const [employeeId, setEmployeeId] = useState(null);
  const [employee, setEmployee] = useState(null);

  const timeInOutUser = async (id) => {
    axios(`${baseUrl}/Employee/hour/${id}`)
      .then((response) => {
        setEmployee(response.data);

        setTimeout(() => {
          setEmployeeId(null);
          setEmployee(null);
        }, 3 * 1000);
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

  const onScan = (err, result) => {
    if (result) {
      setEmployeeId(result.text);
      return;
    }
    setEmployeeId(null);
  };

  return (
    <Layout
      contentProps={{
        style: {
          backgroundColor: "#F0F2F5",
        },
      }}
    >
      <Head>
        <title>QR Scanner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" gutter={[12, 12]}>
        <Col>
          {!employee ? (
            <>
              <Title level={4}>GENSTAR EMPLOYEE TIME CARD</Title>
              <QrReaderWithNoSSR width={500} height={500} onUpdate={onScan} />
              <small className="text-slate-400">
                {employeeId ?? "Scan Employee QR Code"}
              </small>
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
                      {numeral(
                        employee?.timeInOutInfo?.totalHoursWorked
                      ).format("0.00")}
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

export default TimeCardQrScanner;
