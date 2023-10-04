const useBreadcrumb = () => {
  const adminTop = () => {
    return [
      {
        name: '管理画面トップ',
      },
    ]
  }

  const adminRole = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '管理権限付与',
      },
    ]
  }

  const adminListUsers = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: 'ユーザー一覧',
      },
    ]
  }

  const adminAddWork = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品登録',
      },
    ]
  }

  const adminListWorks = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品一覧',
      },
    ]
  }

  const adminDetailWork = (workTitle: string) => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品一覧',
        path: '/admin/list-works',
      },
      {
        name: `『${workTitle}』詳細`,
      },
    ]
  }

  const adminEditWork = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品一覧',
        path: '/admin/list-works',
      },
      {
        name: `作品編集`,
      },
    ]
  }

  const adminAddEpisode = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品一覧',
        path: '/admin/list-works',
      },
      {
        name: `各話アップロード`,
      },
    ]
  }

  const adminEditEpisode = (workTitle: string, workId: number, episodeNum: string) => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '作品一覧',
        path: '/admin/list-works',
      },
      {
        name: `『${workTitle}』詳細`,
        path: `/admin/detail-work/${workId}`,
      },
      {
        name: `『${workTitle}${episodeNum}』編集`,
      },
    ]
  }

  const adminListPostWorks = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '投稿作品一覧',
      },
    ]
  }

  const adminDetailPostWork = (workTitle: string) => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: '投稿作品一覧',
        path: '/admin/list-post-works',
      },
      {
        name: `投稿作品『${workTitle}』詳細`,
      },
    ]
  }

  const adminListCommissions = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: 'コミッション一覧',
      },
    ]
  }

  const adminDetailCommission = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: 'コミッション一覧',
        path: '/admin/list-commissions',
      },
      {
        name: `コミッション詳細`,
      },
    ]
  }

  const adminPaymentList = () => {
    return [
      {
        name: '管理画面トップ',
        path: '/admin',
      },
      {
        name: `クリエイターへの支払い一覧`,
      },
    ]
  }

  return {
    adminTop,
    adminRole,
    adminListUsers,
    adminAddWork,
    adminListWorks,
    adminDetailWork,
    adminEditWork,
    adminAddEpisode,
    adminEditEpisode,
    adminListPostWorks,
    adminDetailPostWork,
    adminListCommissions,
    adminDetailCommission,
    adminPaymentList,
  }
}

export type BreadcrumbStore = ReturnType<typeof useBreadcrumb>
export { useBreadcrumb }
