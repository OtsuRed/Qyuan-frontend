import {ref} from "vue";

export const categories = [
    { id: 'all', name: '全部', count: 256 },
    { id: 'ai', name: '人工智能', count: 78 },
    { id: 'cs', name: '计算机科学', count: 64 },
    { id: 'math', name: '数学', count: 42 },
    { id: 'physics', name: '物理学', count: 36 },
    { id: 'biology', name: '生物学', count: 28 },
    { id: 'engineering', name: '工程学', count: 45 }
];

// 搜索筛选器
export const searchFilters = [
    { label: '全部', value: 'all' },
    { label: '论文', value: 'paper' },
    { label: '项目', value: 'project' },
    { label: '作者', value: 'author' },
    { label: '机构', value: 'institution' }
];

// 热门搜索标签
export const hotSearchTags = [
    '机器学习',
    '深度学习',
    '人工智能',
    '计算机视觉',
    '自然语言处理',
    '区块链',
    '物联网',
    '大数据'
];


// 模拟数据 - 推荐论文
export const recommendedPapers = [
    {
        id: 1,
        title: '基于Transformer的视觉语言预训练模型研究',
        abstract: '本文提出了一种新的视觉语言预训练模型，通过跨模态注意力机制实现图像和文本的深度融合...',
        author: '张三',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
        journal: '人工智能学报',
        date: '2023-11-20',
        views: 3245,
        likes: 156,
        tags: ['Transformer', '视觉语言', '预训练模型', '多模态'],
        type: 'paper'
    },
    {
        id: 2,
        title: '联邦学习中的隐私保护机制研究',
        abstract: '本文针对联邦学习中的数据隐私问题，提出了一种基于差分隐私的梯度保护机制...',
        author: '李四',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
        journal: '计算机研究与发展',
        date: '2023-10-15',
        views: 2876,
        likes: 142,
        tags: ['联邦学习', '隐私保护', '差分隐私', '机器学习'],
        type: 'paper'
    },
    {
        id: 3,
        title: '量子计算在优化问题中的应用探索',
        abstract: '本文研究了量子计算在解决复杂优化问题中的潜力，提出了基于量子退火的优化算法...',
        author: '王五',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五',
        journal: '科学通报',
        date: '2023-09-28',
        views: 2156,
        likes: 98,
        tags: ['量子计算', '优化算法', '量子退火', '计算复杂性'],
        type: 'paper'
    }
];


// 模拟数据 - 推荐项目
export const recommendedProjects = [
    {
        id: 1,
        name: 'DeepLearning-For-All',
        description: '一个面向初学者的深度学习教程项目，包含从基础到实践的完整代码示例...',
        author: 'AI实验室',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI实验室',
        language: 'Python',
        stars: 2456,
        forks: 589,
        tags: ['深度学习', '教程', 'Python', 'PyTorch'],
        type: 'project'
    },
    {
        id: 2,
        name: 'Blockchain-Security-Framework',
        description: '区块链安全框架，提供智能合约安全审计、漏洞检测等功能...',
        author: '安全研究组',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=安全研究组',
        language: 'Solidity',
        stars: 1876,
        forks: 324,
        tags: ['区块链', '安全', '智能合约', 'Solidity'],
        type: 'project'
    },
    {
        id: 3,
        name: 'Medical-Image-Analysis',
        description: '医学影像分析工具包，支持多种影像格式的处理和分析...',
        author: '医疗AI团队',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=医疗AI团队',
        language: 'Python',
        stars: 1567,
        forks: 287,
        tags: ['医学影像', 'AI诊断', '图像处理', '医疗'],
        type: 'project'
    }
];

// 模拟数据 - 推荐作者
export const recommendedAuthors = [
    {
        id: 1,
        name: '张教授',
        title: '教授',
        institution: '北京航空航天大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授',
        papers: 45,
        followers: 2345,
        citations: 5678,
        fields: ['人工智能', '机器学习', '计算机视觉'],
        isFollowing: false
    },
    {
        id: 2,
        name: '李研究员',
        title: '高级研究员',
        institution: '中国科学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李研究员',
        papers: 32,
        followers: 1876,
        citations: 3456,
        fields: ['数据科学', '大数据', '统计分析'],
        isFollowing: true
    },
    {
        id: 3,
        name: '王博士',
        title: '副教授',
        institution: '北京大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王博士',
        papers: 28,
        followers: 1567,
        citations: 2890,
        fields: ['自然语言处理', '知识图谱', '信息检索'],
        isFollowing: false
    }
];