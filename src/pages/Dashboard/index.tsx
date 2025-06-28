import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Alert,
  Progress,
  List,
  Avatar,
  Badge,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Line, Column, Pie } from '@ant-design/plots';
import { dashboardAPI, eventAPI } from '@/services/api';
import { history } from '@umijs/max';
import type { DashboardStats, SecurityEvent } from '@/services/api';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, eventsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        eventAPI.getEvents({ page: 1, pageSize: 10, status: 'pending' }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (eventsResponse.success) {
        setRecentEvents(eventsResponse.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // 设置定时刷新
    const interval = setInterval(fetchDashboardData, 30000); // 30秒刷新一次
    return () => clearInterval(interval);
  }, []);

  // 事件级别颜色映射
  const getEventLevelColor = (level: string) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red',
      critical: 'purple',
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  // 事件状态图标映射
  const getEventStatusIcon = (status: string) => {
    const icons = {
      pending: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      processing: <EyeOutlined style={{ color: '#1890ff' }} />,
      resolved: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      ignored: <CloseCircleOutlined style={{ color: '#d9d9d9' }} />,
    };
    return icons[status as keyof typeof icons] || null;
  };

  // 设备状态饼图配置
  const deviceStatusConfig = {
    data: stats
      ? [
          { type: '在线', value: stats.deviceStatusChart.online },
          { type: '离线', value: stats.deviceStatusChart.offline },
          { type: '故障', value: stats.deviceStatusChart.error },
        ]
      : [],
    angleField: 'value',
    colorField: 'type',
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
    data: stats?.eventTrendChart || [],
    xField: 'date',
    yField: 'count',
    seriesField: 'level',
    color: ['#1890ff', '#faad14', '#ff4d4f', '#722ed1'],
    smooth: true,
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
              prefix={<Badge status="processing" />}
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
              title="事件总数"
              value={stats?.totalEvents || 0}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理事件"
              value={stats?.pendingEvents || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: stats?.pendingEvents ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 警告信息 */}
      {stats && stats.pendingEvents > 0 && (
        <Alert
          message={`您有 ${stats.pendingEvents} 个待处理的安全事件`}
          description="请及时查看并处理这些事件以确保系统安全"
          type="warning"
          showIcon
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => history.push('/events?status=pending')}
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
            {stats && (
              <>
                <Pie {...deviceStatusConfig} height={300} />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="在线率"
                      value={
                        stats.totalDevices > 0
                          ? ((stats.onlineDevices / stats.totalDevices) * 100).toFixed(1)
                          : 0
                      }
                      suffix="%"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="离线设备"
                      value={stats.offlineDevices}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="故障设备"
                      value={stats.deviceStatusChart.error}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Col>

        {/* 事件趋势 */}
        <Col xs={24} lg={12}>
          <Card title="事件趋势" loading={loading}>
            {stats && stats.eventTrendChart.length > 0 ? (
              <Line {...eventTrendConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary">暂无事件数据</Text>
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
                          <span>{item.title}</span>
                          <Tag color={getEventLevelColor(item.level)}>
                            {item.level.toUpperCase()}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{item.description}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(item.createdAt).toLocaleString()}
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
