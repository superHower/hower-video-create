// Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import '../assets/css/login.css';
import { post, get } from '../utils/request';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [text, setText] = useState('');

  // 验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 4, message: '用户名至少4位' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { validator: validatePassword }
    ],
    captcha: [
      { required: true, message: '请输入验证码' },
      { len: 4, message: '验证码为4位字符' }
    ]
  };

  // 自定义密码验证
  function validatePassword(_, value) {
    if (!value) return Promise.reject(new Error('密码不能为空'));
    if (value.length < 6) return Promise.reject(new Error('密码至少6位'));
    return Promise.resolve();
  }

  // 刷新验证码
  const refreshCaptcha = async() => {
    const res = await get(`/admin/captcha?t=${Date.now()}`);
    const svgBase64 = `data:image/svg+xml;base64,${btoa(res.data)}`;
    setCaptchaUrl(svgBase64);
    setText(res.text);
  };

  
  // 提交登录
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await post('/admin/login', {...values, codeText: text});
      
      localStorage.setItem('user', JSON.stringify(res));
      
      navigate('/tti');
      message.success('登录成功');
    } catch (error) {
      message.error(error.message);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    refreshCaptcha();
  },[])

  return (
    <div className="login-container">
      <div className="login-panel">
        <h3 className="login-title">用户登录</h3>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{ username: 'admin',password: '123456' }}
        >
          <Form.Item name="username" rules={rules.username}>
            <Input
              placeholder="请输入用户名"
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" rules={rules.password}>
            <Input.Password
              placeholder="请输入密码"
              size="large"
              iconRender={(visible) => 
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="code-container">
            <Form.Item name="captcha" rules={rules.captcha}>
              <Input
                placeholder="请输入验证码"
                size="large"
                maxLength={4}
                className="code-input"
              />
            </Form.Item>
            <img 
              src={captchaUrl} 
              className="code-image" 
              onClick={refreshCaptcha} 
              alt="验证码" 
            />
            
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-btn"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
