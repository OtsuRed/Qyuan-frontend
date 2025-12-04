

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
    }

]