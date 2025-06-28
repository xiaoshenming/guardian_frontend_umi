import React, { useState, useRef } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  message,
  Modal,
  Descriptions,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Badge,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { systemAPI } from '@/services/api';
import type { SystemLog } from '@/services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const Logs: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<SystemLog | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // 日志级别配置
  const logLevels = {
    info: { color: 'blue', text: '信息' },
    warn: { color: 'orange', text: '警告' },
    error: { color: 'red', text: '错误' },
    debug: { color: 'gray', text: '调试' },
    success: { color: 'green', text: '成功' },
  };

  // 操作类型配置
  const actionTypes = {
    login: { color: 'blue', text: '登录' },
    logout: { color: 'default', text: '登出' },
    create: { color: 'green', text: '创建' },
    update: { color: 'orange', text: '更新' },
    delete: { color: 'red', text: '删除' },
    view: { color: 'cyan', text: '查看' },
    export: { color: 'purple', text: '导出' },
    import: { color: 'geekblue', text: '导入' },
    config: { color: 'magenta', text: '配置' },
    backup: { color: 'lime', text: '备份' },
    restore: { color: 'gold', text: '恢复' },
  };

  // 表格列定义
  const columns: ProColumns<SystemLog>[] = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      sorter: true,
      render: (text: string) => (
        <Tooltip title={dayjs(text).format('YYYY-MM-DD HH:mm:ss.SSS')}>
          <Text>{dayjs(text).format('MM-DD HH:mm:ss')}</Text>
        </Tooltip>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      valueType: 'select',
      valueEnum: Object.fromEntries(
        Object.entries(logLevels).map(([key, value]) => [
          key,
          { text: value.text, status: value.color },
        ]),
      ),
      render: (text: string) => {
        const config = logLevels[text as keyof typeof logLevels];
        return config ? <Badge color={config.color} text={config.text} /> : <Tag>{text}</Tag>;
      },
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      valueType: 'select',
      valueEnum: Object.fromEntries(
        Object.entries(actionTypes).map(([key, value]) => [
          key,
          { text: value.text, status: value.color },
        ]),
      ),
      render: (text: string) => {
        const config = actionTypes[text as keyof typeof actionTypes];
        return config ? <Tag color={config.color}>{config.text}</Tag> : <Tag>{text}</Tag>;
      },
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (text: string, record: SystemLog) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text || '系统'}</Text>
          {record.userRole && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.userRole}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      valueType: 'select',
      valueEnum: {
        auth: { text: '认证', status: 'blue' },
        user: { text: '用户', status: 'green' },
        device: { text: '设备', status: 'orange' },
        event: { text: '事件', status: 'red' },
        circle: { text: '守护圈', status: 'purple' },
        system: { text: '系统', status: 'default' },
        api: { text: 'API', status: 'cyan' },
      },
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '用户代理',
      dataIndex: 'userAgent',
      key: 'userAgent',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record: SystemLog) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条日志吗？"
            onConfirm={() => handleDelete([record.id])}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 查看详情
  const handleViewDetail = (record: SystemLog) => {
    setCurrentLog(record);
    setDetailVisible(true);
  };

  // 删除日志
  const handleDelete = async (ids: React.Key[]) => {
    try {
      const response = await systemAPI.deleteLogs(ids as string[]);
      if (response.code === 200) {
        message.success('日志删除成功！');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请稍后重试');
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的日志');
      return;
    }

    Modal.confirm({
      title: '批量删除日志',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条日志吗？此操作不可恢复。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDelete(selectedRowKeys),
    });
  };

  // 清空日志
  const handleClearLogs = () => {
    Modal.confirm({
      title: '清空所有日志',
      content: '确定要清空所有日志吗？此操作不可恢复，建议先导出备份。',
      okText: '确定清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await systemAPI.clearLogs();
          if (response.code === 200) {
            message.success('日志清理成功！');
            actionRef.current?.reload();
          } else {
            message.error(response.message || '清理失败');
          }
        } catch (error) {
          message.error('清空失败，请稍后重试');
        }
      },
    });
  };

  // 导出日志
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await systemAPI.exportLogs();
      if (response.code === 200) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `system_logs_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('日志导出成功');
      } else {
        message.error(response.message || '导出失败');
      }
    } catch (error) {
      message.error('导出失败，请稍后重试');
    } finally {
      setExportLoading(false);
    }
  };

  // 获取日志列表
  const fetchLogs = async (params: any) => {
    try {
      const response = await systemAPI.getLogs({
        page: params.current,
        pageSize: params.pageSize,
        level: params.level,
        action: params.action,
        module: params.module,
        username: params.username,
        ipAddress: params.ipAddress,
        startTime: params.startTime,
        endTime: params.endTime,
        keyword: params.keyword,
        sorter: params.sorter,
      });

      if (response.code === 200) {
        return {
          data: response.data?.logs || [],
          total: response.data?.total || 0,
          success: true,
        };
      } else {
        message.error(response.message || '获取日志列表失败');
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
    } catch (error) {
      message.error('获取日志列表失败，请稍后重试');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <PageContainer title="系统日志" subTitle="查看和管理系统操作日志">
      <Card>
        <ProTable<SystemLog>
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          toolBarRender={() => [
            <Button
              key="export"
              icon={<ExportOutlined />}
              loading={exportLoading}
              onClick={handleExport}
            >
              导出日志
            </Button>,
            <Button
              key="batchDelete"
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>,
            <Popconfirm
              key="clear"
              title="确定要清空所有日志吗？"
              description="此操作不可恢复，建议先导出备份。"
              onConfirm={handleClearLogs}
              okText="确定"
              cancelText="取消"
              okType="danger"
            >
              <Button danger icon={<ClearOutlined />}>
                清空日志
              </Button>
            </Popconfirm>,
          ]}
          request={fetchLogs}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            preserveSelectedRowKeys: true,
          }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* 日志详情模态框 */}
      <Modal
        title="日志详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentLog && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="时间" span={2}>
              {dayjs(currentLog.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')}
            </Descriptions.Item>
            <Descriptions.Item label="级别">
              <Badge
                color={logLevels[currentLog.level as keyof typeof logLevels]?.color}
                text={
                  logLevels[currentLog.level as keyof typeof logLevels]?.text || currentLog.level
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={actionTypes[currentLog.action as keyof typeof actionTypes]?.color}>
                {actionTypes[currentLog.action as keyof typeof actionTypes]?.text ||
                  currentLog.action}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户">{currentLog.username || '系统'}</Descriptions.Item>
            <Descriptions.Item label="用户角色">{currentLog.userRole || '-'}</Descriptions.Item>
            <Descriptions.Item label="模块">
              <Tag>{currentLog.module}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
              <Text code>{currentLog.ipAddress}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {currentLog.description}
            </Descriptions.Item>
            <Descriptions.Item label="用户代理" span={2}>
              <Text type="secondary">{currentLog.userAgent}</Text>
            </Descriptions.Item>
            {currentLog.requestData && (
              <Descriptions.Item label="请求数据" span={2}>
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(currentLog.requestData, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
            {currentLog.responseData && (
              <Descriptions.Item label="响应数据" span={2}>
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(currentLog.responseData, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
            {currentLog.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Text type="danger">{currentLog.errorMessage}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="执行时间">
              {currentLog.duration ? `${currentLog.duration}ms` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态码">{currentLog.statusCode || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Logs;
