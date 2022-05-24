// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

// very important to add slashs at end of path (eg. '/app/dashboard/')
// this is so urls can navigate properly

const navConfig = [
  {
    title: 'dashboard',
    path: '/app/dashboard/',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'all battery cells',
    path: '/app/all-battery-cells/',
    icon: getIcon('clarity:battery-solid'),
  },
  {
    title: 'add battery cell',
    path: '/app/add-battery-cell/',
    icon: getIcon('eva:plus-square-outline'),
  },
  {
    title: 'graphs',
    path: '/app/graphs/',
    icon: getIcon('bx:line-chart'),
  },
  {
    title: 'manage CSV',
    path: '/app/manage-csv/',
    icon: getIcon('bx:spreadsheet'),
  },
  {
    title: 'profile',
    path: '/app/profile/',
    icon: getIcon('eva:person-fill'),
  },
];

export default navConfig;
