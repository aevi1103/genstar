const routes = [
  {
    title: "Home",
    path: "/",
    submenu: [],
  },
  {
    title: "Payroll",
    path: "/admin/payroll/sub-menu",
    submenu: [
      {
        title: "Employee Hours",
        path: "/admin/payroll",
      },
      {
        title: "Employee",
        path: "/admin/employee",
      },
      {
        title: "Cash Advance",
        path: "/admin/cash-advance",
      },
      {
        title: "QR Time Card",
        path: "/admin/time-card-qr-scanner",
      },
      {
        title: "Reports",
        path: "/admin/reports",
      },
    ],
  },
];

export default routes;
