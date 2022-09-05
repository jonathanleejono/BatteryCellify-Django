import Iconify from 'components/Iconify';
import {
  addBatteryCellRoute,
  allBatteryCellsRoute,
  batteryCellGraphsRoute,
  dashboardRoute,
  manageCsvRoute,
  profileRoute,
} from 'constants/routes';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: dashboardRoute,
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'all battery cells',
    path: allBatteryCellsRoute,
    icon: getIcon('clarity:battery-solid'),
  },
  {
    title: 'add battery cell',
    path: addBatteryCellRoute,
    icon: getIcon('eva:plus-square-outline'),
  },
  {
    title: 'battery cell graphs',
    path: batteryCellGraphsRoute,
    icon: getIcon('bx:line-chart'),
  },
  {
    title: 'manage CSV',
    path: manageCsvRoute,
    icon: getIcon('bx:spreadsheet'),
  },
  {
    title: 'profile',
    path: profileRoute,
    icon: getIcon('eva:person-fill'),
  },
];

export default navConfig;
