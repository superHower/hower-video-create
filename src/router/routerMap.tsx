import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Layout from "../layout/index";
import PrivateRoute from "./privateRoute";

import ImgToVideo from "../pages/ImgToVideo";
import TxtToVideo from "../pages/TxtToVideo";
import User from "../pages/User";
import Community from "../pages/Community";

export const routerMap = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  }, //其他没有被注册过的路径统一重定位到login
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/itv",
        element: <ImgToVideo />,
      },
      {
        path: "/ttv",
        element: <TxtToVideo />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/community",
        element: <Community />,
      },
    ],
  },

];

