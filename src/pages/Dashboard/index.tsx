import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Badge,
  Alert,
  Button,
  List,
  Avatar,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Pie, Line } from '@ant-design/plots';
import { history } from '@umijs/max';
import { dashboardAPI, eventAPI, analyticsAPI } from '@/services/guardian/api';
import type { DashboardStats, SecurityEvent } from '@/services/guardian/api';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [eventTrends, setEventTrends] = useState<any>(null);

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, eventsResponse, deviceStatsResponse, eventTrendsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        eventAPI.getEvents(undefined, 0, 1, 5), // 获取未处理的事件
        analyticsAPI.getDeviceStats(),
        analyticsAPI.getEventTrends({ granularity: 'day' }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (eventsResponse.success) {
        setRecentEvents(eventsResponse.data.events || []);
      }

      if (deviceStatsResponse.success) {
        setDeviceStats(deviceStatsResponse.data);
      }

      if (eventTrendsResponse.success) {
        setEventTrends(eventTrendsResponse.data);
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
      message.error('获取仪表板数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // 设置定时刷新（30秒）
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 事件级别颜色映射
  const getEventLevelColor = (level: number) => {
    const colors = {
      1: '#52c41a',   // 低
      2: '#faad14',   // 中
      3: '#ff4d4f',   // 高
      4: '#722ed1',   // 紧急
    };
    return colors[level as keyof typeof colors] || '#1890ff';
  };

  // 事件状态图标
  const getEventStatusIcon = (status: number) => {
    const icons = {
      0: <ExclamationCircleOutlined />, // 未处理
      1: <CheckCircleOutlined />,       // 已处理
      2: <ClockCircleOutlined />,       // 处理中
    };
    return icons[status as keyof typeof icons] || <ExclamationCircleOutlined />;
  };

  // 获取事件级别文本
  const getEventLevelText = (level: number) => {
    const texts = {
      1: '低',
      2: '中',
      3: '高',
      4: '紧急',
    };
    return texts[level as keyof typeof texts] || '未知';
  };

  // 设备状态饼图配置
  const deviceStatusConfig = {
    data: deviceStats ? [
      { name: '在线', value: deviceStats.online },
      { name: '离线', value: deviceStats.offline },
      { name: '告警', value: deviceStats.warning },
    ] : [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    color: ['#52c41a', '#faad14', '#ff4d4f'],
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 事件趋势图配置
  const eventTrendConfig = {
    data: eventTrends?.dates?.map((date: string, index: number) => ({
      date,
      count: eventTrends.counts[index] || 0,
    })) || [],
    xField: 'date',
    yField: 'count',
    smooth: true,
    color: '#1890ff',
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <PageContainer
      title="仪表板"
      subTitle="Guardian智能守护系统概览"
      extra={[
        <Button key="refresh" onClick={fetchDashboardData} loading={loading}>
          刷新数据
        </Button>,
      ]}
    >
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="守护圈总数"
              value={stats?.totalCircles || 0}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={stats?.totalDevices || 0}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
              suffix={<Text type="secondary">在线: {stats?.onlineDevices || 0}</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日事件"
              value={stats?.todayEvents || 0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理事件"
              value={stats?.unhandledEvents || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: (stats?.unhandledEvents || 0) > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 警告信息 */}
      {stats && (stats.unhandledEvents || 0) > 0 && (
        <Alert
          message={`您有 ${stats.unhandledEvents} 个待处理的安全事件`}
          description="请及时查看并处理这些事件以确保系统安全"
          type="warning"
          showIcon
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => history.push('/events?status=0')}
            >
              立即查看
            </Button>
          }
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]}>
        {/* 设备状态分布 */}
        <Col xs={24} lg={12}>
          <Card title="设备状态分布" loading={loading}>
            {deviceStats && deviceStats.total > 0 ? (
              <>
                <Pie {...deviceStatusConfig} height={300} />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="在线率"
                      value={
                        deviceStats.total > 0
                          ? ((deviceStats.online / deviceStats.total) * 100).toFixed(1)
                          : 0
                      }
                      suffix="%"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="离线设备"
                      value={deviceStats.offline || 0}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="告警设备"
                      value={deviceStats.warning || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary">暂无设备数据</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* 事件趋势 */}
        <Col xs={24} lg={12}>
          <Card title="事件趋势" loading={loading}>
            {eventTrends && eventTrends.dates && eventTrends.dates.length > 0 ? (
              <Line {...eventTrendConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary">暂无事件趋势数据</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* 最近事件 */}
        <Col xs={24}>
          <Card
            title="最近事件"
            loading={loading}
            extra={
              <Button type="link" onClick={() => history.push('/events')}>
                查看全部
              </Button>
            }
          >
            {recentEvents.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentEvents}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        size="small"
                        onClick={() => history.push(`/events/${item.id}`)}
                      >
                        查看详情
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getEventStatusIcon(item.status)}
                          style={{
                            backgroundColor: getEventLevelColor(item.level),
                          }}
                        />
                      }
                      title={
                        <Space>
                          <span>{item.event_type || '系统事件'}</span>
                          <Tag color={getEventLevelColor(item.level)}>
                            {getEventLevelText(item.level)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{item.description}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.device_name || '未知设备'} • {new Date(item.create_time).toLocaleString()}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircleOutlined
                  style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}
                />
                <div>
                  <Title level={4}>系统运行正常</Title>
                  <Text type="secondary">暂无待处理的安全事件</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
