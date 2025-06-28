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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  SettingOutlined,
  HomeOutlined,
  BankOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { circleAPI } from '@/services/api';
import type { GuardianCircle } from '@/services/api';
import CreateCircleModal from './components/CreateCircleModal';
import EditCircleModal from './components/EditCircleModal';

const CircleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<GuardianCircle | null>(null);

  // 获取守护圈类型图标
  const getCircleTypeIcon = (type: string) => {
    const icons = {
      family: <HomeOutlined />,
      community: <BankOutlined />,
      enterprise: <ShopOutlined />,
    };
    return icons[type as keyof typeof icons] || <HomeOutlined />;
  };

  // 获取守护圈类型标签颜色
  const getCircleTypeColor = (type: string) => {
    const colors = {
      family: 'blue',
      community: 'green',
      enterprise: 'purple',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  // 删除守护圈
  const handleDelete = async (id: number) => {
    try {
      const response = await circleAPI.deleteCircle(id);
      if (response.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 编辑守护圈
  const handleEdit = (record: GuardianCircle) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // 查看守护圈详情
  const handleView = (record: GuardianCircle) => {
    history.push(`/circles/${record.id}`);
  };

  // 管理成员
  const handleManageMembers = (record: GuardianCircle) => {
    history.push(`/circles/${record.id}/members`);
  };

  // 守护圈设置
  const handleSettings = (record: GuardianCircle) => {
    history.push(`/circles/${record.id}/settings`);
  };

  const columns: ProColumns<GuardianCircle>[] = [
    {
      title: '守护圈名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            icon={getCircleTypeIcon(record.type)}
            style={{ backgroundColor: getCircleTypeColor(record.type) }}
          />
          <a onClick={() => handleView(record)}>{text}</a>
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
          family: '家庭',
          community: '社区',
          enterprise: '企业',
        };
        return (
          <Tag color={getCircleTypeColor(type)} icon={getCircleTypeIcon(type)}>
            {typeMap[type as keyof typeof typeMap] || type}
          </Tag>
        );
      },
      width: 100,
      filters: [
        { text: '家庭', value: 'family' },
        { text: '社区', value: 'community' },
        { text: '企业', value: 'enterprise' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={status === 'active' ? '活跃' : '非活跃'}
        />
      ),
      width: 100,
      filters: [
        { text: '活跃', value: 'active' },
        { text: '非活跃', value: 'inactive' },
      ],
    },
    {
      title: '成员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (count, record) => (
        <Tooltip title="点击管理成员">
          <Button type="link" icon={<TeamOutlined />} onClick={() => handleManageMembers(record)}>
            {count}
          </Button>
        </Tooltip>
      ),
      width: 100,
      sorter: true,
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      render: (count) => <Badge count={count} showZero style={{ backgroundColor: '#52c41a' }} />,
      width: 100,
      sorter: true,
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
      title: '创建时间',
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
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="设置">
            <Button type="link" icon={<SettingOutlined />} onClick={() => handleSettings(record)} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个守护圈吗？"
            description="删除后将无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <PageContainer title="守护圈管理" subTitle="管理您的所有守护圈">
      {/* 统计卡片 */}
      <div style={{ marginBottom: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Statistic title="总守护圈" value={0} loading />
            <Statistic title="活跃守护圈" value={0} loading />
            <Statistic title="总成员数" value={0} loading />
            <Statistic title="总设备数" value={0} loading />
          </div>
        </Card>
      </div>

      <ProTable<GuardianCircle>
        headerTitle="守护圈列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建守护圈
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await circleAPI.getCircles({
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
        scroll={{ x: 1200 }}
      />

      {/* 创建守护圈弹窗 */}
      <CreateCircleModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />

      {/* 编辑守护圈弹窗 */}
      <EditCircleModal
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

export default CircleList;
