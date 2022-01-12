import { Table, Tooltip } from "antd";
import numeral from "numeral";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";
import { useLocaleString, useLocaleDateString } from "../../utils/hooks";
import "../../utils/numeral/locale/en-ph";

const numberFormat = "0,0.[00]";
const currencyFormat = "$ 0,0.[00]";

const HoursTable = ({
  dataSource,
  loading,
  showEdit = false,
  onEdit = () => {},
}) => {
  numeral.locale("en-ph");
  const { getLocaleDateString: getLocaleString } = useLocaleString();
  const { getLocaleDateString } = useLocaleDateString();

  let columns = [
    {
      title: "Date",
      dataIndex: "date",
      width: 150,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text, { date }) => (
        <span>
          {getLocaleDateString(date)} ({moment(date).format("ddd")})
        </span>
      ),
    },
    {
      title: "Week #",
      dataIndex: "weekNumber",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.weekNumber - b.weekNumber,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, { name }) => name,
    },
    {
      title: "Time In",
      dataIndex: "timeIn",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.timeIn) - new Date(b.timeIn),
      render: (text, { timeIn, timeToTimeOut }) => (
        <Tooltip
          title={<span>Time Out Time: {getLocaleString(timeToTimeOut)}</span>}
        >
          <span>{getLocaleString(timeIn)}</span>
        </Tooltip>
      ),
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
          render: (text, { otHours }) => numeral(otHours).format(numberFormat),
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
          dataIndex: "totalPay",
          width: 100,
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.totalPay - b.totalPay,
          render: (text, { totalPay }) =>
            numeral(totalPay).format(currencyFormat),
        },
      ],
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated),
      render: (text, { dateCreated }) => getLocaleString(dateCreated),
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.dateModified) - new Date(b.dateModified),
      render: (text, { dateModified }) => getLocaleString(dateModified),
    },
    {
      title: "Type",
      dataIndex: "type",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
  ];

  if (showEdit) {
    columns = [
      {
        dataIndex: "edit",
        width: 10,
        render: (text, record) => (
          <Tooltip title="Edit">
            <span
              className="cursor-pointer"
              onClick={() => onEdit(record)}
              onKeyDown={() => {}}
              tabIndex={0}
              role="button"
            >
              <EditOutlined />
            </span>
          </Tooltip>
        ),
      },
      ...columns,
    ];
  }

  const getTotal = (propName, pageData) =>
    pageData.reduce((prev, curr) => prev + curr[propName], 0);

  const summary = (pageData) => (
    <Table.Summary.Row className="bg-slate-50 font-bold">
      <Table.Summary.Cell colSpan={5}>Total</Table.Summary.Cell>
      <Table.Summary.Cell>
        {numeral(getTotal("hoursWorked", pageData)).format(numberFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        {numeral(getTotal("otHours", pageData)).format(numberFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell colSpan={2} />
      <Table.Summary.Cell>
        {numeral(getTotal("regularRate", pageData)).format(currencyFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        {numeral(getTotal("otRate", pageData)).format(currencyFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        {numeral(getTotal("sundayRate", pageData)).format(currencyFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        {numeral(getTotal("totalPay", pageData)).format(currencyFormat)}
      </Table.Summary.Cell>
      <Table.Summary.Cell colSpan={3} />
    </Table.Summary.Row>
  );

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      bordered
      summary={summary}
      size="small"
    />
  );
};

export default HoursTable;
