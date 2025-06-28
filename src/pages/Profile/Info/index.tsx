import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Avatar,
  Space,
  Divider,
  Select,
  DatePicker,
} from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  realName: string;
  avatar?: string;
  gender: 'male' | 'female' | 'other';
  birthday?: string;
  location?: string;
  bio?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const ProfileInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // TODO: 调用获取用户信息的API
      // 模拟数据
      const profile: UserProfile = {
        id: '1',
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        realName: '张三',
        gender: 'male',
        birthday: '1990-01-01',
        location: '北京市朝阳区',
        bio: '热爱生活，关注家人安全健康。',
        emergencyContact: {
          name: '李四',
          phone: '13800138002',
          relationship: '配偶',
        },
      };
      setUserProfile(profile);
      form.setFieldsValue({
        ...profile,
        birthday: profile.birthday ? dayjs(profile.birthday) : undefined,
      });
    } catch (error) {
      message.error('获取用户信息失败');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 处理生日格式
      const submitData = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : undefined,
      };

      // TODO: 调用更新用户信息的API
      console.log('更新用户信息:', submitData);
      message.success('个人信息已更新');
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  if (!userProfile) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="个人头像" style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={userProfile.avatar}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            >
              {userProfile.realName?.charAt(0)}
            </Avatar>
            <div>
              <h3>{userProfile.realName}</h3>
              <p style={{ color: '#999' }}>@{userProfile.username}</p>
            </div>
            {editing && (
              <Upload
                name="avatar"
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                style={{ marginTop: 16 }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            )}
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="个人信息"
            extra={
              <Space>
                {!editing ? (
                  <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                    编辑信息
                  </Button>
                ) : (
                  <Space>
                    <Button
                      onClick={() => {
                        setEditing(false);
                        form.setFieldsValue({
                          ...userProfile,
                          birthday: userProfile.birthday ? dayjs(userProfile.birthday) : undefined,
                        });
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={() => form.submit()}
                      loading={loading}
                    >
                      保存
                    </Button>
                  </Space>
                )}
              </Space>
            }
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={!editing}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="realName"
                    label="真实姓名"
                    rules={[
                      { required: true, message: '请输入真实姓名' },
                      { min: 2, max: 20, message: '姓名长度应在2-20个字符之间' },
                    ]}
                  >
                    <Input placeholder="请输入真实姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, max: 20, message: '用户名长度应在3-20个字符之间' },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
                    ]}
                  >
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="邮箱地址"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="请输入邮箱地址" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="手机号码"
                    rules={[
                      { required: true, message: '请输入手机号码' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
                    ]}
                  >
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="gender" label="性别">
                    <Select placeholder="请选择性别">
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="birthday" label="生日">
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="请选择生日"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="location" label="所在地区">
                <Input placeholder="请输入所在地区" />
              </Form.Item>

              <Form.Item name="bio" label="个人简介">
                <TextArea rows={3} placeholder="介绍一下自己吧" maxLength={200} showCount />
              </Form.Item>

              <Divider orientation="left">紧急联系人</Divider>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name={['emergencyContact', 'name']}
                    label="联系人姓名"
                    rules={[{ required: true, message: '请输入紧急联系人姓名' }]}
                  >
                    <Input placeholder="请输入联系人姓名" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['emergencyContact', 'phone']}
                    label="联系人电话"
                    rules={[
                      { required: true, message: '请输入联系人电话' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
                    ]}
                  >
                    <Input placeholder="请输入联系人电话" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['emergencyContact', 'relationship']}
                    label="关系"
                    rules={[{ required: true, message: '请选择关系' }]}
                  >
                    <Select placeholder="请选择关系">
                      <Option value="配偶">配偶</Option>
                      <Option value="父母">父母</Option>
                      <Option value="子女">子女</Option>
                      <Option value="兄弟姐妹">兄弟姐妹</Option>
                      <Option value="朋友">朋友</Option>
                      <Option value="同事">同事</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileInfo;
