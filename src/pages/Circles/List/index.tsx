import React, { useState, useRef } from 'react';
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
import { requestWrapper } from '@/utils/request';
import { showDeleteConfirm } from '@/components/ConfirmDialog';
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
  const handleDelete = async (record: GuardianCircle) => {
    showDeleteConfirm({
      title: '确认删除守护圈',
      content: `确定要删除守护圈 "${record.circle_name}" 吗？删除后无法恢复，且会影响相关设备和成员。`,
      onConfirm: async () => {
        await requestWrapper(
          () => circleAPI.deleteCircle(record.id),
          {
            successMessage: '守护圈删除成功！',
            showSuccessMessage: true,
            onSuccess: () => {
              actionRef.current?.reload();
            },
          }
        );
      },
    });
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
      dataIndex: 'circle_name',
      key: 'circle_name',
      render: (text, record) => (
        <Space>
          <a onClick={() => handleView(record)}>{text}</a>
        </Space>
      ),
      width: 200,
    },
    {
      title: '邀请码',
      dataIndex: 'circle_code',
      key: 'circle_code',
      render: (code) => (
        <Tag color="blue">{code}</Tag>
      ),
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'member_role',
      key: 'member_role',
      render: (role) => {
        const roleMap = {
          0: { text: '圈主', color: 'red' },
          1: { text: '管理员', color: 'orange' },
          2: { text: '成员', color: 'blue' },
        };
        const roleInfo = roleMap[role as keyof typeof roleMap] || { text: '未知', color: 'default' };
        return (
          <Tag color={roleInfo.color}>{roleInfo.text}</Tag>
        );
      },
      width: 100,
    },
    {
      title: '创建者',
      dataIndex: 'creator_name',
      key: 'creator_name',
      render: (name) => name || '未知',
      width: 120,
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
      dataIndex: 'create_time',
      key: 'create_time',
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
          <Tooltip title="删除">
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          </Tooltip>
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
            const response = await circleAPI.getCircles();

            if (response.code === 200) {
              return {
                data: response.data || [],
                success: true,
                total: response.data?.length || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            console.error('获取守护圈列表失败:', error);
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
