import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Switch,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Space,
  Divider,
  Modal,
  Alert,
  Tabs,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface CircleSettings {
  name: string;
  description: string;
  type: 'family' | 'friends' | 'work' | 'community';
  privacy: 'public' | 'private' | 'invite_only';
  maxMembers: number;
  allowInvite: boolean;
  requireApproval: boolean;
  location?: string;
  tags?: string[];
  notifications: {
    memberJoin: boolean;
    memberLeave: boolean;
    deviceAlert: boolean;
    emergencyAlert: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    ipWhitelist: string[];
    sessionTimeout: number;
  };
}

const CircleSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchCircleSettings();
  }, [id]);

  const fetchCircleSettings = async () => {
    try {
      // TODO: 调用获取守护圈设置的API
      // 模拟数据
      const settings: CircleSettings = {
        name: '我的家庭圈',
        description: '这是我们温馨的家庭守护圈，关注每个家庭成员的安全和健康。',
        type: 'family',
        privacy: 'private',
        maxMembers: 10,
        allowInvite: true,
        requireApproval: false,
        location: '北京市朝阳区',
        tags: ['家庭', '安全', '健康'],
        notifications: {
          memberJoin: true,
          memberLeave: true,
          deviceAlert: true,
          emergencyAlert: true,
        },
        security: {
          twoFactorAuth: false,
          ipWhitelist: [],
          sessionTimeout: 30,
        },
      };
      form.setFieldsValue(settings);
    } catch (error) {
      message.error('获取设置失败');
    }
  };

  const handleSubmit = async (values: CircleSettings) => {
    setLoading(true);
    try {
      // TODO: 调用更新守护圈设置的API
      console.log('更新设置:', values);
      message.success('设置已保存');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCircle = () => {
    Modal.confirm({
      title: '确认删除守护圈？',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>删除守护圈将会：</p>
          <ul>
            <li>永久删除所有圈内数据</li>
            <li>移除所有成员</li>
            <li>删除所有设备关联</li>
            <li>清除所有历史记录</li>
          </ul>
          <p style={{ color: 'red', fontWeight: 'bold' }}>此操作不可恢复！</p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用删除守护圈的API
          message.success('守护圈已删除');
          history.push('/circles/list');
        } catch (error) {
          message.error('删除失败，请重试');
        }
      },
    });
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>更换头像</div>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
              返回
            </Button>
            守护圈设置
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="基本设置" key="basic">
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item
                    name="name"
                    label="守护圈名称"
                    rules={[
                      { required: true, message: '请输入守护圈名称' },
                      { min: 2, max: 50, message: '名称长度应在2-50个字符之间' },
                    ]}
                  >
                    <Input placeholder="请输入守护圈名称" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="描述"
                    rules={[
                      { required: true, message: '请输入守护圈描述' },
                      { max: 500, message: '描述不能超过500个字符' },
                    ]}
                  >
                    <TextArea rows={4} placeholder="请描述这个守护圈的用途和特点" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="type"
                        label="守护圈类型"
                        rules={[{ required: true, message: '请选择守护圈类型' }]}
                      >
                        <Select placeholder="选择类型">
                          <Option value="family">家庭圈</Option>
                          <Option value="friends">朋友圈</Option>
                          <Option value="work">工作圈</Option>
                          <Option value="community">社区圈</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="privacy"
                        label="隐私设置"
                        rules={[{ required: true, message: '请选择隐私设置' }]}
                      >
                        <Select placeholder="选择隐私级别">
                          <Option value="public">公开</Option>
                          <Option value="private">私密</Option>
                          <Option value="invite_only">仅邀请</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="maxMembers"
                    label="最大成员数"
                    rules={[
                      { required: true, message: '请设置最大成员数' },
                      { type: 'number', min: 2, max: 1000, message: '成员数应在2-1000之间' },
                    ]}
                  >
                    <InputNumber
                      min={2}
                      max={1000}
                      style={{ width: '100%' }}
                      placeholder="设置最大成员数"
                    />
                  </Form.Item>

                  <Form.Item name="location" label="位置（可选）">
                    <Input placeholder="请输入位置信息" />
                  </Form.Item>

                  <Form.Item name="tags" label="标签（可选）">
                    <Select
                      mode="tags"
                      placeholder="添加标签，按回车确认"
                      style={{ width: '100%' }}
                    >
                      <Option value="安全">安全</Option>
                      <Option value="健康">健康</Option>
                      <Option value="学习">学习</Option>
                      <Option value="娱乐">娱乐</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="守护圈头像">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={() => false}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>

                  <Card title="权限设置" size="small">
                    <Form.Item name="allowInvite" label="允许成员邀请他人" valuePropName="checked">
                      <Switch />
                    </Form.Item>

                    <Form.Item name="requireApproval" label="加入需要审批" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="通知设置" key="notifications">
              <Card title="通知偏好" size="small">
                <Form.Item
                  name={['notifications', 'memberJoin']}
                  label="成员加入通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name={['notifications', 'memberLeave']}
                  label="成员离开通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name={['notifications', 'deviceAlert']}
                  label="设备告警通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name={['notifications', 'emergencyAlert']}
                  label="紧急告警通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Card>
            </TabPane>

            <TabPane tab="安全设置" key="security">
              <Card title="安全选项" size="small">
                <Form.Item
                  name={['security', 'twoFactorAuth']}
                  label="启用双因子认证"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name={['security', 'sessionTimeout']}
                  label="会话超时时间（分钟）"
                  rules={[
                    { type: 'number', min: 5, max: 1440, message: '超时时间应在5-1440分钟之间' },
                  ]}
                >
                  <InputNumber
                    min={5}
                    max={1440}
                    style={{ width: '100%' }}
                    placeholder="设置会话超时时间"
                  />
                </Form.Item>
                <Form.Item name={['security', 'ipWhitelist']} label="IP白名单（可选）">
                  <Select
                    mode="tags"
                    placeholder="添加允许访问的IP地址"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Card>
            </TabPane>

            <TabPane tab="危险操作" key="danger">
              <Alert
                message="危险操作区域"
                description="以下操作将对守护圈造成不可逆的影响，请谨慎操作。"
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
              <Card title="删除守护圈" size="small">
                <p>删除守护圈将永久删除所有相关数据，包括成员、设备、历史记录等。</p>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteCircle}
                >
                  删除守护圈
                </Button>
              </Card>
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
              <Button onClick={() => history.back()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CircleSettings;
