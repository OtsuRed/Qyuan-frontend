

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
        // 登录
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue')
    }, {
        // 注册
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
    }, {
        // 用户主页
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/UserCenter.vue'),
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
    }

]