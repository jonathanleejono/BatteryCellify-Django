// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/app/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'all battery cells',
    path: '/app/all-battery-cells',
    icon: getIcon('clarity:battery-solid'),
  },
  {
    title: 'add battery cell',
    path: '/app/add-battery-cell',
    icon: getIcon('eva:plus-square-outline'),
  },
  {
    title: 'graphs',
    path: '/app/graphs',
    icon: getIcon('bx:line-chart'),
  },
  {
    title: 'manage CSV',
    path: '/app/manage-csv',
    icon: getIcon('bx:spreadsheet'),
  },
  {
    title: 'profile',
    path: '/app/profile',
    icon: getIcon('eva:person-fill'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
];

export default navConfig;
