import { Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
const UserMenu = () => {
  const navigator = useNavigate();
  
  const items = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: () => {
        clearToken();
        navigator('/login');
      }
    }
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>用户名</span>
        </Space>
      </a>
    </Dropdown>
  );
};
export default UserMenu