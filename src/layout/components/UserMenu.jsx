import { Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigator = useNavigate();

  const { username, accountType, id } = JSON.parse(localStorage.getItem('user') ? localStorage.getItem('user') : '{}')
  
  const items = [
    {
      key: 'profile',
      label: '个人主页',
      icon: <UserOutlined />,
      onClick: () => navigator('/my')
    },
    {
      key: 'edit',
      label: '编辑资料',
      icon: <EditOutlined />,
      onClick: () => navigator('/edit-profile')
    },
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
      <a onClick={(e) => e.preventDefault()} className="user-menu-trigger">
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: '#ff2c55' }} />
          <span style={{ color: '#fff' }}>{username}</span>
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserMenu