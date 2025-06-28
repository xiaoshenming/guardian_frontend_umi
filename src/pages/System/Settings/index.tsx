import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Divider,
  Space,
  Modal,
  Table,
  Tag,
  Popconfirm,
  Alert,
  Tabs,
} from 'antd';
import {
  UploadOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  MailOutlined,
  BellOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SystemSettings {
  // 基本设置
  basic: {
    systemName: string;
    systemDescription: string;
    systemLogo: string;
    timezone: string;
    language: string;
    dateFormat: string;
    theme: string;
  };
  // 安全设置
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expirationDays: number;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorRequired: boolean;
    ipWhitelist: string[];
  };
  // 邮件设置
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpSsl: boolean;
    fromEmail: string;
    fromName: string;
  };
  // 短信设置
  sms: {
    provider: string;
    apiKey: string;
    apiSecret: string;
    signature: string;
  };
  // 数据库设置
  database: {
    backupEnabled: boolean;
    backupInterval: number;
    backupRetention: number;
    maintenanceWindow: string;
  };
  // 系统监控
  monitoring: {
    enabled: boolean;
    alertThreshold: {
      cpu: number;
      memory: number;
      disk: number;
    };
    logLevel: string;
    logRetention: number;
  };
}

interface IPWhitelistItem {
  id: string;
  ip: string;
  description: string;
  enabled: boolean;
  createdAt: string;
}

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [ipForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSms, setTestingSms] = useState(false);
  const [ipModalVisible, setIpModalVisible] = useState(false);
  const [editingIp, setEditingIp] = useState<IPWhitelistItem | null>(null);
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelistItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    basic: {
      systemName: 'Guardian 安全管理系统',
      systemDescription: '智能安全监控与管理平台',
      systemLogo: '',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      dateFormat: 'YYYY-MM-DD',
      theme: 'light',
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        expirationDays: 90,
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorRequired: false,
      ipWhitelist: [],
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      smtpSsl: true,
      fromEmail: '',
      fromName: 'Guardian System',
    },
    sms: {
      provider: 'aliyun',
      apiKey: '',
      apiSecret: '',
      signature: 'Guardian',
    },
    database: {
      backupEnabled: true,
      backupInterval: 24,
      backupRetention: 30,
      maintenanceWindow: '02:00-04:00',
    },
    monitoring: {
      enabled: true,
      alertThreshold: {
        cpu: 80,
        memory: 85,
        disk: 90,
      },
      logLevel: 'info',
      logRetention: 30,
    },
  });

  useEffect(() => {
    fetchSystemSettings();
    fetchIpWhitelist();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      // TODO: 调用获取系统设置的API
      form.setFieldsValue(settings);
    } catch (error) {
      message.error('获取系统设置失败');
    }
  };

  const fetchIpWhitelist = async () => {
    try {
      // TODO: 调用获取IP白名单的API
      const mockData: IPWhitelistItem[] = [
        {
          id: '1',
          ip: '192.168.1.0/24',
          description: '内网IP段',
          enabled: true,
          createdAt: '2024-01-15 10:30:00',
        },
        {
          id: '2',
          ip: '10.0.0.100',
          description: '管理员IP',
          enabled: true,
          createdAt: '2024-01-10 14:20:00',
        },
      ];
      setIpWhitelist(mockData);
    } catch (error) {
      message.error('获取IP白名单失败');
    }
  };

  const handleSaveSettings = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用保存系统设置的API
      setSettings({ ...settings, ...values });
      message.success('系统设置已保存');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const emailSettings = form.getFieldValue('email');
      // TODO: 调用测试邮件发送的API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟API调用
      message.success('测试邮件发送成功');
    } catch (error) {
      message.error('测试邮件发送失败');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleTestSms = async () => {
    setTestingSms(true);
    try {
      const smsSettings = form.getFieldValue('sms');
      // TODO: 调用测试短信发送的API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟API调用
      message.success('测试短信发送成功');
    } catch (error) {
      message.error('测试短信发送失败');
    } finally {
      setTestingSms(false);
    }
  };

  const handleSaveIp = async (values: any) => {
    try {
      if (editingIp) {
        // 编辑IP
        const updatedList = ipWhitelist.map((item) =>
          item.id === editingIp.id ? { ...item, ...values } : item,
        );
        setIpWhitelist(updatedList);
        message.success('IP白名单已更新');
      } else {
        // 新增IP
        const newIp: IPWhitelistItem = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toLocaleString(),
        };
        setIpWhitelist([...ipWhitelist, newIp]);
        message.success('IP白名单已添加');
      }

      setIpModalVisible(false);
      setEditingIp(null);
      ipForm.resetFields();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const handleEditIp = (ip: IPWhitelistItem) => {
    setEditingIp(ip);
    ipForm.setFieldsValue(ip);
    setIpModalVisible(true);
  };

  const handleDeleteIp = async (ipId: string) => {
    try {
      setIpWhitelist(ipWhitelist.filter((item) => item.id !== ipId));
      message.success('IP白名单已删除');
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const handleToggleIp = async (ipId: string, enabled: boolean) => {
    try {
      const updatedList = ipWhitelist.map((item) =>
        item.id === ipId ? { ...item, enabled } : item,
      );
      setIpWhitelist(updatedList);
      message.success(enabled ? 'IP已启用' : 'IP已禁用');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        // 更新logo URL
        form.setFieldValue(['basic', 'systemLogo'], info.file.response.url);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const ipColumns = [
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: IPWhitelistItem) => (
        <Switch
          size="small"
          checked={enabled}
          onChange={(checked) => handleToggleIp(record.id, checked)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IPWhitelistItem) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditIp(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个IP吗？"
            onConfirm={() => handleDeleteIp(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Form form={form} layout="vertical" onFinish={handleSaveSettings}>
        <Tabs defaultActiveKey="basic">
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                基本设置
              </span>
            }
            key="basic"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="系统信息">
                  <Form.Item
                    name={['basic', 'systemName']}
                    label="系统名称"
                    rules={[{ required: true, message: '请输入系统名称' }]}
                  >
                    <Input placeholder="请输入系统名称" />
                  </Form.Item>

                  <Form.Item name={['basic', 'systemDescription']} label="系统描述">
                    <TextArea rows={3} placeholder="请输入系统描述" />
                  </Form.Item>

                  <Form.Item name={['basic', 'systemLogo']} label="系统Logo">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>上传Logo</Button>
                    </Upload>
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="显示设置">
                  <Form.Item
                    name={['basic', 'timezone']}
                    label="时区"
                    rules={[{ required: true, message: '请选择时区' }]}
                  >
                    <Select placeholder="选择时区">
                      <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
                      <Option value="UTC">UTC (UTC+0)</Option>
                      <Option value="America/New_York">America/New_York (UTC-5)</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={['basic', 'language']}
                    label="语言"
                    rules={[{ required: true, message: '请选择语言' }]}
                  >
                    <Select placeholder="选择语言">
                      <Option value="zh-CN">简体中文</Option>
                      <Option value="en-US">English</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={['basic', 'dateFormat']}
                    label="日期格式"
                    rules={[{ required: true, message: '请选择日期格式' }]}
                  >
                    <Select placeholder="选择日期格式">
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={['basic', 'theme']}
                    label="主题"
                    rules={[{ required: true, message: '请选择主题' }]}
                  >
                    <Select placeholder="选择主题">
                      <Option value="light">浅色主题</Option>
                      <Option value="dark">深色主题</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            }
            key="security"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="密码策略">
                  <Form.Item
                    name={['security', 'passwordPolicy', 'minLength']}
                    label="最小长度"
                    rules={[{ required: true, message: '请输入最小长度' }]}
                  >
                    <InputNumber min={6} max={20} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['security', 'passwordPolicy', 'requireUppercase']}
                    valuePropName="checked"
                  >
                    <Switch /> 要求大写字母
                  </Form.Item>

                  <Form.Item
                    name={['security', 'passwordPolicy', 'requireLowercase']}
                    valuePropName="checked"
                  >
                    <Switch /> 要求小写字母
                  </Form.Item>

                  <Form.Item
                    name={['security', 'passwordPolicy', 'requireNumbers']}
                    valuePropName="checked"
                  >
                    <Switch /> 要求数字
                  </Form.Item>

                  <Form.Item
                    name={['security', 'passwordPolicy', 'requireSpecialChars']}
                    valuePropName="checked"
                  >
                    <Switch /> 要求特殊字符
                  </Form.Item>

                  <Form.Item
                    name={['security', 'passwordPolicy', 'expirationDays']}
                    label="密码有效期（天）"
                  >
                    <InputNumber min={0} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="登录安全">
                  <Form.Item
                    name={['security', 'sessionTimeout']}
                    label="会话超时（分钟）"
                    rules={[{ required: true, message: '请输入会话超时时间' }]}
                  >
                    <InputNumber min={5} max={480} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['security', 'maxLoginAttempts']}
                    label="最大登录尝试次数"
                    rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                  >
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['security', 'lockoutDuration']}
                    label="锁定时长（分钟）"
                    rules={[{ required: true, message: '请输入锁定时长' }]}
                  >
                    <InputNumber min={5} max={60} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name={['security', 'twoFactorRequired']} valuePropName="checked">
                    <Switch /> 强制双因子认证
                  </Form.Item>
                </Card>

                <Card title="IP白名单" style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingIp(null);
                        ipForm.resetFields();
                        setIpModalVisible(true);
                      }}
                    >
                      添加IP
                    </Button>
                  </div>
                  <Table
                    dataSource={ipWhitelist}
                    columns={ipColumns}
                    rowKey="id"
                    size="small"
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <MailOutlined />
                邮件设置
              </span>
            }
            key="email"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="SMTP配置">
                  <Form.Item
                    name={['email', 'smtpHost']}
                    label="SMTP服务器"
                    rules={[{ required: true, message: '请输入SMTP服务器' }]}
                  >
                    <Input placeholder="smtp.example.com" />
                  </Form.Item>

                  <Form.Item
                    name={['email', 'smtpPort']}
                    label="端口"
                    rules={[{ required: true, message: '请输入端口' }]}
                  >
                    <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['email', 'smtpUser']}
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input placeholder="请输入SMTP用户名" />
                  </Form.Item>

                  <Form.Item
                    name={['email', 'smtpPassword']}
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password placeholder="请输入SMTP密码" />
                  </Form.Item>

                  <Form.Item name={['email', 'smtpSsl']} valuePropName="checked">
                    <Switch /> 启用SSL/TLS
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="发件人设置">
                  <Form.Item
                    name={['email', 'fromEmail']}
                    label="发件人邮箱"
                    rules={[
                      { required: true, message: '请输入发件人邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="noreply@example.com" />
                  </Form.Item>

                  <Form.Item
                    name={['email', 'fromName']}
                    label="发件人名称"
                    rules={[{ required: true, message: '请输入发件人名称' }]}
                  >
                    <Input placeholder="Guardian System" />
                  </Form.Item>

                  <Divider />

                  <Space>
                    <Button
                      type="primary"
                      icon={<BellOutlined />}
                      loading={testingEmail}
                      onClick={handleTestEmail}
                    >
                      发送测试邮件
                    </Button>
                  </Space>

                  <Alert
                    message="测试邮件将发送到当前用户的邮箱地址"
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                短信设置
              </span>
            }
            key="sms"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="短信服务商">
                  <Form.Item
                    name={['sms', 'provider']}
                    label="服务商"
                    rules={[{ required: true, message: '请选择服务商' }]}
                  >
                    <Select placeholder="选择短信服务商">
                      <Option value="aliyun">阿里云</Option>
                      <Option value="tencent">腾讯云</Option>
                      <Option value="huawei">华为云</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={['sms', 'apiKey']}
                    label="API Key"
                    rules={[{ required: true, message: '请输入API Key' }]}
                  >
                    <Input placeholder="请输入API Key" />
                  </Form.Item>

                  <Form.Item
                    name={['sms', 'apiSecret']}
                    label="API Secret"
                    rules={[{ required: true, message: '请输入API Secret' }]}
                  >
                    <Input.Password placeholder="请输入API Secret" />
                  </Form.Item>

                  <Form.Item
                    name={['sms', 'signature']}
                    label="短信签名"
                    rules={[{ required: true, message: '请输入短信签名' }]}
                  >
                    <Input placeholder="Guardian" />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="测试短信">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      icon={<BellOutlined />}
                      loading={testingSms}
                      onClick={handleTestSms}
                      block
                    >
                      发送测试短信
                    </Button>

                    <Alert message="测试短信将发送到当前用户的手机号码" type="info" showIcon />
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <DatabaseOutlined />
                数据库设置
              </span>
            }
            key="database"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="备份设置">
                  <Form.Item name={['database', 'backupEnabled']} valuePropName="checked">
                    <Switch /> 启用自动备份
                  </Form.Item>

                  <Form.Item
                    name={['database', 'backupInterval']}
                    label="备份间隔（小时）"
                    rules={[{ required: true, message: '请输入备份间隔' }]}
                  >
                    <InputNumber min={1} max={168} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['database', 'backupRetention']}
                    label="备份保留天数"
                    rules={[{ required: true, message: '请输入备份保留天数' }]}
                  >
                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['database', 'maintenanceWindow']}
                    label="维护窗口"
                    rules={[{ required: true, message: '请输入维护窗口' }]}
                  >
                    <Input placeholder="02:00-04:00" />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="监控设置">
                  <Form.Item name={['monitoring', 'enabled']} valuePropName="checked">
                    <Switch /> 启用系统监控
                  </Form.Item>

                  <Form.Item
                    name={['monitoring', 'alertThreshold', 'cpu']}
                    label="CPU告警阈值（%）"
                    rules={[{ required: true, message: '请输入CPU告警阈值' }]}
                  >
                    <InputNumber min={50} max={95} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['monitoring', 'alertThreshold', 'memory']}
                    label="内存告警阈值（%）"
                    rules={[{ required: true, message: '请输入内存告警阈值' }]}
                  >
                    <InputNumber min={50} max={95} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['monitoring', 'alertThreshold', 'disk']}
                    label="磁盘告警阈值（%）"
                    rules={[{ required: true, message: '请输入磁盘告警阈值' }]}
                  >
                    <InputNumber min={70} max={95} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['monitoring', 'logLevel']}
                    label="日志级别"
                    rules={[{ required: true, message: '请选择日志级别' }]}
                  >
                    <Select placeholder="选择日志级别">
                      <Option value="debug">Debug</Option>
                      <Option value="info">Info</Option>
                      <Option value="warn">Warn</Option>
                      <Option value="error">Error</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={['monitoring', 'logRetention']}
                    label="日志保留天数"
                    rules={[{ required: true, message: '请输入日志保留天数' }]}
                  >
                    <InputNumber min={7} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
            >
              保存设置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                form.resetFields();
                fetchSystemSettings();
              }}
              size="large"
            >
              重置
            </Button>
          </Space>
        </div>
      </Form>

      {/* IP白名单编辑弹窗 */}
      <Modal
        title={editingIp ? '编辑IP白名单' : '添加IP白名单'}
        open={ipModalVisible}
        onCancel={() => {
          setIpModalVisible(false);
          setEditingIp(null);
          ipForm.resetFields();
        }}
        footer={null}
      >
        <Form form={ipForm} layout="vertical" onFinish={handleSaveIp}>
          <Form.Item
            name="ip"
            label="IP地址"
            rules={[
              { required: true, message: '请输入IP地址' },
              {
                pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/,
                message: '请输入有效的IP地址或CIDR',
              },
            ]}
          >
            <Input placeholder="192.168.1.1 或 192.168.1.0/24" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="请输入IP描述" />
          </Form.Item>

          <Form.Item name="enabled" valuePropName="checked" initialValue={true}>
            <Switch /> 启用
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setIpModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemSettings;
