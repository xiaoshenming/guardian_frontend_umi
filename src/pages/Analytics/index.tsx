import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Space,
  Button,
  Spin,
  Alert,
  Typography,
  Divider,
  Progress,
  Table,
  Tag,
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SecurityScanOutlined,
  UserOutlined,
  ApiOutlined,
  DatabaseOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { analyticsAPI } from '@/services/api';
import type { AnalyticsData } from '@/services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [refreshInterval, setRefreshInterval] = useState<number>(0);

  // 颜色配置
  const colors = {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#13c2c2',
    purple: '#722ed1',
    orange: '#fa8c16',
    cyan: '#13c2c2',
  };

  // 饼图颜色
  const pieColors = [
    colors.primary,
    colors.success,
    colors.warning,
    colors.error,
    colors.info,
    colors.purple,
  ];

  // 获取分析数据
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAnalyticsData({
        startTime: timeRange[0].format('YYYY-MM-DD'),
        endTime: timeRange[1].format('YYYY-MM-DD'),
      });

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // 设置自动刷新
  useEffect(() => {
    if (refreshInterval > 0) {
      const timer = setInterval(fetchAnalyticsData, refreshInterval * 1000);
      return () => clearInterval(timer);
    }
  }, [refreshInterval, timeRange]);

  // 导出报告
  const handleExport = async () => {
    try {
      const response = await analyticsAPI.exportReport({
        startTime: timeRange[0].format('YYYY-MM-DD'),
        endTime: timeRange[1].format('YYYY-MM-DD'),
      });

      if (response.success) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_report_${dayjs().format('YYYY-MM-DD')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('导出报告失败:', error);
    }
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 计算变化率
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  if (!data) {
    return (
      <PageContainer title="数据分析">
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: '100px' }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="数据分析"
      subTitle="系统运行状态和业务数据分析"
      extra={[
        <Space key="controls">
          <Select value={refreshInterval} onChange={setRefreshInterval} style={{ width: 120 }}>
            <Option value={0}>手动刷新</Option>
            <Option value={30}>30秒</Option>
            <Option value={60}>1分钟</Option>
            <Option value={300}>5分钟</Option>
          </Select>
          <RangePicker
            value={timeRange}
            onChange={(dates) => dates && setTimeRange(dates)}
            format="YYYY-MM-DD"
          />
          <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchAnalyticsData}>
            刷新
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出报告
          </Button>
        </Space>,
      ]}
    >
      <Spin spinning={loading}>
        {/* 概览统计 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总事件数"
                value={data.overview.totalEvents}
                prefix={<AlertOutlined style={{ color: colors.error }} />}
                suffix={
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {data.overview.eventChange > 0 ? (
                      <ArrowUpOutlined style={{ color: colors.error }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: colors.success }} />
                    )}
                    {Math.abs(data.overview.eventChange)}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="在线设备"
                value={data.overview.onlineDevices}
                prefix={<DatabaseOutlined style={{ color: colors.success }} />}
                suffix={
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    /{data.overview.totalDevices}
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="活跃用户"
                value={data.overview.activeUsers}
                prefix={<UserOutlined style={{ color: colors.primary }} />}
                suffix={
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {data.overview.userChange > 0 ? (
                      <ArrowUpOutlined style={{ color: colors.success }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: colors.error }} />
                    )}
                    {Math.abs(data.overview.userChange)}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="API调用"
                value={formatNumber(data.overview.apiCalls)}
                prefix={<ApiOutlined style={{ color: colors.info }} />}
                suffix={
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {data.overview.apiChange > 0 ? (
                      <ArrowUpOutlined style={{ color: colors.success }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: colors.error }} />
                    )}
                    {Math.abs(data.overview.apiChange)}%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 事件趋势图 */}
          <Col xs={24} lg={12}>
            <Card title="事件趋势" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.eventTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke={colors.error}
                    fill={colors.error}
                    name="高危"
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stackId="1"
                    stroke={colors.warning}
                    fill={colors.warning}
                    name="中危"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke={colors.info}
                    fill={colors.info}
                    name="低危"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* 设备状态分布 */}
          <Col xs={24} lg={12}>
            <Card title="设备状态分布" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.deviceStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.deviceStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* 用户活跃度 */}
          <Col xs={24} lg={12}>
            <Card title="用户活跃度" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={colors.primary}
                    strokeWidth={2}
                    name="活跃用户数"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* API调用统计 */}
          <Col xs={24} lg={12}>
            <Card title="API调用统计" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.apiStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="endpoint" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill={colors.info} name="调用次数" />
                  <Bar dataKey="errors" fill={colors.error} name="错误次数" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* 系统性能指标 */}
          <Col xs={24} lg={12}>
            <Card title="系统性能指标" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>CPU使用率</Text>
                  <Progress
                    percent={data.performance.cpu}
                    status={data.performance.cpu > 80 ? 'exception' : 'normal'}
                    strokeColor={data.performance.cpu > 80 ? colors.error : colors.success}
                  />
                </div>
                <div>
                  <Text>内存使用率</Text>
                  <Progress
                    percent={data.performance.memory}
                    status={data.performance.memory > 80 ? 'exception' : 'normal'}
                    strokeColor={data.performance.memory > 80 ? colors.error : colors.success}
                  />
                </div>
                <div>
                  <Text>磁盘使用率</Text>
                  <Progress
                    percent={data.performance.disk}
                    status={data.performance.disk > 80 ? 'exception' : 'normal'}
                    strokeColor={data.performance.disk > 80 ? colors.error : colors.success}
                  />
                </div>
                <div>
                  <Text>网络带宽</Text>
                  <Progress
                    percent={data.performance.network}
                    status={data.performance.network > 80 ? 'exception' : 'normal'}
                    strokeColor={data.performance.network > 80 ? colors.error : colors.success}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* 安全威胁分析 */}
          <Col xs={24} lg={12}>
            <Card title="安全威胁分析" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  data={data.threatAnalysis}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* 详细统计表格 */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="热门事件类型" size="small">
              <Table
                dataSource={data.topEventTypes}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '事件类型',
                    dataIndex: 'type',
                    key: 'type',
                    render: (text: string) => <Tag color={colors.primary}>{text}</Tag>,
                  },
                  {
                    title: '数量',
                    dataIndex: 'count',
                    key: 'count',
                    align: 'right',
                  },
                  {
                    title: '占比',
                    dataIndex: 'percentage',
                    key: 'percentage',
                    align: 'right',
                    render: (text: number) => `${text}%`,
                  },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="活跃设备排行" size="small">
              <Table
                dataSource={data.topDevices}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    render: (text: string) => <Tag>{text}</Tag>,
                  },
                  {
                    title: '事件数',
                    dataIndex: 'events',
                    key: 'events',
                    align: 'right',
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => {
                      const statusConfig = {
                        online: {
                          color: colors.success,
                          icon: <CheckCircleOutlined />,
                          text: '在线',
                        },
                        offline: {
                          color: colors.error,
                          icon: <CloseCircleOutlined />,
                          text: '离线',
                        },
                        warning: {
                          color: colors.warning,
                          icon: <ExclamationCircleOutlined />,
                          text: '警告',
                        },
                      };
                      const config = statusConfig[status as keyof typeof statusConfig];
                      return config ? (
                        <Tag color={config.color} icon={config.icon}>
                          {config.text}
                        </Tag>
                      ) : (
                        <Tag>{status}</Tag>
                      );
                    },
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* 系统健康状态 */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="系统健康状态" size="small">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Alert
                    message="数据库连接"
                    description={data.health.database ? '正常' : '异常'}
                    type={data.health.database ? 'success' : 'error'}
                    showIcon
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Alert
                    message="缓存服务"
                    description={data.health.cache ? '正常' : '异常'}
                    type={data.health.cache ? 'success' : 'error'}
                    showIcon
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Alert
                    message="消息队列"
                    description={data.health.queue ? '正常' : '异常'}
                    type={data.health.queue ? 'success' : 'error'}
                    showIcon
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Alert
                    message="外部API"
                    description={data.health.externalApi ? '正常' : '异常'}
                    type={data.health.externalApi ? 'success' : 'error'}
                    showIcon
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default Analytics;
