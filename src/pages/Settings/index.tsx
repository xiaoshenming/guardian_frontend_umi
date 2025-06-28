import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  message,
  Divider,
  Select,
  InputNumber,
  Upload,
  Image,
  Space,
  Tabs,
  Row,
  Col,
  Alert,
  TimePicker,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  ReloadOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  BellOutlined,
  MailOutlined,
  PhoneOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { systemAPI } from '@/services/api';
import type { SystemSettings } from '@/services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = TimePicker;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  // 获取系统设置
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await systemAPI.getSettings();
      if (response.success) {
        setSettings(response.data);
        setLogoUrl(response.data.logo || '');
        form.setFieldsValue({
          ...response.data,
          maintenanceTime: response.data.maintenanceTime
            ? [
                dayjs(response.data.maintenanceTime.start, 'HH:mm'),
                dayjs(response.data.maintenanceTime.end, 'HH:mm'),
              ]
            : undefined,
        });
      }
    } catch (error) {
      message.error('获取系统设置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 保存设置
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const response = await systemAPI.updateSettings({
        ...values,
        logo: logoUrl,
        maintenanceTime: values.maintenanceTime
          ? {
              start: values.maintenanceTime[0].format('HH:mm'),
              end: values.maintenanceTime[1].format('HH:mm'),
            }
          : undefined,
      });

      if (response.success) {
        message.success('设置保存成功！');
        fetchSettings();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置设置
  const handleReset = () => {
    if (settings) {
      form.setFieldsValue({
        ...settings,
        maintenanceTime: settings.maintenanceTime
          ? [
              dayjs(settings.maintenanceTime.start, 'HH:mm'),
              dayjs(settings.maintenanceTime.end, 'HH:mm'),
            ]
          : undefined,
      });
      setLogoUrl(settings.logo || '');
      message.info('已重置为当前保存的设置');
    }
  };

  // Logo上传处理
  const handleLogoChange = (info: any) => {
    if (info.file.status === 'done') {
      const url = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      setLogoUrl(url);
      message.success('Logo上传成功');
    } else if (info.file.status === 'error') {
      message.error('Logo上传失败');
    }
  };

  // 测试邮件发送
  const testEmail = async () => {
    try {
      const values = form.getFieldsValue();
      const response = await systemAPI.testEmail({
        smtpHost: values.smtpHost,
        smtpPort: values.smtpPort,
        smtpUser: values.smtpUser,
        smtpPassword: values.smtpPassword,
        smtpSecure: values.smtpSecure,
      });

      if (response.success) {
        message.success('邮件发送测试成功！');
      } else {
        message.error(response.message || '邮件发送测试失败');
      }
    } catch (error) {
      message.error('邮件发送测试失败');
    }
  };

  return (
    <PageContainer
      title="系统设置"
      subTitle="配置系统参数和偏好设置"
      extra={[
        <Button key="reset" icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
        >
          保存设置
        </Button>,
      ]}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            autoBackup: true,
            enableNotification: true,
            enableEmail: false,
            enableSms: false,
            smtpPort: 587,
            smtpSecure: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            passwordMinLength: 6,
            enableMaintenance: false,
          }}
        >
          <Tabs defaultActiveKey="basic">
            {/* 基本设置 */}
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
                  <Form.Item
                    name="systemName"
                    label="系统名称"
                    rules={[{ required: true, message: '请输入系统名称' }]}
                  >
                    <Input placeholder="Guardian 安全管理系统" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="systemVersion"
                    label="系统版本"
                    rules={[{ required: true, message: '请输入系统版本' }]}
                  >
                    <Input placeholder="v1.0.0" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="systemDescription" label="系统描述">
                <TextArea rows={3} placeholder="请输入系统描述" showCount maxLength={200} />
              </Form.Item>

              <Form.Item label="系统Logo">
                <Space direction="vertical">
                  {logoUrl && (
                    <Image
                      width={120}
                      height={60}
                      src={logoUrl}
                      style={{ objectFit: 'contain', border: '1px solid #d9d9d9' }}
                    />
                  )}
                  <Upload
                    name="logo"
                    action="/api/upload/logo"
                    onChange={handleLogoChange}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>上传Logo</Button>
                  </Upload>
                </Space>
              </Form.Item>

              <Divider />

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="timezone"
                    label="时区"
                    rules={[{ required: true, message: '请选择时区' }]}
                  >
                    <Select placeholder="请选择时区">
                      <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
                      <Option value="UTC">UTC (UTC+0)</Option>
                      <Option value="America/New_York">America/New_York (UTC-5)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="language"
                    label="默认语言"
                    rules={[{ required: true, message: '请选择默认语言' }]}
                  >
                    <Select placeholder="请选择默认语言">
                      <Option value="zh-CN">简体中文</Option>
                      <Option value="en-US">English</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="dateFormat"
                    label="日期格式"
                    rules={[{ required: true, message: '请选择日期格式' }]}
                  >
                    <Select placeholder="请选择日期格式">
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* 安全设置 */}
            <TabPane
              tab={
                <span>
                  <SecurityScanOutlined />
                  安全设置
                </span>
              }
              key="security"
            >
              <Alert
                message="安全提示"
                description="修改安全设置可能会影响系统的安全性，请谨慎操作。"
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="sessionTimeout"
                    label="会话超时时间（分钟）"
                    rules={[{ required: true, message: '请输入会话超时时间' }]}
                  >
                    <InputNumber min={5} max={480} style={{ width: '100%' }} placeholder="30" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="maxLoginAttempts"
                    label="最大登录尝试次数"
                    rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                  >
                    <InputNumber min={3} max={10} style={{ width: '100%' }} placeholder="5" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="passwordMinLength"
                    label="密码最小长度"
                    rules={[{ required: true, message: '请输入密码最小长度' }]}
                  >
                    <InputNumber min={6} max={20} style={{ width: '100%' }} placeholder="6" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="enableTwoFactor" label="启用双因子认证" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enableIpWhitelist" label="启用IP白名单" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="ipWhitelist" label="IP白名单">
                <TextArea
                  rows={4}
                  placeholder="请输入允许访问的IP地址，每行一个，支持CIDR格式\n例如：\n192.168.1.100\n192.168.1.0/24"
                />
              </Form.Item>
            </TabPane>

            {/* 通知设置 */}
            <TabPane
              tab={
                <span>
                  <BellOutlined />
                  通知设置
                </span>
              }
              key="notification"
            >
              <Form.Item name="enableNotification" label="启用系统通知" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Divider orientation="left">
                <MailOutlined /> 邮件通知
              </Divider>

              <Form.Item name="enableEmail" label="启用邮件通知" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="smtpHost" label="SMTP服务器">
                    <Input placeholder="smtp.example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="smtpPort" label="SMTP端口">
                    <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="587" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="smtpUser" label="SMTP用户名">
                    <Input placeholder="user@example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="smtpPassword" label="SMTP密码">
                    <Input.Password placeholder="请输入SMTP密码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="smtpSecure" label="启用SSL/TLS" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button icon={<MailOutlined />} onClick={testEmail}>
                    测试邮件发送
                  </Button>
                </Col>
              </Row>

              <Divider orientation="left">
                <PhoneOutlined /> 短信通知
              </Divider>

              <Form.Item name="enableSms" label="启用短信通知" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="smsProvider" label="短信服务商">
                    <Select placeholder="请选择短信服务商">
                      <Option value="aliyun">阿里云</Option>
                      <Option value="tencent">腾讯云</Option>
                      <Option value="huawei">华为云</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="smsApiKey" label="API密钥">
                    <Input.Password placeholder="请输入API密钥" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* 数据设置 */}
            <TabPane
              tab={
                <span>
                  <DatabaseOutlined />
                  数据设置
                </span>
              }
              key="data"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="autoBackup" label="自动备份" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="backupInterval" label="备份间隔">
                    <Select placeholder="请选择备份间隔">
                      <Option value="daily">每日</Option>
                      <Option value="weekly">每周</Option>
                      <Option value="monthly">每月</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="dataRetentionDays"
                    label="数据保留天数"
                    rules={[{ required: true, message: '请输入数据保留天数' }]}
                  >
                    <InputNumber min={30} max={3650} style={{ width: '100%' }} placeholder="365" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="logRetentionDays"
                    label="日志保留天数"
                    rules={[{ required: true, message: '请输入日志保留天数' }]}
                  >
                    <InputNumber min={7} max={365} style={{ width: '100%' }} placeholder="90" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item name="enableMaintenance" label="启用维护模式" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item name="maintenanceTime" label="维护时间窗口">
                <RangePicker
                  format="HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item name="maintenanceMessage" label="维护提示信息">
                <TextArea
                  rows={3}
                  placeholder="系统正在维护中，请稍后再试..."
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Settings;
