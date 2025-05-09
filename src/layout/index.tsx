import { Tabs, TabsProps } from "antd";
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { clearToken } from "../tools/auth";
import "../assets/css/layout.css"
import { Layout } from "antd";
import { HomeOutlined, VideoCameraOutlined, UserOutlined, PlayCircleOutlined } from '@ant-design/icons';
import UserMenu from "./components/UserMenu";
const { Header, Content } = Layout;

export default function AntdLayout() {
  const navigator = useNavigate();
  const location = useLocation();
  const currentKey = location.pathname.split('/')[1] || "home";

  const tabItems: TabsProps["items"] = [
    { 
      key: "home", 
      label: "首页",
      icon: <HomeOutlined />
    },
    { 
      key: "ttv", 
      label: "创作",
      icon: <VideoCameraOutlined />
    },
  ];

  return (
    <Layout className="douyin-layout">
      <Header className="douyin-header">
        <div className="header-content">
          <div className="logo">Hower Video</div>
          <Tabs
            defaultActiveKey="home"
            activeKey={currentKey}
            items={tabItems}
            onChange={(key) => navigator(`/${key}${location.search}`)}
            className="douyin-tabs"
          />
          <div className="user-menu">
            <UserMenu />
          </div>
        </div>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

