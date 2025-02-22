import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Layout from "../layout/index";
import PrivateRoute from "./privateRoute";

import ITI from "../pages/ITI";
import TTI from "../pages/TTI";

export const routerMap = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/iti",
        element: <ITI />,
      },
      {
        path: "/tti",
        element: <TTI />,
      },
    ],
  },

];

