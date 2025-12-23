// 用户信息（实际应从API获取）

export const userInfo = {
    id: 'current_user_id',
    username: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    gender: '男',
    bio: '热爱学术研究，专注于计算机科学领域',
    institution: '北京航空航天大学',
    title: '教授',
    researchFields: ['人工智能', '机器学习', '计算机视觉']
};

// 访客信息（从API获取指定用户的信息）
export const visitorInfo = {
    username: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
    institution: '北京大学',
    title: '副教授',
    bio: '专注于自然语言处理和知识图谱研究',
    researchFields: ['自然语言处理', '知识图谱', '信息检索'],
    stats: {
        publications: 24,
        followers: 156,
        following: 89,
        citations: 1234
    }
};