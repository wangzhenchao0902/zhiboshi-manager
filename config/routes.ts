export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/manager',
    name: 'admin.admin-manage',
    icon: 'crown',
    access: 'canAdmin',
    component: './Manager',
    // routes: [
    //   {
    //     path: '/admin/sub-page',
    //     name: 'sub-page',
    //     icon: 'smile',
    //     component: './Welcome',
    //   },
    // ],
  },
  {
    name: 'article.article-list',
    icon: 'unorderedList',
    path: '/article',
    component: './Article',
  },
  {
    name: 'warranty.warranty-list',
    icon: 'table',
    path: '/warranty',
    component: './Warranty',
  },
  {
    name: 'product.product-list',
    icon: 'bars',
    path: '/product',
    component: './Product',
  },
  {
    component: './404',
  },
];
