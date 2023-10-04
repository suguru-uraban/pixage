/**
 * @jest-environment node
 */
import * as fs from 'fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { v4 } from 'uuid'

import testData from '@/tests/data/testData'

import { serverTimestamp as st } from 'firebase/firestore'
import firebase from 'firebase/compat'
const serverTimestamp = () => st()

const projectId = v4()
let testEnv: RulesTestEnvironment

describe('firestoreのテスト', () => {
  beforeAll(async () => {
    // テストプロジェクト環境の作成
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: fs.readFileSync('./firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    })
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  describe('creatorsCountへのアクセス', () => {
    describe('creatorsCountのデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(context.firestore().doc('creatorsCount/global').get())
      })
    })

    describe('creatorsCountのデータ更新', () => {
      it('認証ありでの更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('認証なしでの更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('creatorsCountのスキーマ検証', () => {
      it('countとserialNumberにはnumber型が入る', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('countにはnumber型以外は入らない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: 'hoge',
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('serialNumberにはnumber型以外は入らない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: 'hoge',
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('creatorsCountのバリデーション', () => {
      it('countは0未満にならない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(-1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('serialNumberは0未満にならない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('creatorsCount/global').set(testData.getCreatorsCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('creatorsCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(-1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })
  })

  describe('usersCountへのアクセス', () => {
    describe('usersCountのデータ更新', () => {
      it('認証なしでの更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('usersCount/global').set(testData.getUsersCount())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(
          context
            .firestore()
            .doc('usersCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('usersCountのスキーマ検証', () => {
      it('countにはnumber型が入る', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('usersCount/global').set(testData.getUsersCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context
            .firestore()
            .doc('usersCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('countにはnumber型以外は入らない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('usersCount/global').set(testData.getUsersCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc('usersCount/global').update({
            count: 'hoge',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersCountのバリデーション', () => {
      it('countは0未満にならない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('usersCount/global').set(testData.getUsersCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('usersCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(-1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })
  })

  describe('usersPublicDataへのアクセス', () => {
    const uid = 'testId'

    describe('usersPublicDataのデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context
            .firestore()
            .doc(`usersPublicData/${v4()}`)
            .set(testData.getUsersPublicData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(context.firestore().doc(`usersPublicData/${v4()}`).get())
      })
    })

    describe('usersPublicDataのデータ作成', () => {
      it('認証なしでの作成に成功', async () => {
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(
          context.firestore().doc(`usersPublicData/${uid}`).set({
            createdAt: serverTimestamp(),
            creatorId: 1,
            displayName: 'テストユーザー',
            isActive: false,
            isCreator: 'notCreator',
            picture: '',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersPublicDataのデータ更新', () => {
      it('認証ありかつ本人であれば更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersPublicData/${uid}`).set(testData.getUsersPublicData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersPublicData/${uid}`).update({
            displayName: 'テストユーザー2',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('認証ありかつ本人でなければ更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersPublicData/${uid}`).set(testData.getUsersPublicData())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersPublicData/${uid}`).update({
            displayName: 'テストユーザー2',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('認証なしでの更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersPublicData/${uid}`).set(testData.getUsersPublicData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context.firestore().doc(`usersPublicData/${uid}`).update({
            displayName: 'テストユーザー2',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersPublicDataのスキーマ検証', () => {
      it('フィールドが7で型があっていれば成功', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context.firestore().doc(`usersPublicData/${v4()}`).set({
            createdAt: serverTimestamp(),
            creatorId: 1,
            displayName: 'テストユーザー',
            isActive: false,
            isCreator: 'notCreator',
            picture: '',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('displayNameには文字列しか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersPublicData/${v4()}`).set({
            createdAt: serverTimestamp(),
            creatorId: 1,
            displayName: 1234,
            isActive: false,
            isCreator: 'notCreator',
            picture: '',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersPublicDataのバリデーション', () => {
      it('displayNameは50文字までしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersPublicData/${v4()}`).set({
            createdAt: serverTimestamp(),
            creatorId: 1,
            displayName:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああ',
            isActive: false,
            isCreator: 'notCreator',
            picture: '',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('isCreatorにはnotCreator、all、storyOnly、drawingOnlyしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersPublicData/${v4()}`).set({
            createdAt: serverTimestamp(),
            creatorId: 1,
            displayName: 'テストユーザー',
            isActive: false,
            isCreator: 'test',
            picture: '',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })
  })

  describe('usersSecretDataへのアクセス', () => {
    const uid = 'testId'

    describe('usersSecretDataのデータ取得', () => {
      it('認証ありかつ本人であれば取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(context.firestore().doc(`usersSecretData/${uid}`).get())
      })

      it('認証なしであれば取得に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(context.firestore().doc(`usersSecretData/${uid}`).get())
      })

      it('認証ありでも本人でなければ取得に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(context.firestore().doc(`usersSecretData/${uid}`).get())
      })
    })

    describe('usersSecretDataのデータ作成', () => {
      it('認証なしで作成に成功', async () => {
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('Twitterで確認', async () => {
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: '',
            emailDomain: '',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'twitter.com',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersSecretDataのデータ更新', () => {
      it('認証ありかつ本人であれば更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}`).update({
            firstName: 'ユーザー',
            lastName: 'テスト',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('認証なしであれば更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).update({
            firstName: 'ユーザー',
            lastName: 'テスト',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('認証ありでも本人でなければ更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`usersSecretData/${uid}`).set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).update({
            firstName: 'ユーザー',
            lastName: 'テスト',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersSecretDataのスキーマ検証', () => {
      it('フィールドが13で型があっていれば成功', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('availableFreePointは数値しか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 'aa',
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('availablePaidPointは数値しか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 'bb',
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('receivedPointは数値しか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 'bb',
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: '0',
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('usersSecretDataのバリデーション', () => {
      it('emailは形式が違うと入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test',
            emailDomain: 'example.com',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('emailDomainは形式が違うと入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('firstNameは50文字までしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああ',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('languageはjaしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'en',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('lastNameは50文字までしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'ja',
            lastName:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああ',
            provider: 'password',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('providerはpassword、twitter.comしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'google',
            receivedPoint: 0,
            role: 'user',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('roleはguest、user、staff、adminしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'other',
            uid: 'testId',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('uidは一致するものしか入らない', async () => {
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}`).set({
            availableFreePoint: 0,
            availablePaidPoint: 0,
            createdAt: serverTimestamp(),
            email: 'test@example.com',
            emailDomain: 'example',
            firstName: '',
            language: 'ja',
            lastName: '',
            provider: 'password',
            receivedPoint: 0,
            role: 'other',
            uid: v4(),
            updatedAt: serverTimestamp(),
          })
        )
      })
    })
  })

  describe('usersSecretData/{uid}/favoriteWorksへのアクセス', () => {
    const uid = 'testId'
    const favoriteWorkId = v4()

    describe('favoriteWorksのデータ取得', () => {
      it('認証ありかつメール認証済みでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const favoriteWorksRef = context
            .firestore()
            .doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await favoriteWorksRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).get()
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const favoriteWorksRef = context
            .firestore()
            .doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await favoriteWorksRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).get()
        )
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const favoriteWorksRef = context
            .firestore()
            .doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
          await favoriteWorksRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).get()
        )
      })
    })

    describe('favoriteWorksのデータ作成', () => {
      it('認証ありかつメール認証済みでの作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).set({
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).set({
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).set({
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })
    })

    describe('favoriteWorksのデータ削除', () => {
      it('認証ありかつメール認証済みでの削除に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).delete()
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).delete()
        )
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).delete()
        )
      })
    })

    describe('favoriteWorksのスキーマ検証', () => {
      it('フィールドが3で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/favoriteWorks/${favoriteWorkId}`).set({
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })
    })
  })

  describe('usersSecretData/{uid}/likesへのアクセス', () => {
    const uid = 'testId'
    const likeId = v4()

    describe('likesのデータ取得', () => {
      it('認証ありかつメール認証済みでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).get()
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).get())
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).get()
        )
      })
    })

    describe('likesのデータ作成', () => {
      it('認証ありかつメール認証済みでの作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })
    })

    describe('likesのスキーマ検証', () => {
      it('フィールドが4で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`usersSecretData/${uid}/likes/${likeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            updatedAt: serverTimestamp(),
            workId: 1,
          })
        )
      })
    })
  })

  describe('workImagesへのアクセス', () => {
    const uid = 'testId'
    const workId = v4()
    const lang = 'ja'
    const episodeId = 1

    describe('workImagesのデータ取得', () => {
      it('認証ありかつメール認証済みでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid, { email_verified: true })
        await assertSucceeds(
          context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`).get()
        )
      })

      it('メールで登録した場合認証なしだと失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`).get()
        )
      })

      it('Twitterアカウントでの確認', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const likesRef = context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataTwitter())
          await likesRef.set(testData.getLikes())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`workImages/${workId}/${lang}/${episodeId}`).get()
        )
      })
    })

    describe('works/{lang}/data/images{episodeId}のデータ作成', () => {
      it('admin権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .set({
              createdAt: serverTimestamp(),
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('staff権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .set({
              createdAt: serverTimestamp(),
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('adminかstaff権限を持っていないユーザーは作成に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .set({
              createdAt: serverTimestamp(),
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('workImagesのデータ更新', () => {
      it('admin権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
          await workLangDataRef.set(testData.getLangImagesData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .update({
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F2.png?alt=media&token=cff8acc1-b1c4-484d-9fbd-09b51aff8167',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('staff権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
          await workLangDataRef.set(testData.getLangImagesData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .update({
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F2.png?alt=media&token=cff8acc1-b1c4-484d-9fbd-09b51aff8167',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('adminかstaff権限を持っていないユーザーは更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await workLangDataRef.set(testData.getLangImagesData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .update({
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F2.png?alt=media&token=cff8acc1-b1c4-484d-9fbd-09b51aff8167',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('works/{lang}/data/images{episodeId}のスキーマ検証', () => {
      it('フィールドが3で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .set({
              createdAt: serverTimestamp(),
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('works/{lang}/data/images{episodeId}のバリデーション', () => {
      it('imagesの要素は50以内', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context
            .firestore()
            .doc(`workImages/${workId}/${lang}/${episodeId}`)
            .set({
              createdAt: serverTimestamp(),
              images: [
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
                'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2F1%2F1.png?alt=media&token=93d33daf-c9c3-4cf2-ab62-0dad17a5076b',
              ],
              updatedAt: serverTimestamp(),
            })
        )
      })
    })
  })

  describe('worksへのアクセス', () => {
    const uid = 'testId'
    const workId = v4()

    describe('worksのデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc(`works/${workId}`).set(testData.getWorks())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(context.firestore().doc(`works/${workId}`).get())
      })
    })

    describe('worksのデータ作成', () => {
      it('admin権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
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
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })

      it('staff権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
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
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })

      it('adminかstaff権限を持っていないユーザーは作成に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
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
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })
    })

    describe('worksのデータ更新', () => {
      it('認証ありだと更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const worksRef = context.firestore().doc(`works/${workId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
          await worksRef.set(testData.getWorks())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}`).update({
            favorite: 1,
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('worksのスキーマ検証', () => {
      it('フィールドが15で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
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
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })
    })

    describe('worksのバリデーション', () => {
      it('languageはjaが入っていないといけない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
              creatorAllId: 1,
              creatorDrawingId: 0,
              creatorStoryId: 0,
              episodeCount: 1,
              episodeSerialNumber: 1,
              favorite: 0,
              language: ['test'],
              official: true,
              popular: 0,
              release: true,
              searchCreatorId: [1, 0, 0],
              totalLike: 0,
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })

      it('searchCreatorIdは要素が3つでないといけない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context
            .firestore()
            .doc(`works/${v4()}`)
            .set({
              createdAt: serverTimestamp(),
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
              searchCreatorId: [1, 0, 0, 0],
              totalLike: 0,
              updatedAt: serverTimestamp(),
              workId: 1,
            })
        )
      })
    })
  })

  describe('works/{lang}/dataへのアクセス', () => {
    const uid = 'testId'
    const workId = v4()
    const lang = 'ja'

    describe('works/{lang}/dataのデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context
            .firestore()
            .doc(`works/${workId}/${lang}/data`)
            .set(testData.getWorksLangData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(context.firestore().doc(`works/${workId}/${lang}/data`).get())
      })
    })

    describe('works/{lang}/dataのデータ作成', () => {
      it('admin権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle: 'リアル・マーメイド',
          })
        )
      })

      it('staff権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle: 'リアル・マーメイド',
          })
        )
      })

      it('adminかstaff権限を持っていないユーザーは作成に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle: 'リアル・マーメイド',
          })
        )
      })
    })

    describe('works/{lang}/dataのデータ更新', () => {
      it('admin権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context.firestore().doc(`works/${workId}/${lang}/data`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
          await workLangDataRef.set(testData.getWorksLangData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data`).update({
            genre: 'ギャグ',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('staff権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context.firestore().doc(`works/${workId}/${lang}/data`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
          await workLangDataRef.set(testData.getWorksLangData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data`).update({
            genre: 'ギャグ',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('adminかstaff権限を持っていないユーザーは更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context.firestore().doc(`works/${workId}/${lang}/data`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await workLangDataRef.set(testData.getWorksLangData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data`).update({
            genre: 'ギャグ',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('works/{lang}/dataのスキーマ検証', () => {
      it('フィールドが6で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle: 'リアル・マーメイド',
          })
        )
      })
    })

    describe('works/{lang}/dataのバリデーション', () => {
      it('genreはジャンル外の文字は入れられない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: 'test',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle: 'リアル・マーメイド',
          })
        )
      })

      it('workDescriptionは250文字以内', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ',
            workTitle: 'リアル・マーメイド',
          })
        )
      })

      it('workTitleは50文字以内', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data`).set({
            createdAt: serverTimestamp(),
            genre: '恋愛',
            thumbnail:
              'https://firebasestorage.googleapis.com/v0/b/pixage-app-development.appspot.com/o/works%2FANM0nOn273XmSezBHBQH%2Fthumbnail.png?alt=media&token=27a6bfdf-51ee-446d-bc62-b7d9e96f2382',
            updatedAt: serverTimestamp(),
            workDescription:
              '第一回Pixage大賞佳作受賞作。病弱な夏姫は部屋に篭りっきりの毎日。残りわずかな命の中、唯一の楽しみは好きな歌を歌うこと。窓から見える海と男の子を思って。そんな中叔父から貝殻を貰う。それは人魚姫の聖地で拾った貝殻で‥ー。',
            workTitle:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああ',
          })
        )
      })
    })
  })

  describe('works/{lang}/data/episode/{episodeId}へのアクセス', () => {
    const uid = 'testId'
    const workId = v4()
    const lang = 'ja'
    const episodeId = 1

    describe('works/{lang}/data/episode/{episodeId}のデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context
            .firestore()
            .doc(`works/${workId}/${lang}/data/episode/${episodeId}`)
            .set(testData.getLangEpisodeData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).get()
        )
      })
    })

    describe('works/{lang}/data/episode/{episodeId}のデータ作成', () => {
      it('admin権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: '第一話',
            episodeTitle: '',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('staff権限を持ったユーザーは作成に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: '第一話',
            episodeTitle: '',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('adminかstaff権限を持っていないユーザーは作成に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: '第一話',
            episodeTitle: '',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('works/{lang}/data/episode/{episodeId}のデータ更新', () => {
      it('admin権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`works/${workId}/${lang}/data/episode/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
          await workLangDataRef.set(testData.getLangEpisodeData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).update({
            episodeNum: '第二話',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('staff権限を持ったユーザーは更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`works/${workId}/${lang}/data/episode/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataStaff())
          await workLangDataRef.set(testData.getLangEpisodeData())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).update({
            episodeNum: '第二話',
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('adminかstaff権限を持っていないユーザーは更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          const workLangDataRef = context
            .firestore()
            .doc(`works/${workId}/${lang}/data/episode/${episodeId}`)
          await usersSecretDataRef.set(testData.getUsersSecretData())
          await workLangDataRef.set(testData.getLangEpisodeData())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).update({
            episodeNum: '第二話',
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('works/{lang}/data/episode/{episodeId}のスキーマ検証', () => {
      it('フィールドが7で型があっていれば成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertSucceeds(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: '第一話',
            episodeTitle: '',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })
    })

    describe('works/{lang}/data/episode/{episodeId}のバリデーション', () => {
      it('episodeNumは20文字以内', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: 'あああああああああああああああああああああ',
            episodeTitle: '',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })

      it('episodeTitleは50文字以内', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const usersSecretDataRef = context.firestore().doc(`usersSecretData/${uid}`)
          await usersSecretDataRef.set(testData.getUsersSecretDataAdmin())
        })
        const context = testEnv.authenticatedContext(uid)
        await assertFails(
          context.firestore().doc(`works/${workId}/${lang}/data/episode/${episodeId}`).set({
            createdAt: serverTimestamp(),
            episodeId: 1,
            episodeNum: '第一話',
            episodeTitle:
              'あああああああああああああああああああああああああああああああああああああああああああああああああああ',
            like: 0,
            release: true,
            updatedAt: serverTimestamp(),
          })
        )
      })
    })
  })

  describe('worksCountへのアクセス', () => {
    describe('worksCountのデータ取得', () => {
      it('認証なしでの取得に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.unauthenticatedContext()
        await assertSucceeds(context.firestore().doc('worksCount/global').get())
      })
    })

    describe('worksCountのデータ更新', () => {
      it('認証ありでの更新に成功', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('認証なしでの更新に失敗', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.unauthenticatedContext()
        await assertFails(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('worksCountのスキーマ検証', () => {
      it('countとserialNumberにはnumber型が入る', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertSucceeds(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('countにはnumber型以外は入らない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: 'hoge',
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('serialNumberにはnumber型以外は入らない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: 'hoge',
              updatedAt: serverTimestamp(),
            })
        )
      })
    })

    describe('worksCountのバリデーション', () => {
      it('countは0未満にならない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(-1),
              serialNumber: firebase.firestore.FieldValue.increment(1),
              updatedAt: serverTimestamp(),
            })
        )
      })

      it('serialNumberは0未満にならない', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await context.firestore().doc('worksCount/global').set(testData.getWorksCount())
        })
        const context = testEnv.authenticatedContext(v4())
        await assertFails(
          context
            .firestore()
            .doc('worksCount/global')
            .update({
              count: firebase.firestore.FieldValue.increment(1),
              serialNumber: firebase.firestore.FieldValue.increment(-1),
              updatedAt: serverTimestamp(),
            })
        )
      })
    })
  })
})
