import { Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
const UserMenu = () => {
  const navigator = useNavigate();

  const { username, accountType } = JSON.parse(localStorage.getItem('user') ? localStorage.getItem('user') : '{}')
  

  const items = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('user');
        navigator('/login');
      }
    }
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{username}</span>
          <span>{accountType}</span>
        </Space>
      </a>
    </Dropdown>
  );
};
export default UserMenu