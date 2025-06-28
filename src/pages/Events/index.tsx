import React, { useRef, useState } from 'react';
import {
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Badge,
  Tooltip,
  Avatar,
  Card,
  Statistic,
  Select,
  Modal,
  Form,
  Input,
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  FireOutlined,
  SafetyOutlined,
  DisconnectOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { eventAPI } from '@/services/api';
import type { SecurityEvent } from '@/services/api';

const { TextArea } = Input;
const { Option } = Select;

const EventList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SecurityEvent | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

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

  // 处理单个事件
  const handleEvent = async (record: SecurityEvent) => {
    setCurrentRecord(record);
    setHandleModalVisible(true);
  };

  // 提交处理结果
  const handleSubmit = async () => {
    if (!currentRecord) return;

    try {
      const values = await form.validateFields();
      const response = await eventAPI.handleEvent(currentRecord.id, {
        status: values.status,
        note: values.note,
      });

      if (response.code === 200) {
        message.success('事件处理成功！');
        setHandleModalVisible(false);
        form.resetFields();
        setCurrentRecord(null);
        actionRef.current?.reload();
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

  // 批量处理事件
  const handleBatchProcess = async (status: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要处理的事件');
      return;
    }

    try {
      const response = await eventAPI.batchHandle(selectedRowKeys as number[], { status });

      if (response.code === 200) {
        message.success(`批量${status === 'resolved' ? '解决' : '忽略'}成功！`);
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '批量处理失败');
      }
    } catch (error) {
      message.error('批量处理失败');
    }
  };

  // 查看事件详情
  const handleView = (record: SecurityEvent) => {
    history.push(`/events/${record.id}`);
  };

  const columns: ProColumns<SecurityEvent>[] = [
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <Avatar
            icon={getEventTypeIcon(record.type)}
            style={{
              backgroundColor: getEventLevelColor(record.level),
            }}
          />
          <a onClick={() => handleView(record)}>{text}</a>
        </Space>
      ),
      width: 250,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          intrusion: '入侵检测',
          fire: '火灾报警',
          emergency: '紧急事件',
          device_offline: '设备离线',
          other: '其他',
        };
        return (
          <Tag icon={getEventTypeIcon(type)}>{typeMap[type as keyof typeof typeMap] || type}</Tag>
        );
      },
      width: 120,
      filters: [
        { text: '入侵检测', value: 'intrusion' },
        { text: '火灾报警', value: 'fire' },
        { text: '紧急事件', value: 'emergency' },
        { text: '设备离线', value: 'device_offline' },
        { text: '其他', value: 'other' },
      ],
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const levelMap = {
          low: '低',
          medium: '中',
          high: '高',
          critical: '紧急',
        };
        return (
          <Tag color={getEventLevelColor(level)}>
            {levelMap[level as keyof typeof levelMap] || level}
          </Tag>
        );
      },
      width: 80,
      filters: [
        { text: '低', value: 'low' },
        { text: '中', value: 'medium' },
        { text: '高', value: 'high' },
        { text: '紧急', value: 'critical' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: '待处理',
          processing: '处理中',
          resolved: '已解决',
          ignored: '已忽略',
        };
        return (
          <Badge
            status={getEventStatusColor(status) as any}
            text={statusMap[status as keyof typeof statusMap] || status}
          />
        );
      },
      width: 100,
      filters: [
        { text: '待处理', value: 'pending' },
        { text: '处理中', value: 'processing' },
        { text: '已解决', value: 'resolved' },
        { text: '已忽略', value: 'ignored' },
      ],
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (location) => location?.name || '-',
      width: 120,
      search: false,
    },
    {
      title: '发生时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => new Date(time).toLocaleString(),
      width: 160,
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="处理事件">
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleEvent(record)} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: SecurityEvent) => ({
      disabled: record.status !== 'pending',
    }),
  };

  return (
    <PageContainer title="事件管理" subTitle="安全事件监控与处理">
      {/* 统计卡片 */}
      <div style={{ marginBottom: 16 }}>
        <Card>
          <Statistic.Group>
            <Statistic title="总事件数" value={0} loading />
            <Statistic title="待处理" value={0} loading />
            <Statistic title="处理中" value={0} loading />
            <Statistic title="已解决" value={0} loading />
          </Statistic.Group>
        </Card>
      </div>

      <ProTable<SecurityEvent>
        headerTitle="事件列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        rowSelection={rowSelection}
        toolBarRender={() => [
          <Button
            key="resolve"
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBatchProcess('resolved')}
          >
            批量解决
          </Button>,
          <Button
            key="ignore"
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBatchProcess('ignored')}
          >
            批量忽略
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await eventAPI.getEvents({
              page: params.current,
              pageSize: params.pageSize,
              keyword: params.title,
              type: filter.type?.[0],
              level: filter.level?.[0],
              status: filter.status?.[0],
            });

            if (response.code === 200) {
              return {
                data: response.data?.events || [],
                total: response.data?.total || 0,
                success: true,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1400 }}
      />

      {/* 处理事件弹窗 */}
      <Modal
        title="处理事件"
        open={handleModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setHandleModalVisible(false);
          form.resetFields();
          setCurrentRecord(null);
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

export default EventList;
