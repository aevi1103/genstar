import moment from "moment";

const rangePresets = {
  Now: [moment(), moment()],
  Today: [moment().startOf("day"), moment().endOf("day")],
  "This Period": [moment().startOf("week"), moment().endOf("week")],
  "Last Period": [
    moment().subtract(6, "days").startOf("week"),
    moment().subtract(6, "days").endOf("week"),
  ],
  "Last Month": [
    moment().subtract(1, "month").startOf("month"),
    moment().subtract(1, "month").endOf("month"),
  ],
  "Last 30 days": [moment().subtract(30, "days"), moment()],
  "Last 7 days": [moment().add(-7, "days"), moment()],
  MTD: [moment().startOf("month"), moment()],
  YTD: [moment().startOf("year"), moment()],
};

export default rangePresets;
