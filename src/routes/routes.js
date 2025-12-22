

export const constRoutes = [
    {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/index.vue'),
        redirect: '/order/list',
        meta:{title: '订阅服务'},
        children:[
            {
                path: 'list',
                name: 'orderList',
                component: () => import('@/views/order/list.vue'),
                meta:{title: '订阅包选择页面'}
            },
        ]
    },{
    path: '/pdf',
        name: 'pdf',
        component: () => import('@/views/pdf/index.vue'),
        meta:{title: 'pdf'},
    }, {
    // 用户主页
    path: '/user',
        name: 'user',
        component: () => import('@/views/user/User.vue'),
        meta:{title: 'user'},
    }, {
        // 平台主页
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
        meta: {title: 'home'},
    }, {
        path: '/',
        name: 'default',
        component: () => import('@/views/home/Home.vue'),
        meta: {title: 'home'},
    }, {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/Search.vue'),
        meta: {title: 'search'},
    },{
        path: '/readpaper',
        name: 'readpaper',
        component: () => import('@/views/readpaper/index.vue'),
        redirect: '/readpaper/paper',
        meta: { title: '论文阅读' },
        children: [
            {
                path: 'paper',
                name: 'readpaperPaper',
                component: () => import('@/views/readpaper/paper.vue'),
                meta: { title: '论文详情' }
            }
        ]
    },
    // 新增期刊相关路由配置
    {
        path: '/periodical',
        name: 'periodical',
        component: () => import('@/views/periodical/index.vue'), // 直接在views目录下
        redirect: '/periodical/periodical',
        meta: { title: '期刊浏览' },
        children: [
            {
                path: 'periodical',
                name: 'periodicalDetail',
                component: () => import('@/views/periodical/periodical.vue'), // 直接在views/periodical目录下
                meta: { title: '期刊详情' }
            }
        ]
    },{
        path: '/patent',
        name: 'patent',
        component: () => import('@/views/patent/index.vue'),
        redirect: '/patent/patent',
        meta: { title: '专利查看' },
        children: [
            {
                path: 'patent',
                name: 'patentDetail',
                component: () => import('@/views/patent/patent.vue'),
                meta: { title: '专利详情' }
            }
        ]
    },{
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/index.vue'), // 对应搜索页面的父组件
        redirect: '/search/search', // 重定向到具体的搜索页面
        meta: { title: '学术搜索' }, // 侧边栏/面包屑显示的标题
        children: [
            {
                path: 'search',
                name: 'searchDetail',
                component: () => import('@/views/search/search.vue'), // 刚才编写的搜索页面组件
                meta: { title: '文献检索' } // 子页面标题
            }
        ]
    }
]

