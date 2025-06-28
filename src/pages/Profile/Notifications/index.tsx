import React, { useState, useEffect } from 'react';
import {
  Card,
  Switch,
  List,
  Button,
  Space,
  Divider,
  Select,
  TimePicker,
  Form,
  message,
  Row,
  Col,
  Tag,
  Modal,
  Input,
  Checkbox,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  MobileOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface NotificationSettings {
  // 系统通知
  systemNotifications: {
    enabled: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  // 安全通知
  securityNotifications: {
    enabled: boolean;
    loginAlert: boolean;
    deviceAlert: boolean;
    passwordChange: boolean;
    email: boolean;
    sms: boolean;
  };
  // 设备通知
  deviceNotifications: {
    enabled: boolean;
    offline: boolean;
    lowBattery: boolean;
    emergency: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  // 守护圈通知
  circleNotifications: {
    enabled: boolean;
    memberJoin: boolean;
    memberLeave: boolean;
    invitation: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  // 免打扰时间
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    allowEmergency: boolean;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
}

const ProfileNotifications: React.FC = () => {
  const [form] = Form.useForm();
  const [ruleForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    systemNotifications: {
      enabled: true,
      email: true,
      sms: false,
      push: true,
    },
    securityNotifications: {
      enabled: true,
      loginAlert: true,
      deviceAlert: true,
      passwordChange: true,
      email: true,
      sms: true,
    },
    deviceNotifications: {
      enabled: true,
      offline: true,
      lowBattery: true,
      emergency: true,
      email: true,
      sms: true,
      push: true,
    },
    circleNotifications: {
      enabled: true,
      memberJoin: true,
      memberLeave: true,
      invitation: true,
      email: true,
      sms: false,
      push: true,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      allowEmergency: true,
    },
  });
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);

  useEffect(() => {
    fetchNotificationSettings();
    fetchNotificationRules();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      // TODO: 调用获取通知设置的API
      // 模拟数据已在初始状态中设置
      form.setFieldsValue({
        ...settings,
        quietHours: {
          ...settings.quietHours,
          startTime: dayjs(settings.quietHours.startTime, 'HH:mm'),
          endTime: dayjs(settings.quietHours.endTime, 'HH:mm'),
        },
      });
    } catch (error) {
      message.error('获取通知设置失败');
    }
  };

  const fetchNotificationRules = async () => {
    try {
      // TODO: 调用获取通知规则的API
      const mockRules: NotificationRule[] = [
        {
          id: '1',
          name: '紧急情况通知',
          description: '当检测到紧急情况时立即通知所有联系人',
          conditions: ['设备离线超过30分钟', '紧急按钮被按下'],
          actions: ['发送短信', '发送邮件', '推送通知'],
          enabled: true,
          priority: 'high',
        },
        {
          id: '2',
          name: '设备低电量提醒',
          description: '设备电量低于20%时发送提醒',
          conditions: ['电量低于20%'],
          actions: ['推送通知'],
          enabled: true,
          priority: 'medium',
        },
      ];
      setRules(mockRules);
    } catch (error) {
      message.error('获取通知规则失败');
    }
  };

  const handleSettingChange = async (path: string[], value: any) => {
    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    setSettings(newSettings);

    try {
      // TODO: 调用更新通知设置的API
      message.success('设置已更新');
    } catch (error) {
      message.error('设置更新失败');
    }
  };

  const handleQuietHoursSubmit = async (values: any) => {
    setLoading(true);
    try {
      const quietHours = {
        ...values.quietHours,
        startTime: values.quietHours.startTime.format('HH:mm'),
        endTime: values.quietHours.endTime.format('HH:mm'),
      };

      setSettings({ ...settings, quietHours });
      // TODO: 调用更新免打扰设置的API
      message.success('免打扰设置已更新');
    } catch (error) {
      message.error('设置更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (values: any) => {
    try {
      if (editingRule) {
        // 编辑规则
        const updatedRules = rules.map((rule) =>
          rule.id === editingRule.id ? { ...rule, ...values } : rule,
        );
        setRules(updatedRules);
        message.success('规则已更新');
      } else {
        // 新增规则
        const newRule: NotificationRule = {
          id: Date.now().toString(),
          ...values,
        };
        setRules([...rules, newRule]);
        message.success('规则已添加');
      }

      setRuleModalVisible(false);
      setEditingRule(null);
      ruleForm.resetFields();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const handleEditRule = (rule: NotificationRule) => {
    setEditingRule(rule);
    ruleForm.setFieldsValue(rule);
    setRuleModalVisible(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      setRules(rules.filter((rule) => rule.id !== ruleId));
      message.success('规则已删除');
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      const updatedRules = rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule));
      setRules(updatedRules);
      message.success(enabled ? '规则已启用' : '规则已禁用');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const renderNotificationSection = (
    title: string,
    icon: React.ReactNode,
    settingKey: keyof NotificationSettings,
    options: { key: string; label: string; description?: string }[],
  ) => {
    const sectionSettings = settings[settingKey] as any;

    return (
      <Card
        title={
          <Space>
            {icon} {title}
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <List>
          <List.Item
            actions={[
              <Switch
                checked={sectionSettings.enabled}
                onChange={(checked) => handleSettingChange([settingKey, 'enabled'], checked)}
              />,
            ]}
          >
            <List.Item.Meta title="启用通知" description={`开启或关闭${title}`} />
          </List.Item>

          {sectionSettings.enabled &&
            options.map((option) => (
              <List.Item
                key={option.key}
                actions={[
                  <Switch
                    checked={sectionSettings[option.key]}
                    onChange={(checked) => handleSettingChange([settingKey, option.key], checked)}
                  />,
                ]}
              >
                <List.Item.Meta title={option.label} description={option.description} />
              </List.Item>
            ))}

          {sectionSettings.enabled && (
            <List.Item>
              <List.Item.Meta title="通知方式" />
              <Space>
                {sectionSettings.hasOwnProperty('email') && (
                  <Tag
                    color={sectionSettings.email ? 'blue' : 'default'}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleSettingChange([settingKey, 'email'], !sectionSettings.email)
                    }
                  >
                    <MailOutlined /> 邮件
                  </Tag>
                )}
                {sectionSettings.hasOwnProperty('sms') && (
                  <Tag
                    color={sectionSettings.sms ? 'green' : 'default'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSettingChange([settingKey, 'sms'], !sectionSettings.sms)}
                  >
                    <MobileOutlined /> 短信
                  </Tag>
                )}
                {sectionSettings.hasOwnProperty('push') && (
                  <Tag
                    color={sectionSettings.push ? 'orange' : 'default'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSettingChange([settingKey, 'push'], !sectionSettings.push)}
                  >
                    <BellOutlined /> 推送
                  </Tag>
                )}
              </Space>
            </List.Item>
          )}
        </List>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col span={16}>
          {renderNotificationSection('系统通知', <SettingOutlined />, 'systemNotifications', [
            { key: 'maintenance', label: '系统维护通知', description: '系统维护和更新通知' },
            { key: 'announcement', label: '公告通知', description: '重要公告和消息' },
          ])}

          {renderNotificationSection('安全通知', <BellOutlined />, 'securityNotifications', [
            { key: 'loginAlert', label: '登录提醒', description: '新设备登录时通知' },
            { key: 'deviceAlert', label: '设备异常', description: '检测到异常设备活动' },
            { key: 'passwordChange', label: '密码变更', description: '密码修改成功通知' },
          ])}

          {renderNotificationSection('设备通知', <MobileOutlined />, 'deviceNotifications', [
            { key: 'offline', label: '设备离线', description: '设备长时间离线时通知' },
            { key: 'lowBattery', label: '电量不足', description: '设备电量低于阈值时通知' },
            { key: 'emergency', label: '紧急情况', description: '检测到紧急情况时立即通知' },
          ])}

          {renderNotificationSection('守护圈通知', <MailOutlined />, 'circleNotifications', [
            { key: 'memberJoin', label: '成员加入', description: '新成员加入守护圈时通知' },
            { key: 'memberLeave', label: '成员离开', description: '成员离开守护圈时通知' },
            { key: 'invitation', label: '邀请通知', description: '收到守护圈邀请时通知' },
          ])}
        </Col>

        <Col span={8}>
          <Card title="免打扰时间" style={{ marginBottom: 16 }}>
            <Form form={form} onFinish={handleQuietHoursSubmit}>
              <Form.Item name={['quietHours', 'enabled']} valuePropName="checked">
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  onChange={(checked) => handleSettingChange(['quietHours', 'enabled'], checked)}
                />
                <span style={{ marginLeft: 8 }}>启用免打扰</span>
              </Form.Item>

              {settings.quietHours.enabled && (
                <>
                  <Form.Item name={['quietHours', 'startTime']} label="开始时间">
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name={['quietHours', 'endTime']} label="结束时间">
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name={['quietHours', 'allowEmergency']} valuePropName="checked">
                    <Checkbox
                      onChange={(e) =>
                        handleSettingChange(['quietHours', 'allowEmergency'], e.target.checked)
                      }
                    >
                      允许紧急通知
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存设置
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>

          <Card
            title="通知规则"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRule(null);
                  ruleForm.resetFields();
                  setRuleModalVisible(true);
                }}
              >
                添加规则
              </Button>
            }
          >
            <List
              dataSource={rules}
              renderItem={(rule) => (
                <List.Item
                  actions={[
                    <Switch
                      size="small"
                      checked={rule.enabled}
                      onChange={(checked) => handleToggleRule(rule.id, checked)}
                    />,
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditRule(rule)}
                    />,
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteRule(rule.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {rule.name}
                        <Tag
                          color={
                            rule.priority === 'high'
                              ? 'red'
                              : rule.priority === 'medium'
                                ? 'orange'
                                : 'default'
                          }
                        >
                          {rule.priority === 'high'
                            ? '高'
                            : rule.priority === 'medium'
                              ? '中'
                              : '低'}
                        </Tag>
                      </Space>
                    }
                    description={rule.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 通知规则编辑弹窗 */}
      <Modal
        title={editingRule ? '编辑通知规则' : '添加通知规则'}
        open={ruleModalVisible}
        onCancel={() => {
          setRuleModalVisible(false);
          setEditingRule(null);
          ruleForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={ruleForm} layout="vertical" onFinish={handleSaveRule}>
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="规则描述"
            rules={[{ required: true, message: '请输入规则描述' }]}
          >
            <TextArea rows={3} placeholder="请描述此规则的用途" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="选择优先级">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="conditions"
            label="触发条件"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <Select mode="tags" placeholder="输入触发条件，按回车添加" style={{ width: '100%' }}>
              <Option value="设备离线">设备离线</Option>
              <Option value="电量不足">电量不足</Option>
              <Option value="紧急按钮">紧急按钮</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="actions"
            label="通知方式"
            rules={[{ required: true, message: '请选择通知方式' }]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value="email">邮件通知</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="sms">短信通知</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="push">推送通知</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="enabled" valuePropName="checked" initialValue={true}>
            <Checkbox>启用此规则</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setRuleModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileNotifications;
