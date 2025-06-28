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
  Switch,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  WifiOutlined,
  DisconnectOutlined,
  CameraOutlined,
  SoundOutlined,
  FireOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { deviceAPI } from '@/services/api';
import type { Device } from '@/services/api';
import CreateDeviceModal from './components/CreateDeviceModal';
import EditDeviceModal from './components/EditDeviceModal';

const DeviceList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Device | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取设备类型图标
  const getDeviceTypeIcon = (type: string) => {
    const icons = {
      camera: <CameraOutlined />,
      sensor: <EnvironmentOutlined />,
      alarm: <SoundOutlined />,
      fire_detector: <FireOutlined />,
      access_control: <SafetyOutlined />,
      other: <QuestionCircleOutlined />,
    };
    return icons[type as keyof typeof icons] || <QuestionCircleOutlined />;
  };

  // 获取设备状态颜色
  const getDeviceStatusColor = (status: string) => {
    const colors = {
      online: 'success',
      offline: 'error',
      maintenance: 'warning',
      error: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  // 获取信号强度颜色
  const getSignalColor = (signal: number) => {
    if (signal >= 80) return '#52c41a';
    if (signal >= 60) return '#faad14';
    if (signal >= 40) return '#fa8c16';
    return '#f5222d';
  };

  // 删除设备
  const handleDelete = async (record: Device) => {
    try {
      const response = await deviceAPI.deleteDevice(record.id);
      if (response.success) {
        message.success('删除成功！');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的设备');
      return;
    }

    try {
      const response = await deviceAPI.batchDelete(selectedRowKeys as number[]);
      if (response.success) {
        message.success('批量删除成功！');
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '批量删除失败');
      }
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 切换设备状态
  const toggleDeviceStatus = async (record: Device, enabled: boolean) => {
    try {
      const response = await deviceAPI.updateDevice(record.id, {
        ...record,
        enabled,
      });
      if (response.success) {
        message.success(`设备已${enabled ? '启用' : '禁用'}`);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 查看设备详情
  const handleView = (record: Device) => {
    history.push(`/devices/${record.id}`);
  };

  // 编辑设备
  const handleEdit = (record: Device) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // 设备配置
  const handleConfig = (record: Device) => {
    history.push(`/devices/${record.id}/config`);
  };

  const columns: ProColumns<Device>[] = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            icon={getDeviceTypeIcon(record.type)}
            style={{
              backgroundColor: record.enabled ? '#1890ff' : '#d9d9d9',
            }}
          />
          <div>
            <a onClick={() => handleView(record)}>{text}</a>
            <div style={{ fontSize: 12, color: '#999' }}>{record.deviceId}</div>
          </div>
        </Space>
      ),
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          camera: '摄像头',
          sensor: '传感器',
          alarm: '报警器',
          fire_detector: '火灾探测器',
          access_control: '门禁系统',
          other: '其他',
        };
        return (
          <Tag icon={getDeviceTypeIcon(type)}>{typeMap[type as keyof typeof typeMap] || type}</Tag>
        );
      },
      width: 120,
      filters: [
        { text: '摄像头', value: 'camera' },
        { text: '传感器', value: 'sensor' },
        { text: '报警器', value: 'alarm' },
        { text: '火灾探测器', value: 'fire_detector' },
        { text: '门禁系统', value: 'access_control' },
        { text: '其他', value: 'other' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusMap = {
          online: '在线',
          offline: '离线',
          maintenance: '维护中',
          error: '故障',
        };
        return (
          <Space>
            <Badge
              status={getDeviceStatusColor(status) as any}
              text={statusMap[status as keyof typeof statusMap] || status}
            />
            {status === 'online' && <WifiOutlined style={{ color: '#52c41a' }} />}
            {status === 'offline' && <DisconnectOutlined style={{ color: '#f5222d' }} />}
          </Space>
        );
      },
      width: 120,
      filters: [
        { text: '在线', value: 'online' },
        { text: '离线', value: 'offline' },
        { text: '维护中', value: 'maintenance' },
        { text: '故障', value: 'error' },
      ],
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      key: 'signalStrength',
      render: (signal) => (
        <div style={{ width: 80 }}>
          <Progress
            percent={signal}
            size="small"
            strokeColor={getSignalColor(signal)}
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
      width: 120,
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
      title: '所属守护圈',
      dataIndex: 'circle',
      key: 'circle',
      render: (circle) => circle?.name || '-',
      width: 120,
      search: false,
    },
    {
      title: '最后在线',
      dataIndex: 'lastOnline',
      key: 'lastOnline',
      render: (time) => (time ? new Date(time).toLocaleString() : '-'),
      width: 160,
      search: false,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => toggleDeviceStatus(record, checked)}
          size="small"
        />
      ),
      width: 80,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="配置">
            <Button type="link" icon={<SettingOutlined />} onClick={() => handleConfig(record)} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个设备吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <PageContainer title="设备管理" subTitle="安全设备监控与管理">
      {/* 统计卡片 */}
      <div style={{ marginBottom: 16 }}>
        <Card>
          <Statistic.Group>
            <Statistic title="总设备数" value={0} loading />
            <Statistic title="在线设备" value={0} loading />
            <Statistic title="离线设备" value={0} loading />
            <Statistic title="故障设备" value={0} loading />
          </Statistic.Group>
        </Card>
      </div>

      <ProTable<Device>
        headerTitle="设备列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        rowSelection={rowSelection}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            添加设备
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要删除选中的设备吗？"
            onConfirm={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
            okText="确定"
            cancelText="取消"
          >
            <Button danger disabled={selectedRowKeys.length === 0} icon={<DeleteOutlined />}>
              批量删除
            </Button>
          </Popconfirm>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await deviceAPI.getDevices({
              page: params.current,
              pageSize: params.pageSize,
              keyword: params.name,
              type: filter.type?.[0],
              status: filter.status?.[0],
            });

            if (response.success) {
              return {
                data: response.data.list,
                success: true,
                total: response.data.total,
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

      {/* 创建设备弹窗 */}
      <CreateDeviceModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />

      {/* 编辑设备弹窗 */}
      <EditDeviceModal
        visible={editModalVisible}
        record={currentRecord}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentRecord(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setCurrentRecord(null);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default DeviceList;
