import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Timeline,
  Avatar,
  Badge,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Select,
  Image,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  WarningOutlined,
  FireOutlined,
  ExclamationCircleOutlined,
  DisconnectOutlined,
  QuestionCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { eventAPI } from '@/services/api';
import type { SecurityEvent, EventLog } from '@/services/api';

const { TextArea } = Input;
const { Option } = Select;

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<SecurityEvent | null>(null);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取事件详情
  const fetchEventDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [eventResponse, logsResponse] = await Promise.all([
        eventAPI.getEventDetail(parseInt(id)),
        eventAPI.getEventLogs(parseInt(id)),
      ]);

      if (eventResponse.success) {
        setEvent(eventResponse.data);
      }

      if (logsResponse.success) {
        setLogs(logsResponse.data);
      }
    } catch (error) {
      message.error('获取事件详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  // 获取事件类型图标
  const getEventTypeIcon = (type: string) => {
    const icons = {
      intrusion: <WarningOutlined />,
      fire: <FireOutlined />,
      emergency: <ExclamationCircleOutlined />,
      device_offline: <DisconnectOutlined />,
      other: <QuestionCircleOutlined />,
    };
    return icons[type as keyof typeof icons] || <QuestionCircleOutlined />;
  };

  // 获取事件级别颜色
  const getEventLevelColor = (level: string) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red',
      critical: 'purple',
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  // 获取事件状态颜色
  const getEventStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      processing: 'processing',
      resolved: 'success',
      ignored: 'default',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  // 处理事件
  const handleEvent = async () => {
    if (!event) return;

    try {
      const values = await form.validateFields();
      const response = await eventAPI.handleEvent(event.id, {
        status: values.status,
        note: values.note,
      });

      if (response.success) {
        message.success('事件处理成功！');
        setHandleModalVisible(false);
        form.resetFields();
        fetchEventDetail(); // 重新获取数据
      } else {
        message.error(response.message || '处理失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '处理失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!event) {
    return (
      <PageContainer>
        <Empty description="事件不存在" />
      </PageContainer>
    );
  }

  const typeMap = {
    intrusion: '入侵检测',
    fire: '火灾报警',
    emergency: '紧急事件',
    device_offline: '设备离线',
    other: '其他',
  };

  const levelMap = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急',
  };

  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    ignored: '已忽略',
  };

  return (
    <PageContainer
      title={event.title}
      subTitle={`事件ID: ${event.id}`}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
          返回
        </Button>,
        event.status === 'pending' && (
          <Button
            key="handle"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setHandleModalVisible(true)}
          >
            处理事件
          </Button>
        ),
      ]}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {/* 左侧主要信息 */}
        <div style={{ flex: 1 }}>
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="事件类型">
                <Tag icon={getEventTypeIcon(event.type)}>
                  {typeMap[event.type as keyof typeof typeMap] || event.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="事件级别">
                <Tag color={getEventLevelColor(event.level)}>
                  {levelMap[event.level as keyof typeof levelMap] || event.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="事件状态">
                <Badge
                  status={getEventStatusColor(event.status) as any}
                  text={statusMap[event.status as keyof typeof statusMap] || event.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="发生时间">
                <Space>
                  <ClockCircleOutlined />
                  {new Date(event.createdAt).toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="位置信息">
                <Space>
                  <EnvironmentOutlined />
                  {event.location?.name || '未知位置'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="关联设备">
                {event.device?.name || '无关联设备'}
              </Descriptions.Item>
              <Descriptions.Item label="事件描述" span={2}>
                {event.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 详细信息 */}
          {event.details && (
            <Card title="详细信息" style={{ marginBottom: 16 }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {JSON.stringify(event.details, null, 2)}
              </pre>
            </Card>
          )}

          {/* 相关图片 */}
          {event.images && event.images.length > 0 && (
            <Card title="相关图片" style={{ marginBottom: 16 }}>
              <Image.PreviewGroup>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {event.images.map((image, index) => (
                    <Image
                      key={index}
                      width={120}
                      height={120}
                      src={image}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </Card>
          )}
        </div>

        {/* 右侧处理记录 */}
        <div style={{ width: 400 }}>
          <Card title="处理记录">
            {logs.length > 0 ? (
              <Timeline>
                {logs.map((log) => (
                  <Timeline.Item
                    key={log.id}
                    dot={
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    }
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{log.action}</div>
                      <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>
                        {log.operator} • {new Date(log.createdAt).toLocaleString()}
                      </div>
                      {log.note && <div style={{ color: '#999', fontSize: 12 }}>{log.note}</div>}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty description="暂无处理记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </div>
      </div>

      {/* 处理事件弹窗 */}
      <Modal
        title="处理事件"
        open={handleModalVisible}
        onOk={handleEvent}
        onCancel={() => {
          setHandleModalVisible(false);
          form.resetFields();
        }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="处理状态"
            rules={[{ required: true, message: '请选择处理状态' }]}
          >
            <Select placeholder="请选择处理状态">
              <Option value="processing">处理中</Option>
              <Option value="resolved">已解决</Option>
              <Option value="ignored">忽略</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="note"
            label="处理备注"
            rules={[{ required: true, message: '请输入处理备注' }]}
          >
            <TextArea rows={4} placeholder="请输入处理备注" showCount maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default EventDetail;
