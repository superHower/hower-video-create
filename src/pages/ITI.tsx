import React from 'react';
import { Form, Button } from 'antd';
import ImageUploader from '../components/upload/ImageUploader';

const ITI =() => {
  const [form] = Form.useForm();
  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    // 这里处理提交逻辑
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        label="产品主图"
        name="images"
        rules={[{ required: true, message: '请上传产品图片' }]}
      >
        <ImageUploader/>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
export default ITI