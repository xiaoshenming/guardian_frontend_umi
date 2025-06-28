import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Tag,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  Alert,
  Tooltip,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BugOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Paragraph } = Typography;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  module: string;
  message: string;
  details?: string;
  userId?: string;
  userName?: string;
  ip?: string;
  userAgent?: string;
  action?: string;
  resource?: string;
  result?: 'success' | 'failure';
  duration?: number;
}

interface LogStats {
  total: number;
  debug: number;
  info: number;
  warn: number;
  error: number;
  todayCount: number;
}

const SystemLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    total: 0,
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
    todayCount: 0,
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    module: '',
    keyword: '',
    dateRange: null as any,
    userId: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchLogs();
    fetchLogStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取日志的API
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-15 14:30:25',
          level: 'info',
          module: 'auth',
          message: '用户登录成功',
          details: '用户通过用户名密码登录系统',
          userId: 'user001',
          userName: '张三',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          action: 'login',
          resource: '/api/auth/login',
          result: 'success',
          duration: 245,
        },
        {
          id: '2',
          timestamp: '2024-01-15 14:28:15',
          level: 'warn',
          module: 'device',
          message: '设备连接超时',
          details: '设备 DEV001 连接超时，尝试重新连接',
          action: 'device_connect',
          resource: 'device/DEV001',
          result: 'failure',
          duration: 5000,
        },
        {
          id: '3',
          timestamp: '2024-01-15 14:25:10',
          level: 'error',
          module: 'system',
          message: '数据库连接失败',
          details: 'Connection timeout: Unable to connect to database server at 192.168.1.200:3306',
          action: 'db_connect',
          resource: 'database',
          result: 'failure',
          duration: 30000,
        },
        {
          id: '4',
          timestamp: '2024-01-15 14:20:05',
          level: 'info',
          module: 'circle',
          message: '守护圈创建成功',
          details: '用户创建了新的守护圈：家庭守护',
          userId: 'user002',
          userName: '李四',
          ip: '192.168.1.101',
          action: 'circle_create',
          resource: 'circle/CIR001',
          result: 'success',
          duration: 156,
        },
        {
          id: '5',
          timestamp: '2024-01-15 14:15:30',
          level: 'debug',
          module: 'api',
          message: 'API请求处理',
          details: 'GET /api/devices - 200 OK',
          userId: 'user001',
          ip: '192.168.1.100',
          action: 'api_request',
          resource: '/api/devices',
          result: 'success',
          duration: 89,
        },
      ];

      setLogs(mockLogs);
      setPagination((prev) => ({ ...prev, total: 150 })); // 模拟总数
    } catch (error) {
      message.error('获取日志失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogStats = async () => {
    try {
      // TODO: 调用获取日志统计的API
      const mockStats: LogStats = {
        total: 1250,
        debug: 450,
        info: 600,
        warn: 150,
        error: 50,
        todayCount: 89,
      };
      setStats(mockStats);
    } catch (error) {
      message.error('获取日志统计失败');
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({
      level: '',
      module: '',
      keyword: '',
      dateRange: null,
      userId: '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleExport = async () => {
    try {
      // TODO: 调用导出日志的API
      message.success('日志导出成功');
    } catch (error) {
      message.error('日志导出失败');
    }
  };

  const handleClearLogs = async () => {
    try {
      // TODO: 调用清理日志的API
      message.success('日志清理成功');
      fetchLogs();
      fetchLogStats();
    } catch (error) {
      message.error('日志清理失败');
    }
  };

  const handleViewDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setDetailModalVisible(true);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug':
        return <BugOutlined style={{ color: '#722ed1' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'warn':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug':
        return 'purple';
      case 'info':
        return 'blue';
      case 'warn':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  const getResultColor = (result?: string) => {
    switch (result) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<LogEntry> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      sorter: true,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)} icon={getLevelIcon(level)}>
          {level.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'DEBUG', value: 'debug' },
        { text: 'INFO', value: 'info' },
        { text: 'WARN', value: 'warn' },
        { text: 'ERROR', value: 'error' },
      ],
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      filters: [
        { text: '认证', value: 'auth' },
        { text: '设备', value: 'device' },
        { text: '系统', value: 'system' },
        { text: '守护圈', value: 'circle' },
        { text: 'API', value: 'api' },
      ],
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: {
        showTitle: false,
      },
      render: (message: string) => (
        <Tooltip placement="topLeft" title={message}>
          {message}
        </Tooltip>
      ),
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
      render: (userName: string, record: LogEntry) =>
        userName ? <Tooltip title={`ID: ${record.userId}`}>{userName}</Tooltip> : '-',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
      render: (ip: string) => ip || '-',
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      render: (result: string) =>
        result ? (
          <Tag color={getResultColor(result)}>{result === 'success' ? '成功' : '失败'}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => (duration ? `${duration}ms` : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record: LogEntry) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="总日志数" value={stats.total} prefix={<InfoCircleOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="今日日志"
              value={stats.todayCount}
              prefix={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="错误日志"
              value={stats.error}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="警告日志"
              value={stats.warn}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="信息日志"
              value={stats.info}
              prefix={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="调试日志"
              value={stats.debug}
              prefix={<BugOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和过滤 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索关键词"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="日志级别"
              value={filters.level}
              onChange={(value) => setFilters({ ...filters, level: value })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="debug">DEBUG</Option>
              <Option value="info">INFO</Option>
              <Option value="warn">WARN</Option>
              <Option value="error">ERROR</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="模块"
              value={filters.module}
              onChange={(value) => setFilters({ ...filters, module: value })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="auth">认证</Option>
              <Option value="device">设备</Option>
              <Option value="system">系统</Option>
              <Option value="circle">守护圈</Option>
              <Option value="api">API</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              style={{ width: '100%' }}
              showTime
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>
            刷新
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出日志
          </Button>
          <Popconfirm
            title="确定要清理30天前的日志吗？"
            description="此操作不可恢复，请谨慎操作。"
            onConfirm={handleClearLogs}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger icon={<DeleteOutlined />}>
              清理日志
            </Button>
          </Popconfirm>
        </Space>

        <Alert
          message="日志管理提示"
          description="系统会自动清理超过保留期限的日志，建议定期导出重要日志进行备份。"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* 日志表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize || 20 });
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 日志详情弹窗 */}
      <Modal
        title="日志详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedLog(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="时间" span={2}>
              {selectedLog.timestamp}
            </Descriptions.Item>
            <Descriptions.Item label="级别">
              <Tag color={getLevelColor(selectedLog.level)} icon={getLevelIcon(selectedLog.level)}>
                {selectedLog.level.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">{selectedLog.module}</Descriptions.Item>
            <Descriptions.Item label="消息" span={2}>
              <Text>{selectedLog.message}</Text>
            </Descriptions.Item>
            {selectedLog.details && (
              <Descriptions.Item label="详细信息" span={2}>
                <Paragraph>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{selectedLog.details}</pre>
                </Paragraph>
              </Descriptions.Item>
            )}
            {selectedLog.userName && (
              <Descriptions.Item label="用户">
                {selectedLog.userName} ({selectedLog.userId})
              </Descriptions.Item>
            )}
            {selectedLog.ip && (
              <Descriptions.Item label="IP地址">{selectedLog.ip}</Descriptions.Item>
            )}
            {selectedLog.action && (
              <Descriptions.Item label="操作">{selectedLog.action}</Descriptions.Item>
            )}
            {selectedLog.resource && (
              <Descriptions.Item label="资源">{selectedLog.resource}</Descriptions.Item>
            )}
            {selectedLog.result && (
              <Descriptions.Item label="结果">
                <Tag color={getResultColor(selectedLog.result)}>
                  {selectedLog.result === 'success' ? '成功' : '失败'}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedLog.duration && (
              <Descriptions.Item label="耗时">{selectedLog.duration}ms</Descriptions.Item>
            )}
            {selectedLog.userAgent && (
              <Descriptions.Item label="User Agent" span={2}>
                <Text ellipsis={{ tooltip: selectedLog.userAgent }}>{selectedLog.userAgent}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SystemLogs;
