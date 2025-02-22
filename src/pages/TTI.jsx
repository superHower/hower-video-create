import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import VideoUploader from '../components/upload/VideoUploader';
const App = () => (
  <Form
    labelCol={{
      span: 4,
    }}
  >
    <Form.Item label="视频" name="photos">
      <VideoUploader />
    </Form.Item>
  </Form>
);
export default App;