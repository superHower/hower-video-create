import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Layout from "../layout/index";
import PrivateRoute from "./privateRoute";

import ITI from "../pages/ITI";
import TTI from "../pages/TTI";
import MyWork from "../pages/MyWork";
import Play from "../pages/play";
import Home from "../pages/home";
export const routerMap = [
  {
    path: "/login",
    element: <Login />,
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
        path: "/home",
        element: <Home />,
      },
      {
        path: "/my",
        element: <MyWork />,
      },
      {
        path: "/play",
        element: <Play />,
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
  {
    path: "*",
    element: <Navigate to="/login" />,
  },

];

