import { Tabs, TabsProps } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../tools/auth";
import "../assets/css/layout.css"

import { Color } from "antd/es/color-picker";
export default function Layout() {
  const navigator = useNavigate();
  const items: TabsProps["items"] = [
    {
      key: "tti",
      label: "文本转图片",
    },
    {
      key: "iti",
      label: "图片转图片",
    },
    {
      key: "login",
      label: "退出登录",
    },
  ];
  const handleChangeRoute = (value: string) => {
    if (value === "login") {
      clearToken();
    }
    navigator(`/${value}`);
  };
  return (
    <>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tabs
            defaultActiveKey="community"
            size={"large"}
            items={items}
            onChange={(value) => {
              handleChangeRoute(value);
            }}

          />
        </div>
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

