import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Avatar,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Tooltip,
  Badge,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CrownOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  lastActive: string;
  deviceCount: number;
  isOnline: boolean;
}

interface InviteForm {
  email: string;
  role: 'admin' | 'member';
  message?: string;
}

const CircleMembers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchMembers();
  }, [id]);

  useEffect(() => {
    filterMembers();
  }, [members, searchText, roleFilter, statusFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取成员列表的API
      // 模拟数据
      const mockMembers: Member[] = [
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138001',
          role: 'owner',
          status: 'active',
          joinedAt: '2024-01-15',
          lastActive: '2024-01-20 10:30',
          deviceCount: 3,
          isOnline: true,
        },
        {
          id: '2',
          name: '李四',
          email: 'lisi@example.com',
          phone: '13800138002',
          role: 'admin',
          status: 'active',
          joinedAt: '2024-01-16',
          lastActive: '2024-01-20 09:15',
          deviceCount: 2,
          isOnline: false,
        },
        {
          id: '3',
          name: '王五',
          email: 'wangwu@example.com',
          phone: '13800138003',
          role: 'member',
          status: 'pending',
          joinedAt: '2024-01-18',
          lastActive: '2024-01-19 16:45',
          deviceCount: 1,
          isOnline: false,
        },
      ];
      setMembers(mockMembers);
    } catch (error) {
      message.error('获取成员列表失败');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.email.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // 角色过滤
    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => member.role === roleFilter);
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter((member) => member.status === statusFilter);
    }

    setFilteredMembers(filtered);
  };

  const handleInviteMember = async (values: InviteForm) => {
    try {
      // TODO: 调用邀请成员的API
      console.log('邀请成员:', values);
      message.success('邀请已发送');
      setInviteModalVisible(false);
      form.resetFields();
      fetchMembers();
    } catch (error) {
      message.error('邀请失败，请重试');
    }
  };

  const handleEditMember = async (values: Partial<Member>) => {
    try {
      // TODO: 调用编辑成员的API
      console.log('编辑成员:', values);
      message.success('成员信息已更新');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // TODO: 调用移除成员的API
      console.log('移除成员:', memberId);
      message.success('成员已移除');
      fetchMembers();
    } catch (error) {
      message.error('移除失败，请重试');
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    editForm.setFieldsValue({
      role: member.role,
      status: member.status,
    });
    setEditModalVisible(true);
  };

  const columns: ColumnsType<Member> = [
    {
      title: '成员',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Badge dot={record.isOnline} color="green">
            <Avatar src={record.avatar}>{record.name.charAt(0)}</Avatar>
          </Badge>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ color: '#999', fontSize: '12px' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleConfig = {
          owner: { color: 'gold', icon: <CrownOutlined />, text: '圈主' },
          admin: { color: 'blue', icon: <TeamOutlined />, text: '管理员' },
          member: { color: 'default', icon: null, text: '成员' },
        };
        const config = roleConfig[role as keyof typeof roleConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: '正常' },
          inactive: { color: 'red', text: '禁用' },
          pending: { color: 'orange', text: '待审核' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '设备数',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      render: (count) => <span>{count} 台</span>,
    },
    {
      title: '加入时间',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              disabled={record.role === 'owner'}
            />
          </Tooltip>
          <Popconfirm
            title="确认移除该成员？"
            onConfirm={() => handleRemoveMember(record.id)}
            disabled={record.role === 'owner'}
          >
            <Tooltip title="移除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.role === 'owner'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
              返回
            </Button>
            成员管理
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteModalVisible(true)}
          >
            邀请成员
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索成员姓名或邮箱"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="角色筛选"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部角色</Option>
              <Option value="owner">圈主</Option>
              <Option value="admin">管理员</Option>
              <Option value="member">成员</Option>
            </Select>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredMembers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个成员`,
          }}
        />
      </Card>

      {/* 邀请成员弹窗 */}
      <Modal
        title="邀请成员"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleInviteMember}>
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入要邀请的用户邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
            initialValue="member"
          >
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="member">成员</Option>
            </Select>
          </Form.Item>
          <Form.Item name="message" label="邀请消息（可选）">
            <Input.TextArea rows={3} placeholder="可以添加一些邀请说明" maxLength={200} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                发送邀请
              </Button>
              <Button onClick={() => setInviteModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑成员弹窗 */}
      <Modal
        title="编辑成员"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedMember(null);
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditMember}>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="member">成员</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CircleMembers;
