import React, { useRef, useState } from 'react';
import {
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Avatar,
  Switch,
  Tooltip,
  Card,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CrownOutlined,
  SafetyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { systemAPI } from '@/services/api';
import type { User } from '@/services/api';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<User | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取用户角色图标
  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <CrownOutlined />,
      manager: <SafetyOutlined />,
      operator: <UserOutlined />,
      viewer: <EyeOutlined />,
    };
    return icons[role as keyof typeof icons] || <UserOutlined />;
  };

  // 获取用户角色颜色
  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'red',
      manager: 'orange',
      operator: 'blue',
      viewer: 'green',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  // 获取用户状态颜色
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      inactive: 'default',
      locked: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  // 删除用户
  const handleDelete = async (record: User) => {
    try {
      const response = await systemAPI.deleteUser(record.id);
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
      message.warning('请选择要删除的用户');
      return;
    }

    try {
      const response = await systemAPI.batchDeleteUsers(selectedRowKeys as number[]);
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

  // 切换用户状态
  const toggleUserStatus = async (record: User, active: boolean) => {
    try {
      const response = await systemAPI.updateUser(record.id, {
        ...record,
        status: active ? 'active' : 'inactive',
      });
      if (response.success) {
        message.success(`用户已${active ? '激活' : '禁用'}`);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 查看用户详情
  const handleView = (record: User) => {
    history.push(`/users/${record.id}`);
  };

  // 编辑用户
  const handleEdit = (record: User) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  const columns: ProColumns<User>[] = [
    {
      title: '用户信息',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div>
              <a onClick={() => handleView(record)}>{record.realName || text}</a>
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>@{text}</div>
          </div>
        </Space>
      ),
      width: 200,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: '系统管理员',
          manager: '安全管理员',
          operator: '操作员',
          viewer: '观察员',
        };
        return (
          <Tag icon={getRoleIcon(role)} color={getRoleColor(role)}>
            {roleMap[role as keyof typeof roleMap] || role}
          </Tag>
        );
      },
      width: 120,
      filters: [
        { text: '系统管理员', value: 'admin' },
        { text: '安全管理员', value: 'manager' },
        { text: '操作员', value: 'operator' },
        { text: '观察员', value: 'viewer' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          active: '正常',
          inactive: '禁用',
          locked: '锁定',
        };
        return (
          <Tag color={getStatusColor(status)}>
            {statusMap[status as keyof typeof statusMap] || status}
          </Tag>
        );
      },
      width: 100,
      filters: [
        { text: '正常', value: 'active' },
        { text: '禁用', value: 'inactive' },
        { text: '锁定', value: 'locked' },
      ],
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      search: false,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (time) => (time ? new Date(time).toLocaleString() : '从未登录'),
      width: 160,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => new Date(time).toLocaleString(),
      width: 160,
      search: false,
      sorter: true,
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      key: 'enabled',
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => toggleUserStatus(record, checked)}
          size="small"
          disabled={record.role === 'admin'} // 管理员不能被禁用
        />
      ),
      width: 80,
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
          <Tooltip title="编辑">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
            disabled={record.role === 'admin'} // 管理员不能被删除
          >
            <Tooltip title={record.role === 'admin' ? '管理员不能删除' : '删除'}>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={record.role === 'admin'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: User) => ({
      disabled: record.role === 'admin', // 管理员不能被批量操作
    }),
  };

  return (
    <PageContainer title="用户管理" subTitle="系统用户与权限管理">
      {/* 统计卡片 */}
      <div style={{ marginBottom: 16 }}>
        <Card>
          <Statistic.Group>
            <Statistic title="总用户数" value={0} loading prefix={<TeamOutlined />} />
            <Statistic title="活跃用户" value={0} loading prefix={<UserOutlined />} />
            <Statistic title="管理员" value={0} loading prefix={<CrownOutlined />} />
            <Statistic title="今日登录" value={0} loading prefix={<SafetyOutlined />} />
          </Statistic.Group>
        </Card>
      </div>

      <ProTable<User>
        headerTitle="用户列表"
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
            添加用户
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要删除选中的用户吗？"
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
            const response = await systemAPI.getUsers({
              page: params.current,
              pageSize: params.pageSize,
              keyword: params.username || params.email,
              role: filter.role?.[0],
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

      {/* 创建用户弹窗 */}
      <CreateUserModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />

      {/* 编辑用户弹窗 */}
      <EditUserModal
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

export default UserList;
