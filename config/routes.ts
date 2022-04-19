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
    name: 'anli.anli-list',
    icon: 'unorderedList',
    path: '/anli',
    component: './Anli',
  },
  { name: 'warranty.warranty-list', icon: 'table', path: '/warranty', component: './Warranty' },
  { name: 'product.product-list', icon: 'bars', path: '/product', component: './Product' },

  {
    name: 'warranty.warrantychechuang-list',
    icon: 'table',
    path: '/warrantychechuang',
    component: './WarrantyChechuang',
  },
  {
    name: 'product.productchechuang-list',
    icon: 'bars',
    path: '/productchechuang',
    component: './ProductChechuang',
  },

  {
    name: 'warranty.warrantytianchuang-list',
    icon: 'table',
    path: '/warrantytianchuang',
    component: './WarrantyTianchuang',
  },
  {
    name: 'product.producttianchuang-list',
    icon: 'bars',
    path: '/producttianchuang',
    component: './ProductTianchuang',
  },
  {
    component: './404',
  },
];
