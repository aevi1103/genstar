/* eslint-disable react/display-name */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import QRCode from "qrcode.react";
import { Row, Col, Descriptions, DatePicker, Modal, Space } from "antd";
import Head from "next/head";
import Layout from "../../components/layout";
import { baseUrl, fetcher } from "../../utils/api";
import HoursTable from "../../components/admin/hours-table";
import WeeklyTable from "../../components/admin/weekly-table";
import rangePreset from "../../utils/date-range-preset";

const { RangePicker } = DatePicker;
const dateFormat = "MM/DD/YYYY";
const defaultDateRange = [moment().startOf("week"), moment().endOf("week")];

const EmployeeInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR(`${baseUrl}/Employee/${id}`, fetcher);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(defaultDateRange);

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

  const getData = async (params) => {
    setLoading(true);
    try {
      const response = await axios(`${baseUrl}/hour`, {
        params,
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
    if (!id) return;
    const [start, end] = dateRange;
    getData({
      startDate: moment(start).format(),
      endDate: moment(end).format(),
      employeeId: id,
    });
  }, [dateRange, id]);

  return (
    <Layout>
      <Head>
        <title>Payroll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" gutter={[12, 12]}>
        <Col span={24} className="font-bold text-2xl">
          <Row justify="space-between">
            <Col>
              <span className="">
                {data?.lastName}, {data?.firstName}
              </span>
            </Col>
            <Col>
              <span>
                <Space>
                  <span>Current Period: </span>
                  <span>{moment(defaultDateRange[0]).format(dateFormat)}</span>
                  <span>-</span>
                  <span>{moment(defaultDateRange[1]).format(dateFormat)}</span>
                </Space>
              </span>
            </Col>
          </Row>
        </Col>
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
          <small>
            <a href onClick={onDownloadEmployeeQr} className="mt-2">
              Download
            </a>
          </small>
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

        <Col span={24}>
          <Row gutter={[12, 12]} align="middle">
            <Col>
              <span className="font-bold">Date Range:</span>
            </Col>
            <Col>
              <RangePicker
                format={dateFormat}
                onChange={(range) => setDateRange(range)}
                defaultValue={defaultDateRange}
                ranges={rangePreset}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <b>Weekly Salary</b>
            </Col>
            <Col span={24}>
              <WeeklyTable
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                employeeId={id}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <b>Time Card History</b>
            </Col>
            <Col span={24}>
              <HoursTable dataSource={dataSource} loading={loading} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default EmployeeInfo;
