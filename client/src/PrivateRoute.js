// import React from 'react';
// import { RouteProps, Redirect, Route } from 'react-router';
// import { useContext } from 'react';
// import { AuthContext } from './AuthProvider'; // simple React.Context

// const PrivateRoute = ({ children, ...props }) => {
//   const { authenticated } = useContext(AuthContext);
//   return (
//     <Route
//       {...props}
//       render={(_) => {
//         if (!authenticated) return <Redirect to="/login" />;
//         return children;
//       }}
//     />
//   );
// };
// export default PrivateRoute;
