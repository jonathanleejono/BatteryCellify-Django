// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

// very important to add slashs at end of path (eg. '/app/dashboard/')
// this is so urls can navigate properly
// mark-app
const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'all battery cells',
    path: '/all-battery-cells/',
    icon: getIcon('clarity:battery-solid'),
  },
  {
    title: 'add battery cell',
    path: '/add-battery-cell/',
    icon: getIcon('eva:plus-square-outline'),
  },
  {
    title: 'graphs',
    path: '/graphs/',
    icon: getIcon('bx:line-chart'),
  },
  {
    title: 'manage CSV',
    path: '/manage-csv/',
    icon: getIcon('bx:spreadsheet'),
  },
  {
    title: 'profile',
    path: '/profile/',
    icon: getIcon('eva:person-fill'),
  },
];

export default navConfig;
