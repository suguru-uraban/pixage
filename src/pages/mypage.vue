<template>
  <article class="mypage">
    <Loading v-if="state.processing.value" page-type="normal" />
    <h2 class="mypage__title">{{ $t('myPage.title') }}</h2>
    <div class="mypage__wrap">
      <div class="mypage__imageWrap">
        <div class="mypage__image">
          <img
            :src="
              state.picture.value === ''
                ? require('@/assets/images/icon_default_picture.svg')
                : state.picture.value.replace('_normal', '')
            "
            :alt="state.displayName.value"
            @error="onError"
          />
          <button
            v-if="isVerified()"
            :class="['mypage__editButton', 'imagePosition']"
            @click="handleOpenModal('pictureEdit')"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
        </div>
      </div>
      <div class="mypage__userWrap">
        <div class="mypage__displayNameArea">
          <p class="mypage__displayName">{{ state.displayName.value }}</p>
          <button
            v-if="isVerified()"
            class="mypage__editButton"
            @click="handleOpenModal('displayNameEdit')"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
        </div>
        <ul class="mypage__userDataList">
          <li class="mypage__userProvider">
            <img
              :src="
                state.provider.value === 'twitter.com'
                  ? require('@/assets/images/logo_twitter.svg')
                  : require('@/assets/images/icon_mail.svg')
              "
            />{{ $t('myPage.provider') }}
          </li>
          <li class="mypage__userProvider">
            {{ viewIsCreator(state) }}
          </li>
        </ul>
        <!--
        <div class="mypage__userDataWrapCoin">
          <dl class="mypage__userData">
            <dt class="mypage__userDataTitle">{{ $t('myPage.point') }}</dt>
            <dd class="mypage__userDataContentCoin">{{ state.availablePaidPoint.value }}</dd>
          </dl>
          <div v-if="isVerified()" class="mypage__userDataButton">
            <button class="mypage__editButton">
              <font-awesome-icon :icon="['fas', 'coins']" />
            </button>
          </div>
        </div>
        -->
        <p class="mypage__editDataTitle">{{ $t('myPage.editTitle') }}</p>
        <div class="mypage__editDataWrap">
          <div class="mypage__userDataWrap">
            <dl class="mypage__userData">
              <dt class="mypage__userDataTitle">{{ $t('myPage.name') }}</dt>
              <dd class="mypage__userDataContent">{{ viewRealName(state) }}</dd>
            </dl>
            <div v-if="isVerified()" class="mypage__userDataButton">
              <button class="mypage__editButton" @click="handleOpenModal('nameEdit')">
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
            </div>
          </div>
          <div class="mypage__userDataWrap">
            <dl class="mypage__userData">
              <dt class="mypage__userDataTitle">{{ $t('myPage.email') }}</dt>
              <dd class="mypage__userDataContent">{{ viewEmail }}</dd>
            </dl>
            <div v-if="isVerified()" class="mypage__userDataButton">
              <button class="mypage__editButton" @click="handleOpenModal('emailEdit')">
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
            </div>
          </div>
          <div v-if="!isVerified()" class="mypage__verifyLink" @click="sendVerifyEmail(state)">
            <p>{{ $t('myPage.verify') }}<br />{{ $t('myPage.reLogin') }}</p>
          </div>
        </div>
      </div>
    </div>
    <CreatorSpace />
    <PictureEditModal />
    <DisplayNameEditModal />
    <NameEditModal />
    <EmailEditModal />
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore } from '@/compositions/guard'
import { EditMyPageKey } from '@/compositions/key/editMyPageKey'
import { EditMyPageStore } from '@/compositions/editMyPage'
import CreatorSpace from '@/components/CreatorSpace.vue'
import PictureEditModal from '@/components/modals/mypage/PictureEditModal.vue'
import DisplayNameEditModal from '@/components/modals/mypage/DisplayNameEditModal.vue'
import NameEditModal from '@/components/modals/mypage/NameEditModal.vue'
import EmailEditModal from '@/components/modals/mypage/EmailEditModal.vue'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    CreatorSpace,
    PictureEditModal,
    DisplayNameEditModal,
    NameEditModal,
    EmailEditModal,
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const { title, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const state = injectGlobalState()
    const { isVerified } = inject(AccountKey) as AccountStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const { notLoginGuard } = inject(GuardKey) as GuardStore
    const { initVariables, viewRealName, viewIsCreator, sendVerifyEmail } = inject(
      EditMyPageKey
    ) as EditMyPageStore
    /** /Inject **/

    /** Computed **/
    const viewEmail = computed(() => {
      if (state.email.value) {
        return `${state.email.value}`
      }
      return app.i18n.t('myPage.notSet')
    })
    /** /Computed **/

    /** Created **/
    // ログインしていない場合ログイン画面に遷移
    notLoginGuard()

    // 値初期化の呼び出し
    initVariables()
    /** /Created **/

    /** Function **/
    // Twitterから画像を取得できなかった場合の代替画像表示
    const onError = (event: { target: { src: string } }) => {
      event.target.src = require('@/assets/images/icon_error_picture.svg')
    }
    /** /Function **/

    /** Meta **/
    title.value = app.i18n.t('myPage.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'マイページ | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/mypage' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      state,
      isVerified,
      handleOpenModal,
      viewRealName,
      viewIsCreator,
      sendVerifyEmail,
      viewEmail,
      onError,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.mypage {
  margin: auto;
  &__title {
    padding: 8px;
    font-size: 2rem;
    font-weight: bold;
    border-bottom: $border-color-gray solid 1px;
  }
  &__wrap {
    width: 100%;
  }
  &__imageWrap {
    width: 126px;
    text-align: center;
  }
  &__image {
    margin-bottom: 16px;
    padding: 2px;
    width: 126px;
    height: 126px;
    position: relative;
    border: $border-color-gray solid 1px;
    > img {
      width: 120px;
      height: auto;
    }
  }
  &__editButton {
    color: $font-color-darkgray;
    text-align: center;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &.imagePosition {
      position: absolute;
    }
  }
  &__displayNameArea {
    margin-bottom: 8px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }
  &__userDataList {
    margin: 0 0 16px 8px;
  }
  &__userProvider {
    font-size: 1.6rem;
    color: $font-color-white;
    img {
      margin-right: 8px;
      width: auto;
      height: 16px;
    }
  }
  &__editDataTitle {
    padding: 8px;
    font-size: 1.6rem;
    font-weight: bold;
    background: $myPage-color-opacity;
  }
  &__editDataWrap {
    padding: 16px 0 8px 16px;
    border-left: $myPage-color-opacity solid 3px;
  }
  &__userDataWrap {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  &__userDataWrapCoin {
    margin: 0 0 24px 8px;
    display: flex;
    align-items: center;
  }
  &__displayName {
    margin-right: 8px;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.4;
  }
  &__userDataContent {
    word-break: break-all;
  }
  &__userDataContentCoin {
    font-size: 1.8rem;
    font-weight: bold;
  }
  &__verifyLink {
    margin-bottom: 16px;
    padding: 8px 24px 8px 8px;
    line-height: 1.4;
    border-radius: 8px;
    text-decoration: underline;
    position: relative;
    cursor: pointer;
    background: $background-color-red;
    &:after {
      margin: auto;
      width: 12px;
      height: 12px;
      content: '';
      border-top: $border-color-white solid 4px;
      border-right: $border-color-white solid 4px;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      transform: rotate(45deg);
    }
  }
  &__creatorArea {
    padding: 24px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $myPage-color-opacity;
  }
  &__creatorTitle {
    margin-bottom: 16px;
    font-size: 1.6rem;
    color: $font-color-gray;
  }
  &__creatorContent {
    color: $font-color-gray;
  }
}
.pc {
  .mypage {
    width: 800px;
    &__title {
      margin-bottom: 8px;
    }
    &__wrap {
      display: flex;
    }
    &__imageWrap {
      margin-right: 24px;
    }
    &__editButton {
      width: 32px;
      height: 32px;
      font-size: 1.6rem;
      border-radius: 16px;
      &.imagePosition {
        right: -16px;
        bottom: -16px;
      }
      &:hover {
        opacity: 0.6;
      }
    }
    &__userWrap {
      flex: 1;
    }
    &__displayName {
      max-width: calc(100% - 40px);
    }
    &__userDataList {
      display: flex;
      li {
        &:after {
          margin: 0 8px;
          content: '/';
        }
        &:nth-last-child(1):after {
          margin: 0;
          content: none;
        }
      }
    }
    &__userDataWrap {
      max-width: calc(100% - 40px);
    }
    &__userData {
      height: 32px;
      display: flex;
      align-items: center;
    }
    &__userDataTitle {
      font-size: 1.6rem;
      text-align: right;
      &:after {
        margin-left: 2px;
        content: ':';
      }
    }
    &__userDataContent {
      margin-left: 4px;
      font-size: 1.6rem;
    }
    &__userDataContentCoin {
      margin-left: 8px;
    }
    &__userDataContent {
      margin-left: 4px;
      font-size: 1.6rem;
    }
    &__userDataButton {
      margin-left: 8px;
    }
    &__verifyLink {
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .mypage {
    width: 100%;
    &__title {
      margin: 0 8px 16px;
    }
    &__wrap {
      display: block;
    }
    &__imageWrap {
      margin: 0 auto 32px;
    }
    &__editButton {
      width: 40px;
      height: 40px;
      font-size: 1.6rem;
      border-radius: 20px;
      &.imagePosition {
        right: -20px;
        bottom: -20px;
      }
      &:active {
        opacity: 0.6;
      }
    }
    &__userWrap {
      margin: 0 16px;
    }
    &__displayName {
      max-width: calc(100% - 48px);
    }
    &__userDataList {
      li {
        margin-bottom: 4px;
        font-size: 1.4rem;
      }
    }
    &__userDataWrap {
      max-width: calc(100% - 48px);
    }
    &__userDataTitle {
      margin-bottom: 4px;
    }
    &__userDataButton {
      margin-left: 8px;
      width: 40px;
    }
    &__verifyLink {
      &:active {
        text-decoration: none;
      }
    }
    &__creatorArea {
      width: calc(100% - 32px);
      margin: 0 16px;
    }
  }
}
</style>
