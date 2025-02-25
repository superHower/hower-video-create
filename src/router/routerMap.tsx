import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Layout from "../layout/index";

import TTV from "../pages/TTV";
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
      <Layout />
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
        path: "/ttv",
        element: <TTV />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },

];

