import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Layout from "../layout/index";
import PrivateRoute from "./privateRoute";

import ITI from "../pages/ITI";
import TTI from "../pages/TTI";
import MyWork from "../pages/MyWork";

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
        path: "/my",
        element: <MyWork />,
      },
      {
        path: "/tti",
        element: <TTI />,
      },
      {
        path: "/ttv",
        element: <ITI />,
      },
      {
        path: "/itv",
        element: <ITI />,
      },
    ],
  },

];

