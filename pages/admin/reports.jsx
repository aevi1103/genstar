import Head from "next/head";
import { Row, Col } from "antd";
import Layout from "../../components/layout";

const Reports = () => {
  console.log("reports");
  return (
    <Layout>
      <Head>
        <title>Reports</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row>
        <Col>Report</Col>
      </Row>
    </Layout>
  );
};

export default Reports;
