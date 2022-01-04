/* eslint-disable react/display-name */
import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import QRCode from "qrcode.react";
import { Row, Col, Descriptions } from "antd";
import Head from "next/head";
import Layout from "../../components/layout";
import { baseUrl, fetcher } from "../../utils/api";

const EmployeeInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR(`${baseUrl}/Employee/${id}`, fetcher);
  // const timeInOutUrl = `${baseUrl}/Employee/hour/${id}`;

  const onDownloadEmployeeQr = (el) => {
    const svg = document.getElementById(id);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = id;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Layout>
      <Head>
        <title>Payroll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" gutter={[12, 12]}>
        <Col>
          {id && (
            <QRCode
              value={id}
              size={250}
              id={id}
              renderAs="svg"
              bgColor="#FFFFFF"
              includeMargin={true}
            />
          )}
          <a href onClick={onDownloadEmployeeQr} className="mt-2">
            Download
          </a>
        </Col>
        <Col>
          <Descriptions title="Employee Info">
            <Descriptions.Item label="First Name">
              {data?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {data?.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {data?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {data?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Rate per Day">
              {data?.rate?.ratePerDay}
            </Descriptions.Item>
            <Descriptions.Item label="SSS">{data?.rate?.sss}</Descriptions.Item>
            <Descriptions.Item label="Pag-ibig">
              {data?.rate?.pagibig}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Layout>
  );
};

export default EmployeeInfo;
