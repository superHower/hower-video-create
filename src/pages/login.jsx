import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import '../assets/css/login.css';
import { post, get } from '../utils/request';

const Login = () => {
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [text, setText] = useState('');
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  // 自定义密码验证
  const validatePassword = (_, value) => {
    if (!value) return Promise.reject(new Error('密码不能为空'));
    if (value.length < 6) return Promise.reject(new Error('密码至少6位'));
    return Promise.resolve();
  };
  // 验证规则
  // 在 rules 对象中添加确认密码的验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 4, message: '用户名至少4位' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { validator: validatePassword }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('两次输入的密码不一致'));
        },
      }),
    ],
    captcha: [
      { required: true, message: '请输入验证码' },
      { len: 4, message: '验证码为4位字符' }
    ]
  };



  // 刷新验证码
  const refreshCaptcha = async () => {
    const res = await get(`/admin/captcha?t=${Date.now()}`);
    const svgBase64 = `data:image/svg+xml;base64,${btoa(res.data)}`;
    setCaptchaUrl(svgBase64);
    setText(res.text);
  };

  // 提交登录
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await post('/admin/login', { ...values, codeText: text });
      if(res.code == 1) {
        message.error(res.message);
        refreshCaptcha();
        return
      }
      localStorage.setItem('user', JSON.stringify(res.result));
      message.success('登录成功');
      navigate('/home');
    } catch (error) {
      message.error(error.message);
      await refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 显示注册模态框
  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };

  // 关闭注册模态框
  const handleCancelRegister = () => {
    setIsRegisterModalVisible(false);
    registerForm.resetFields(); // 重置注册表单状态
  };

  // 提交注册
  const handleRegisterSubmit = async (values) => {
    console.log("输出", values)
    try {
      // 确保API路径正确，根据实际情况调整
      const res = await post('/admin/account', { ...values, accountType: 2 });
      if(res.code == 1) {
        message.error(res.message);
        return
      }
      message.success('注册成功，请登录');
      setIsRegisterModalVisible(false);
      registerForm.resetFields(); // 提交成功后清空表单
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="circles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="circle"></div>
          ))}
        </div>
      </div>
      
      <div className="login-content">
        <div className="login-panel">
          <div className="brand">
            <h1 className="brand-title">Hower Video</h1>
            <p className="brand-subtitle">创意无限 分享精彩</p>
          </div>
          
          <Form form={form} onFinish={handleSubmit} initialValues={{ username: '', password: '' }}>
            <Form.Item name="username" rules={rules.username}>
              <Input 
                placeholder="请输入用户名" 
                prefix={<UserOutlined className="input-icon" />} 
                size="large"
                className="custom-input" 
              />
            </Form.Item>
            
            <Form.Item name="password" rules={rules.password}>
              <Input.Password 
                placeholder="请输入密码" 
                size="large" 
                prefix={<LockOutlined className="input-icon" />}
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                className="custom-input"
              />
            </Form.Item>
            
            <div className="code-container">
              <Form.Item name="captcha" rules={rules.captcha}>
                <Input 
                  placeholder="验证码" 
                  size="large" 
                  maxLength={4} 
                  className="code-input custom-input" 
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
          
          <div className="login-footer">
            <span>还没有账号？</span>
            <Button type="link" onClick={showRegisterModal} className="register-link">
              立即注册
            </Button>
          </div>
        </div>
      </div>

      <Modal 
        title="用户注册" 
        open={isRegisterModalVisible} 
        onCancel={handleCancelRegister} 
        className="register-modal"
        footer={null}
      >
        <Form form={registerForm} onFinish={handleRegisterSubmit}>
          <Form.Item name="username" rules={rules.username}>
            <Input 
              placeholder="请输入用户名" 
              prefix={<UserOutlined />} 
              size="large"
              className="custom-input" 
            />
          </Form.Item>
          
          <Form.Item name="password" rules={rules.password}>
            <Input.Password 
              placeholder="请输入密码" 
              size="large"
              prefix={<LockOutlined />}
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              className="custom-input"
            />
          </Form.Item>
      
          <Form.Item name="confirmPassword" rules={rules.confirmPassword}>
            <Input.Password 
              placeholder="请确认密码" 
              size="large"
              prefix={<LockOutlined />}
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              className="custom-input"
            />
          </Form.Item>
          
          <Form.Item className="register-btns">
            <Button type="primary" htmlType="submit" className="register-submit">
              注册
            </Button>
            <Button onClick={handleCancelRegister}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
