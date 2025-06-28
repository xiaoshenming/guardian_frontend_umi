import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Space,
  Descriptions,
  Tag,
  List,
  Statistic,
  Tabs,
  Timeline,
  message,
  Modal,
  Dropdown,
  Menu,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SettingOutlined,
  UserAddOutlined,
  MoreOutlined,
  TeamOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import type { MenuProps } from 'antd';

const { TabPane } = Tabs;

interface CircleDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  privacy: string;
  avatar?: string;
  memberCount: number;
  maxMembers: number;
  location?: string;
  tags: string[];
  createdAt: string;
  createdBy: string;
  isOwner: boolean;
  isMember: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  lastActive: string;
  status: 'online' | 'offline';
}

interface Activity {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

const CircleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [circle, setCircle] = useState<CircleDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCircleDetail();
  }, [id]);

  const fetchCircleDetail = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取守护圈详情的API
      // 模拟数据
      setCircle({
        id: id || '1',
        name: '我的家庭圈',
        description: '这是我们温馨的家庭守护圈，关注每个家庭成员的安全和健康。',
        type: 'family',
        privacy: 'private',
        avatar: '',
        memberCount: 5,
        maxMembers: 10,
        location: '北京市朝阳区',
        tags: ['家庭', '安全', '健康'],
        createdAt: '2024-01-15',
        createdBy: '张三',
        isOwner: true,
        isMember: true,
      });

      setMembers([
        {
          id: '1',
          name: '张三',
          role: 'owner',
          joinedAt: '2024-01-15',
          lastActive: '2024-01-20 10:30',
          status: 'online',
        },
        {
          id: '2',
          name: '李四',
          role: 'member',
          joinedAt: '2024-01-16',
          lastActive: '2024-01-20 09:15',
          status: 'offline',
        },
      ]);

      setActivities([
        {
          id: '1',
          type: 'member_join',
          description: '李四加入了守护圈',
          user: '李四',
          timestamp: '2024-01-16 14:30',
        },
        {
          id: '2',
          type: 'circle_create',
          description: '创建了守护圈',
          user: '张三',
          timestamp: '2024-01-15 10:00',
        },
      ]);
    } catch (error) {
      message.error('获取守护圈详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async () => {
    try {
      // TODO: 调用加入守护圈的API
      message.success('已申请加入守护圈');
    } catch (error) {
      message.error('申请失败，请重试');
    }
  };

  const handleLeaveCircle = () => {
    Modal.confirm({
      title: '确认退出守护圈？',
      content: '退出后将无法查看守护圈内容，确定要退出吗？',
      onOk: async () => {
        try {
          // TODO: 调用退出守护圈的API
          message.success('已退出守护圈');
          history.push('/circles/list');
        } catch (error) {
          message.error('退出失败，请重试');
        }
      },
    });
  };

  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: '编辑信息',
      icon: <EditOutlined />,
      disabled: !circle?.isOwner,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      disabled: !circle?.isOwner,
    },
    {
      type: 'divider',
    },
    {
      key: 'leave',
      label: '退出守护圈',
      danger: true,
      disabled: circle?.isOwner,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'edit':
        // TODO: 跳转到编辑页面
        break;
      case 'settings':
        history.push(`/circles/${id}/settings`);
        break;
      case 'leave':
        handleLeaveCircle();
        break;
    }
  };

  if (!circle) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
              返回
            </Button>
          </Space>
        }
        extra={
          <Space>
            {!circle.isMember && (
              <Button type="primary" onClick={handleJoinCircle}>
                申请加入
              </Button>
            )}
            {circle.isMember && <Button icon={<UserAddOutlined />}>邀请成员</Button>}
            <Dropdown menu={{ items: moreMenuItems, onClick: handleMenuClick }} trigger={['click']}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={120} src={circle.avatar}>
                {circle.name.charAt(0)}
              </Avatar>
              <h2 style={{ marginTop: 16, marginBottom: 8 }}>{circle.name}</h2>
              <Tag color="blue">{circle.type === 'family' ? '家庭圈' : circle.type}</Tag>
            </div>
          </Col>
          <Col span={18}>
            <Descriptions column={2}>
              <Descriptions.Item label="描述" span={2}>
                {circle.description}
              </Descriptions.Item>
              <Descriptions.Item label="成员数量">
                <Space>
                  <TeamOutlined />
                  {circle.memberCount}/{circle.maxMembers}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="隐私设置">
                <Space>
                  <SafetyOutlined />
                  {circle.privacy === 'private' ? '私密' : '公开'}
                </Space>
              </Descriptions.Item>
              {circle.location && (
                <Descriptions.Item label="位置">
                  <Space>
                    <EnvironmentOutlined />
                    {circle.location}
                  </Space>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="创建时间">
                <Space>
                  <ClockCircleOutlined />
                  {circle.createdAt}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="标签" span={2}>
                {circle.tags.map((tag) => (
                  <Tag key={tag} color="geekblue">
                    {tag}
                  </Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="统计信息">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="总成员" value={circle.memberCount} />
              </Col>
              <Col span={12}>
                <Statistic title="在线成员" value={1} valueStyle={{ color: '#3f8600' }} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="成员列表" key="members">
                <List
                  dataSource={members}
                  renderItem={(member) => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small">
                          查看详情
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={member.avatar}>{member.name.charAt(0)}</Avatar>}
                        title={
                          <Space>
                            {member.name}
                            <Tag
                              color={
                                member.role === 'owner'
                                  ? 'gold'
                                  : member.role === 'admin'
                                    ? 'blue'
                                    : 'default'
                              }
                            >
                              {member.role === 'owner'
                                ? '圈主'
                                : member.role === 'admin'
                                  ? '管理员'
                                  : '成员'}
                            </Tag>
                            <Tag color={member.status === 'online' ? 'green' : 'default'}>
                              {member.status === 'online' ? '在线' : '离线'}
                            </Tag>
                          </Space>
                        }
                        description={`加入时间: ${member.joinedAt} | 最后活跃: ${member.lastActive}`}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="动态" key="activities">
                <Timeline>
                  {activities.map((activity) => (
                    <Timeline.Item key={activity.id}>
                      <div>
                        <strong>{activity.user}</strong> {activity.description}
                      </div>
                      <div style={{ color: '#999', fontSize: '12px' }}>{activity.timestamp}</div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CircleDetail;
