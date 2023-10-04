const useAdminLink = () => {
  const links = [
    {
      id: 0,
      prefix: 'fas',
      icon: 'home',
      path: '/admin',
      value: '管理画面トップ',
      role: ['admin', 'staff'],
      child: false,
    },
    {
      id: 1,
      prefix: 'fas',
      icon: 'user-tag',
      path: '/admin/role',
      value: '管理権限付与',
      role: ['admin'],
      child: false,
    },
    {
      id: 2,
      prefix: 'fas',
      icon: 'user-plus',
      path: '/admin/list-users',
      value: 'ユーザー一覧',
      role: ['admin', 'staff'],
      child: false,
    },
    {
      id: 3,
      prefix: 'fas',
      icon: 'folder-plus',
      path: '/admin/add-work',
      value: '作品登録',
      role: ['admin', 'staff'],
      child: false,
    },
    {
      id: 4,
      prefix: 'fas',
      icon: 'th',
      path: '/admin/list-works',
      value: '作品一覧',
      role: ['admin', 'staff'],
      child: true,
    },
    {
      id: 5,
      prefix: 'fas',
      icon: 'file-upload',
      path: '/admin/list-post-works',
      value: '投稿作品一覧',
      role: ['admin', 'staff'],
      child: true,
    },
    {
      id: 6,
      prefix: 'fas',
      icon: 'handshake',
      path: '/admin/list-commissions',
      value: 'コミッション一覧',
      role: ['admin', 'staff'],
      child: true,
    },
    {
      id: 7,
      prefix: 'fas',
      icon: 'money-bill',
      path: '/admin/payment-list',
      value: 'クリエイターへの\n支払い一覧',
      role: ['admin', 'staff'],
      child: true,
    },
  ]

  return {
    links,
  }
}

export { useAdminLink }
