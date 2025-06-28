import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Row, Col, Upload, Avatar, Button } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { systemAPI } from '@/services/api';

const { Option } = Select;
const { TextArea } = Input;

interface CreateUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const response = await systemAPI.createUser({
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        realName: values.realName,
        role: values.role,
        department: values.department,
        description: values.description,
        avatar: avatarUrl,
      });

      if (response.code === 200) {
        message.success('用户创建成功！');
        form.resetFields();
        setAvatarUrl('');
        setFileList([]);
        onSuccess();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarUrl('');
    setFileList([]);
    onCancel();
  };

  // 头像上传处理
  const handleAvatarChange = (info: any) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (info.file.status === 'done') {
      // 假设上传成功后返回图片URL
      const url = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  // 上传前验证
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
      return false;
    }
    return true;
  };

  return (
    <Modal
      title="添加用户"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: 'viewer',
        }}
      >
        {/* 头像上传 */}
        <Form.Item label="头像">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar
              size={64}
              src={avatarUrl}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <Upload
              name="avatar"
              listType="text"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleAvatarChange}
              showUploadList={false}
              action="/api/upload/avatar" // 实际的上传接口
            >
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </div>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 20, message: '用户名长度为3-20个字符' },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: '用户名只能包含字母、数字和下划线',
                },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="realName"
              label="真实姓名"
              rules={[
                { required: true, message: '请输入真实姓名' },
                { max: 20, message: '姓名不能超过20个字符' },
              ]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入有效的手机号',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 20, message: '密码长度为6-20个字符' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次输入密码" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="用户角色"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select placeholder="请选择用户角色">
                <Option value="admin">系统管理员</Option>
                <Option value="manager">安全管理员</Option>
                <Option value="operator">操作员</Option>
                <Option value="viewer">观察员</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="所属部门"
              rules={[{ max: 50, message: '部门名称不能超过50个字符' }]}
            >
              <Input placeholder="请输入所属部门" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="用户描述"
          rules={[{ max: 200, message: '描述不能超过200个字符' }]}
        >
          <TextArea rows={3} placeholder="请输入用户描述" showCount maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
