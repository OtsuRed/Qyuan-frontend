

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
    }
]