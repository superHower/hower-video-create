import { Tabs, TabsProps } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../tools/auth";
import "../assets/css/layout.css"
import { Layout } from "antd";
import { Color } from "antd/es/color-picker";
import UserMenu from "./components/UserMenu";
const { Header, Content } = Layout;
export default function AntdLayout() {
  const navigator = useNavigate();

  // 精简后的Tabs配置（移出退出登录）
  const tabItems: TabsProps["items"] = [
    { key: "tti", label: "文生图片" },
    { key: "ttv", label: "文生视频" },
    { key: "itv", label: "图生视频" },
    { key: "my", label: "我的作品" }
  ];

  return (
    <Layout className="layout-container">
      {/* 顶部导航栏 */}
      <Header className="layout-header">
        <Tabs
          defaultActiveKey="tti"
          items={tabItems}
          onChange={(key) => navigator(`/${key}`)}
          tabBarStyle={{ marginBottom: 0 }}
        />
        
        <div style={{ marginLeft: 'auto' }}>
          <UserMenu />
        </div>
      </Header>

      {/* 内容区域 */}
      <Content style={{ padding: '24px 50px', marginTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

