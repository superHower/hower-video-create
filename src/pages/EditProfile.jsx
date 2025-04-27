import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Avatar, Radio, InputNumber } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { post, get, put, upload } from '../utils/request';  // 添加 upload
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/inedx';
import '../assets/css/editprofile.css';

const EditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const { id } = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await get(`/admin/account/${id}`);
        if (response.id) {
          const { username, nickname, age, gender, info, avatar } = response;
          setAvatarUrl(avatar);
          form.setFieldsValue({
            username,
            nickname,
            age,
            gender,
            info,
          });
        }
      } catch (error) {
        message.error('获取用户信息失败');
      }
    };

    if (id) {
      fetchUserInfo();
    }
  }, [form, id]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess(res);  // 标记上传成功
      setAvatarUrl(res.result.data.url);
      message.success('图片上传成功');
    } catch (error) {
      onError(error);
      message.error('图片上传失败');
    }
  };

  // 简化状态处理
  const handleAvatarChange = ({ file }) => {
    if (file.status === 'done') {
      // 这里的状态已经在 customRequest 中处理
    } else if (file.status === 'error') {
      message.error('图片上传失败');
    }
  };

  // 添加密码验证规则
  const validatePassword = (_, value) => {
    if (value && value.length < 6) {
      return Promise.reject('密码长度至少6位');
    }
    return Promise.resolve();
  };

  // 确认密码验证
  const validateConfirmPassword = (_, value) => {
    const password = form.getFieldValue('password');
    if (value && password && value !== password) {
      return Promise.reject('两次输入的密码不一致');
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { password, confirmPassword, ...otherValues } = values;
      const submitData = {
        ...otherValues,
        id,
        avatar: avatarUrl || undefined
      };

      // 如果输入了新密码，则添加到提交数据中
      if (password) {
        submitData.password = password;
      }

      await put(`/admin/account/${id}`, submitData);
      message.success('更新成功');
      
      // 如果修改了密码，清空密码字段
      if (password) {
        form.setFieldsValue({
          password: undefined,
          confirmPassword: undefined
        });
      }
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加文件大小检查函数
  const beforeUpload = (file) => {
    const maxSize = 10 * 1024 * 1024; // 5MB
    console.log("输出", file.size)
    if (file.size > maxSize) {
      message.error('图片大小不能超过 10MB');
      return false;
    }
    return true;
  };

  return (
    <div className="edit-profile-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="edit-profile-form"
      >
        <div className="avatar-upload">
          <Form.Item label="头像">
            <Upload
              name="avatar"
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={handleUpload}  // 关键优化
              onChange={handleAvatarChange}
              maxCount={1}
            >
              {avatarUrl ? (
                <Avatar src={avatarUrl} size={100} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传头像(不超过10MB)</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div>

        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          name="age"
          label="年龄"
        >
          <InputNumber min={1} max={120} placeholder="请输入年龄" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
        >
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
            <Radio value={0}>保密</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="info"
          label="个人简介"
        >
          <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
        </Form.Item>

        <Form.Item
          name="password"
          label="新密码"
          rules={[{ validator: validatePassword }]}
        >
          <Input.Password placeholder="不修改请留空" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['password']}
          rules={[{ validator: validateConfirmPassword }]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;