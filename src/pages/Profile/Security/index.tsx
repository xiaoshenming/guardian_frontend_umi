import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  message,
  Row,
  Col,
  Space,
  Divider,
  List,
  Tag,
  Modal,
  QRCode,
  Steps,
  Alert,
  Table,
  Popconfirm,
} from 'antd';
import {
  LockOutlined,
  SafetyOutlined,
  MobileOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Step } = Steps;

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotification: boolean;
  deviceNotification: boolean;
  ipWhitelist: string[];
  sessionTimeout: number;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  addedTime: string;
  lastUsed: string;
}

const ProfileSecurity: React.FC = () => {
  const [passwordForm] = Form.useForm();
  const [twoFactorForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotification: true,
    deviceNotification: true,
    ipWhitelist: [],
    sessionTimeout: 30,
  });
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(0);
  const [qrCodeSecret, setQrCodeSecret] = useState('');

  useEffect(() => {
    fetchSecuritySettings();
    fetchLoginSessions();
    fetchTrustedDevices();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      // TODO: 调用获取安全设置的API
      // 模拟数据已在初始状态中设置
    } catch (error) {
      message.error('获取安全设置失败');
    }
  };

  const fetchLoginSessions = async () => {
    try {
      // TODO: 调用获取登录会话的API
      const mockSessions: LoginSession[] = [
        {
          id: '1',
          device: 'Chrome on Windows',
          location: '北京市',
          ip: '192.168.1.100',
          loginTime: '2024-01-20 10:30',
          lastActive: '2024-01-20 15:45',
          isCurrent: true,
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: '上海市',
          ip: '192.168.1.101',
          loginTime: '2024-01-19 14:20',
          lastActive: '2024-01-19 18:30',
          isCurrent: false,
        },
      ];
      setSessions(mockSessions);
    } catch (error) {
      message.error('获取登录会话失败');
    }
  };

  const fetchTrustedDevices = async () => {
    try {
      // TODO: 调用获取可信设备的API
      const mockDevices: TrustedDevice[] = [
        {
          id: '1',
          name: '我的iPhone',
          type: 'mobile',
          addedTime: '2024-01-15',
          lastUsed: '2024-01-20',
        },
        {
          id: '2',
          name: '办公电脑',
          type: 'desktop',
          addedTime: '2024-01-10',
          lastUsed: '2024-01-20',
        },
      ];
      setTrustedDevices(mockDevices);
    } catch (error) {
      message.error('获取可信设备失败');
    }
  };

  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用修改密码的API
      console.log('修改密码:', values);
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof SecuritySettings, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      // TODO: 调用更新安全设置的API
      message.success('设置已更新');
    } catch (error) {
      message.error('设置更新失败');
    }
  };

  const handleEnableTwoFactor = () => {
    setTwoFactorStep(0);
    setQrCodeSecret('JBSWY3DPEHPK3PXP'); // 模拟密钥
    setTwoFactorModalVisible(true);
  };

  const handleTwoFactorVerify = async (values: any) => {
    try {
      // TODO: 调用验证双因子认证的API
      console.log('验证码:', values.code);
      message.success('双因子认证已启用');
      setSettings({ ...settings, twoFactorEnabled: true });
      setTwoFactorModalVisible(false);
      twoFactorForm.resetFields();
    } catch (error) {
      message.error('验证失败，请重试');
    }
  };

  const handleDisableTwoFactor = () => {
    Modal.confirm({
      title: '确认关闭双因子认证？',
      content: '关闭后您的账户安全性将降低，确定要关闭吗？',
      onOk: async () => {
        try {
          // TODO: 调用关闭双因子认证的API
          setSettings({ ...settings, twoFactorEnabled: false });
          message.success('双因子认证已关闭');
        } catch (error) {
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // TODO: 调用终止会话的API
      setSessions(sessions.filter((s) => s.id !== sessionId));
      message.success('会话已终止');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleRemoveTrustedDevice = async (deviceId: string) => {
    try {
      // TODO: 调用移除可信设备的API
      setTrustedDevices(trustedDevices.filter((d) => d.id !== deviceId));
      message.success('设备已移除');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const sessionColumns: ColumnsType<LoginSession> = [
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
      render: (device, record) => (
        <Space>
          {device}
          {record.isCurrent && <Tag color="green">当前会话</Tag>}
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {!record.isCurrent && (
            <Popconfirm
              title="确认终止此会话？"
              onConfirm={() => handleTerminateSession(record.id)}
            >
              <Button type="text" danger size="small">
                终止
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const deviceColumns: ColumnsType<TrustedDevice> = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <MobileOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          mobile: '手机',
          desktop: '电脑',
          tablet: '平板',
        };
        return typeMap[type as keyof typeof typeMap];
      },
    },
    {
      title: '添加时间',
      dataIndex: 'addedTime',
      key: 'addedTime',
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="确认移除此设备？" onConfirm={() => handleRemoveTrustedDevice(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} size="small">
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="修改密码" style={{ marginBottom: 24 }}>
            <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message: '密码长度至少8位' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: '密码必须包含大小写字母、数字和特殊字符',
                  },
                ]}
              >
                <Input.Password placeholder="请输入新密码" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                rules={[{ required: true, message: '请确认新密码' }]}
              >
                <Input.Password placeholder="请再次输入新密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="安全设置" style={{ marginBottom: 24 }}>
            <List>
              <List.Item
                actions={[
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onChange={(checked) => {
                      if (checked) {
                        handleEnableTwoFactor();
                      } else {
                        handleDisableTwoFactor();
                      }
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<SafetyOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                  title="双因子认证"
                  description="为您的账户添加额外的安全保护"
                />
              </List.Item>
              <List.Item
                actions={[
                  <Switch
                    checked={settings.loginNotification}
                    onChange={(checked) => handleSettingChange('loginNotification', checked)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<LockOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                  title="登录通知"
                  description="新设备登录时发送通知"
                />
              </List.Item>
              <List.Item
                actions={[
                  <Switch
                    checked={settings.deviceNotification}
                    onChange={(checked) => handleSettingChange('deviceNotification', checked)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<MobileOutlined style={{ fontSize: 20, color: '#fa8c16' }} />}
                  title="设备异常通知"
                  description="检测到异常设备活动时发送通知"
                />
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      <Card title="活跃会话" style={{ marginBottom: 24 }}>
        <Table columns={sessionColumns} dataSource={sessions} rowKey="id" pagination={false} />
      </Card>

      <Card title="可信设备">
        <Table columns={deviceColumns} dataSource={trustedDevices} rowKey="id" pagination={false} />
      </Card>

      {/* 双因子认证设置弹窗 */}
      <Modal
        title="启用双因子认证"
        open={twoFactorModalVisible}
        onCancel={() => {
          setTwoFactorModalVisible(false);
          twoFactorForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Steps current={twoFactorStep} style={{ marginBottom: 24 }}>
          <Step title="扫描二维码" />
          <Step title="输入验证码" />
          <Step title="完成设置" />
        </Steps>

        {twoFactorStep === 0 && (
          <div style={{ textAlign: 'center' }}>
            <Alert
              message="请使用身份验证器应用扫描二维码"
              description="推荐使用 Google Authenticator、Microsoft Authenticator 等应用"
              type="info"
              style={{ marginBottom: 24 }}
            />
            <QRCode
              value={`otpauth://totp/Guardian:user@example.com?secret=${qrCodeSecret}&issuer=Guardian`}
              size={200}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => setTwoFactorStep(1)}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {twoFactorStep === 1 && (
          <Form form={twoFactorForm} onFinish={handleTwoFactorVerify}>
            <Form.Item
              name="code"
              label="验证码"
              rules={[
                { required: true, message: '请输入6位验证码' },
                { len: 6, message: '验证码为6位数字' },
              ]}
            >
              <Input
                placeholder="请输入6位验证码"
                maxLength={6}
                style={{ fontSize: 18, textAlign: 'center' }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => setTwoFactorStep(0)}>上一步</Button>
                <Button type="primary" htmlType="submit">
                  验证并启用
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ProfileSecurity;
