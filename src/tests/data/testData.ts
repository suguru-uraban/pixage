class TestData {
  // creatorsCountの取得
  static getCreatorsCount() {
    return {
      count: 0,
      createdAt: new Date(),
      serialNumber: 0,
      updatedAt: new Date(),
    }
  }

  // usersCountの取得
  static getUsersCount() {
    return {
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // usersPublicDataの取得
  static getUsersPublicData() {
    return {
      createdAt: new Date(),
      creatorId: 1,
      displayName: 'テストユーザー',
      isActive: false,
      isCreator: 'notCreator',
      picture: '',
      updatedAt: new Date(),
    }
  }

  // usersSecretDataの取得
  static getUsersSecretData() {
    return {
      availableFreePoint: 0,
      availablePaidPoint: 0,
      createdAt: new Date(),
      email: 'test@example.com',
      emailDomain: 'example.com',
      firstName: '優',
      language: 'ja',
      lastName: '佐藤',
      provider: 'password',
      receivedPoint: 0,
      role: 'user',
      uid: 'testId',
      updatedAt: new Date(),
    }
  }

  // usersSecretData(admin)の取得
  static getUsersSecretDataAdmin() {
    return {
      availableFreePoint: 0,
      availablePaidPoint: 0,
      createdAt: new Date(),
      email: 'test@example.com',
      emailDomain: 'example.com',
      firstName: '優',
      language: 'ja',
      lastName: '佐藤',
      provider: 'password',
      receivedPoint: 0,
      role: 'admin',
      uid: 'testId',
      updatedAt: new Date(),
    }
  }

  // usersSecretData(staff)の取得
  static getUsersSecretDataStaff() {
    return {
      availableFreePoint: 0,
      availablePaidPoint: 0,
      createdAt: new Date(),
      email: 'test@example.com',
      emailDomain: 'example.com',
      firstName: '優',
      language: 'ja',
      lastName: '佐藤',
      provider: 'password',
      receivedPoint: 0,
      role: 'staff',
      uid: 'testId',
      updatedAt: new Date(),
    }
  }

  // usersSecretData（Twitter）の取得
  static getUsersSecretDataTwitter() {
    return {
      availableFreePoint: 0,
      availablePaidPoint: 0,
      createdAt: new Date(),
      email: '',
      emailDomain: '',
      firstName: '',
      language: 'ja',
      lastName: '',
      provider: 'twitter.com',
      receivedPoint: 0,
      role: 'user',
      uid: 'testId',
      updatedAt: new Date(),
    }
  }

  // favoriteWorksの取得
  static getFavoriteWorks() {
    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      workId: 1,
    }
  }

  // likesの取得
  static getLikes() {
    return {
      createdAt: new Date(),
      episodeId: 1,
      updatedAt: new Date(),
      workId: 1,
    }
  }

  // worksの取得
  static getWorks() {
    return {
      createdAt: new Date(),
      creatorAllId: 1,
      creatorDrawingId: 0,
      creatorStoryId: 0,
      episodeCount: 1,
      episodeSerialNumber: 1,
      favorite: 0,
      language: ['ja'],
      official: true,
      popular: 0,
      release: true,
      searchCreatorId: [1, 0, 0],
      totalLike: 0,
      updatedAt: new Date(),
      workId: 1,
    }
  }

  // works > 言語データの取得
  static getWorksLangData() {
    return {
      createdAt: new Date(),
      genre: '恋愛',
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
      updatedAt: new Date(),
      workDescription:
        '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
      workTitle: 'リアル・マーメイド',
    }
  }

  // works > 言語データ > episodeの取得
  static getLangEpisodeData() {
    return {
      createdAt: new Date(),
      episodeId: 1,
      episodeNum: '第一話',
      episodeTitle: '',
      like: 0,
      release: true,
      updatedAt: new Date(),
    }
  }

  // works > 言語データ > imagesの取得
  static getLangImagesData() {
    return {
      createdAt: new Date(),
      images: [
        'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
      ],
      updatedAt: new Date(),
    }
  }

  // worksCountの取得
  static getWorksCount() {
    return {
      count: 0,
      createdAt: new Date(),
      serialNumber: 0,
      updatedAt: new Date(),
    }
  }
}

export default TestData
