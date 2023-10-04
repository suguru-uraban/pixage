const useLink = () => {
  const headers = [
    {
      id: 0,
      prefix: 'fas',
      icon: 'home',
      path: '/',
      value: 'header.home',
      requireSignIn: false,
    },
    {
      id: 1,
      prefix: 'fas',
      icon: 'heart',
      path: '/favorite-works',
      value: 'header.favorite',
      requireSignIn: true,
    },
  ]

  return {
    headers,
  }
}

export { useLink }
