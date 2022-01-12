import { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import moment from "moment";
import axios from "axios";
import numeral from "numeral";
import { useLocaleDateString, useLocaleString } from "../../utils/hooks";
import "../../utils/numeral/locale/en-ph";
import { baseUrl } from "../../utils/api";

const numberFormat = "0,0.[00]";
const currencyFormat = "$ 0,0.[00]";

const WeeklyTable = ({ startDate, endDate, employeeId }) => {
  numeral.locale("en-ph");
  const { getLocaleDateString: getLocaleString } = useLocaleString();
  const { getLocaleDateString } = useLocaleDateString();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (params) => {
    setLoading(true);
    try {
      const response = await axios(`${baseUrl}/hour/weekly`, {
        params,
      });
      const hours = response.data;
      const data = hours?.map((hour, i) => ({
        key: i,
        ...hour,
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
    if (!employeeId) return;
    getData({
      startDate: moment(startDate).format(),
      endDate: moment(endDate).format(),
      employeeId,
    });
  }, [startDate, endDate, employeeId]);

  const columns = [
    {
      title: "Period",
      dataIndex: "period",
      render: (text, { startOfWeek, endOfWeek }) => (
        <span>
          {getLocaleDateString(startOfWeek)} - {getLocaleDateString(endOfWeek)}
        </span>
      ),
    },
    {
      title: "Week Number",
      dataIndex: "weekNumber",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, { name }) => <span>{name}</span>,
    },
    {
      title: "Hours",
      children: [
        {
          title: "Worked",
          dataIndex: "hoursWorked",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.hoursWorked - b.hoursWorked,
          render: (text, { hoursWorked }) =>
            numeral(hoursWorked).format(numberFormat),
        },
        {
          title: "OT",
          dataIndex: "otHours",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.otHours - b.otHours,
          render: (text, { otHours }) => numeral(otHours).format(numberFormat),
        },
      ],
    },
    {
      title: "Pay",
      children: [
        {
          title: "Regular",
          dataIndex: "regularRate",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.regularRate - b.regularRate,
          render: (text, { regularRate }) =>
            numeral(regularRate).format(currencyFormat),
        },
        {
          title: "OT",
          dataIndex: "otRate",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.otRate - b.otRate,
          render: (text, { otRate }) => numeral(otRate).format(currencyFormat),
        },
        {
          title: "Sunday",
          dataIndex: "sundayRate",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.sundayRate - b.sundayRate,
          render: (text, { sundayRate }) =>
            numeral(sundayRate).format(currencyFormat),
        },
        {
          title: "Gross",
          dataIndex: "grossPay",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.grossPay - b.grossPay,
          render: (text, { grossPay }) =>
            numeral(grossPay).format(currencyFormat),
        },
      ],
    },
    {
      title: "Deductions",
      children: [
        {
          title: "Benefits",
          children: [
            {
              title: "SSS",
              dataIndex: "sss",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) => a.sss - b.sss,
              render: (text, { sss }) => numeral(sss).format(currencyFormat),
            },
            {
              title: "Pagibig",
              dataIndex: "pagibig",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) => a.pagibig - b.pagibig,
              render: (text, { pagibig }) =>
                numeral(pagibig).format(currencyFormat),
            },
          ],
        },
        {
          title: "Cash Advance",
          children: [
            {
              title: "Total",
              dataIndex: "totalCashAdvance",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) => a.totalCashAdvance - b.totalCashAdvance,
              render: (text, { totalCashAdvance }) =>
                numeral(totalCashAdvance).format(currencyFormat),
            },
            {
              title: "Payments",
              dataIndex: "totalCashAdvancePayments",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) =>
                a.totalCashAdvancePayments - b.totalCashAdvancePayments,
              render: (text, { totalCashAdvancePayments }) =>
                numeral(totalCashAdvancePayments).format(currencyFormat),
            },
            {
              title: "Balance",
              dataIndex: "cashAdvanceBalance",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) => a.cashAdvanceBalance - b.cashAdvanceBalance,
              render: (text, { cashAdvanceBalance }) =>
                numeral(cashAdvanceBalance).format(currencyFormat),
            },
            {
              title: "Payment This Period",
              dataIndex: "cashAdvancePaidThisPeriod",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a, b) =>
                a.cashAdvancePaidThisPeriod - b.cashAdvancePaidThisPeriod,
              render: (text, { cashAdvancePaidThisPeriod }) =>
                numeral(cashAdvancePaidThisPeriod).format(currencyFormat),
            },
          ],
        },
      ],
    },
    {
      title: "Net Pay",
      dataIndex: "netPay",
      width: 100,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.netPay - b.netPay,
      render: (text, { netPay }) => numeral(netPay).format(currencyFormat),
    },
  ];

  const expandedRowRender = (record) => {
    const { hours } = record;

    const hoursColumn = [
      {
        title: "Date",
        dataIndex: "dateStr",
      },
      {
        title: "Time In",
        dataIndex: "timeIn",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => new Date(a.timeIn) - new Date(b.timeIn),
        render: (text, { timeIn }) => <span>{getLocaleString(timeIn)}</span>,
      },
      {
        title: "Time Out",
        dataIndex: "timeOut",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => new Date(a.timeOut) - new Date(b.timeOut),
        render: (text, { timeOut }) => timeOut && getLocaleString(timeOut),
      },
      {
        title: "Hours",
        children: [
          {
            title: "Worked",
            dataIndex: "hoursWorked",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.hoursWorked - b.hoursWorked,
            render: (text, { hoursWorked }) =>
              numeral(hoursWorked).format(numberFormat),
          },
          {
            title: "OT",
            dataIndex: "otHours",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.otHours - b.otHours,
            render: (text, { otHours }) =>
              numeral(otHours).format(numberFormat),
          },
        ],
      },
      {
        title: "Pay",
        children: [
          {
            title: "Daily Rate",
            dataIndex: "ratePerDay",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.ratePerDay - b.ratePerDay,
            render: (text, { ratePerDay }) =>
              numeral(ratePerDay).format(currencyFormat),
          },
          {
            title: "Hourly Rate",
            dataIndex: "ratePerHour",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.ratePerHour - b.ratePerHour,
            render: (text, { ratePerHour }) =>
              numeral(ratePerHour).format(currencyFormat),
          },
          {
            title: "Regular",
            dataIndex: "regularRate",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.regularRate - b.regularRate,
            render: (text, { regularRate }) =>
              numeral(regularRate).format(currencyFormat),
          },
          {
            title: "OT",
            dataIndex: "otRate",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.otRate - b.otRate,
            render: (text, { otRate }) =>
              numeral(otRate).format(currencyFormat),
          },
          {
            title: "Sunday",
            dataIndex: "sundayRate",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.sundayRate - b.sundayRate,
            render: (text, { sundayRate }) =>
              numeral(sundayRate).format(currencyFormat),
          },
          {
            title: "Gross",
            dataIndex: "grossPay",
            width: 100,
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.totalPay - b.totalPay,
            render: (text, { totalPay }) =>
              numeral(totalPay).format(currencyFormat),
          },
        ],
      },
      {
        title: "Type",
        dataIndex: "type",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
    ];

    return (
      <Table
        columns={hoursColumn}
        dataSource={hours.map((item, i) => ({ key: i, ...item }))}
        pagination={false}
        bordered
        size="small"
      />
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      bordered
      size="small"
      expandable={{
        expandedRowRender,
      }}
    />
  );
};

export default WeeklyTable;
