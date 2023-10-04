<template>
  <div>
    <Breadcrumb :breadcrumbs="adminListUsers()" />
    <div class="adminListUsers">
      <h1 class="adminListUsers__title">ユーザー一覧</h1>
      <div class="adminListUsers__selectArea">
        <div class="adminListUsers__select limit">
          <span>表示件数</span>
          <select v-model="currentLimit" @change="changeLimit()">
            <option :value="50">50件</option>
            <option :value="100">100件</option>
            <option :value="250">250件</option>
          </select>
        </div>
        <div class="adminListUsers__select direction">
          <span>並び順</span>
          <select v-model="currentDirection" @change="changeDirection()">
            <option value="desc">登録の新しい順</option>
            <option value="asc">登録の古い順</option>
          </select>
        </div>
      </div>
      <p v-if="!users.length">ユーザーは存在しません。</p>
      <div v-if="!!users.length">
        <ul class="adminListUsers__header">
          <li class="adminListUsers__headerTitle" data-style="picture" />
          <li class="adminListUsers__headerTitle" data-style="displayName">表示名</li>
          <li class="adminListUsers__headerTitle" data-style="provider">プロバイダー</li>
          <li class="adminListUsers__headerTitle" data-style="email">メールアドレス</li>
          <li class="adminListUsers__headerTitle" data-style="name">氏名</li>
          <li class="adminListUsers__headerTitle" data-style="creatorTypes">クリエイターの種別</li>
          <li class="adminListUsers__headerTitle" data-style="activeCheck">コミッション活動状況</li>
          <li class="adminListUsers__headerTitle" data-style="button" />
        </ul>
        <ul class="adminListUsers__list">
          <li v-for="user in users" :key="user.uid" class="adminListUsers__listBlock">
            <div class="adminListUsers__listPicture">
              <img
                :src="
                  user.picture
                    ? user.picture.replace('_normal', '')
                    : require('@/assets/images/icon_default_picture.svg')
                "
                alt=""
              />
            </div>
            <div class="adminListUsers__listDisplayName">{{ user.displayName }}</div>
            <div class="adminListUsers__listProvider">
              <img
                :src="
                  user.provider === 'twitter.com'
                    ? require('@/assets/images/logo_twitter.svg')
                    : require('@/assets/images/icon_mail_black.svg')
                "
              />
            </div>
            <div class="adminListUsers__listEmail">{{ user.email }}</div>
            <div class="adminListUsers__listName">{{ user.lastName }} {{ user.firstName }}</div>
            <div
              :class="[
                'adminListUsers__listCreatorTypes',
                { isCreator: user.isCreator !== 'notCreator' },
              ]"
            >
              {{ user.isCreator === 'notCreator' ? '一般ユーザー' : '' }}
              {{ user.isCreator === 'all' ? '全作業可' : '' }}
              {{ user.isCreator === 'storyOnly' ? '原作のみ' : '' }}
              {{ user.isCreator === 'drawingOnly' ? '作画のみ' : '' }}
              {{ user.isCreator === 'commissionOnly' ? 'コミッションのみ' : '' }}
            </div>
            <div :class="['adminListUsers__listActiveCheck', { isActive: user.isActive }]">
              {{ user.isActive ? '活動中' : '活動休止中' }}
            </div>
            <div class="adminListUsers__buttonWrap">
              <button class="adminListUsers__inputButton" @click="handleOpenUserEdit(user.uid)">
                <font-awesome-icon :icon="['fas', 'edit']" />編集
              </button>
              <button
                class="adminListUsers__inputButton"
                :disabled="user.role === 'admin' || user.role === 'staff'"
                @click="
                  handleOpenUserDelete(
                    user.uid,
                    user.picture,
                    user.displayName,
                    user.provider,
                    user.email,
                    user.firstName,
                    user.lastName,
                    user.isCreator,
                    user.isActive
                  )
                "
              >
                <font-awesome-icon :icon="['fas', 'trash']" />削除
              </button>
            </div>
          </li>
        </ul>
        <ul class="adminListUsers__pages">
          <li
            v-for="page in pages"
            :key="page"
            :class="['adminListUsers__page', { current: page === currentPage }]"
            @click="pageTransition(page)"
          >
            {{ page + 1 }}
          </li>
        </ul>
      </div>
    </div>
    <AddAndEditCreatorModal user-type="admin" :uid="userUid" @reload="reload" />
    <DeleteUserModal
      :uid="userUid"
      :pic="picture"
      :name="displayName"
      :prov="provider"
      :mail="email"
      :fname="firstName"
      :lname="lastName"
      :creator="isCreator"
      :active="isActive"
      @reload="reload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta, inject, watch, useRoute } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { UsersKey } from '@/compositions/key/usersKey'
import { UsersStore } from '@/compositions/users'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import AddAndEditCreatorModal from '@/components/modals/addAndEditCreator/AddAndEditCreatorModal.vue'
import DeleteUserModal from '@/components/modals/deleteUser/DeleteUserModal.vue'
import { CreatorType } from '@/types/creatorType'

export default defineComponent({
  components: {
    Breadcrumb,
    AddAndEditCreatorModal,
    DeleteUserModal,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminListUsers } = inject(BreadcrumbKey) as BreadcrumbStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      userUid,
      picture,
      displayName,
      provider,
      email,
      firstName,
      lastName,
      isCreator,
      isActive,
      users,
      currentLimit,
      currentDirection,
      currentPage,
      pages,
      initUsers,
      pageTransition,
      changeLimit,
      changeDirection,
    } = inject(UsersKey) as UsersStore
    /** /Inject **/

    /** Created **/
    // ユーザーの初期読み込み関数の呼び出し
    initUsers()
    /** /Created **/

    /** Function **/
    // ユーザー編集のモーダルを開く
    const handleOpenUserEdit = (uid: string) => {
      userUid.value = uid
      handleOpenModal('addAndEditCreator')
    }

    // ユーザー削除のモーダルを開く
    const handleOpenUserDelete = (
      uid: string,
      pic: string,
      name: string,
      prov: string,
      mail: string,
      fname: string,
      lname: string,
      creator: CreatorType,
      active: boolean
    ) => {
      userUid.value = uid
      picture.value = pic
      displayName.value = name
      provider.value = prov
      email.value = mail
      firstName.value = fname
      lastName.value = lname
      isCreator.value = creator
      isActive.value = active
      handleOpenModal('deleteUser')
    }

    // ユーザー編集を保存したらリストをリロードする
    const reload = () => {
      initUsers()
    }
    /** /Function **/

    /** Watch **/
    // routeを監視して、変化があればinitUsersが発火
    watch(route, () => {
      initUsers()
    })
    /** /Watch **/

    /** Meta **/
    title.value = 'ユーザー一覧'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminListUsers,
      userUid,
      picture,
      displayName,
      provider,
      email,
      firstName,
      lastName,
      isCreator,
      isActive,
      users,
      currentLimit,
      currentDirection,
      currentPage,
      pages,
      pageTransition,
      changeLimit,
      changeDirection,
      handleOpenUserEdit,
      handleOpenUserDelete,
      reload,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.adminListUsers {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__header {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__selectArea {
    margin-bottom: 8px;
    display: flex;
  }
  &__select {
    margin-right: 16px;
    position: relative;
    display: flex;
    align-items: center;
    &.limit {
      width: 150px;
      span {
        width: 110px;
      }
    }
    &.direction {
      width: 200px;
      span {
        width: 60px;
      }
    }
    &:after {
      margin: auto;
      width: 0;
      height: 0;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      border-style: solid;
      border-width: 10px 8px 0 8px;
      border-color: $border-color-gray transparent transparent transparent;
      pointer-events: none;
    }
    select {
      margin-left: 4px;
      padding: 8px 4px;
      width: 100%;
      font-size: 1.6rem;
      color: $font-color-darkgray;
      border-radius: 4px;
      border: $border-color-gray solid 1px;
      background: $background-color-white;
    }
    span {
      display: inline-block;
    }
  }
  &__headerTitle {
    padding: 8px 0;
    font-size: 1.2rem;
    font-weight: bold;
    &[data-style='picture'] {
      width: 70px;
    }
    &[data-style='displayName'] {
      flex: 1;
    }
    &[data-style='provider'] {
      width: 80px;
    }
    &[data-style='email'] {
      width: 240px;
    }
    &[data-style='name'] {
      width: 100px;
    }
    &[data-style='creatorTypes'] {
      width: 140px;
    }
    &[data-style='activeCheck'] {
      width: 140px;
    }
    &[data-style='button'] {
      width: 160px;
    }
  }
  &__list {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
  }
  &__listBlock {
    width: 100%;
    min-height: 33px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    border-bottom: $border-color-lightgray dotted 1px;
  }
  &__listPicture {
    padding: 8px 0;
    width: 70px;
    > img {
      width: 40px;
      height: 40px;
    }
  }
  &__listDisplayName {
    padding: 8px 0;
    flex: 1;
  }
  &__listProvider {
    padding: 8px 0;
    width: 80px;
    > img {
      width: 30px;
      height: auto;
      position: relative;
      left: 15px;
    }
  }
  &__listEmail {
    padding: 8px 8px 8px 0;
    width: 240px;
    word-wrap: break-word;
  }
  &__listName {
    padding: 8px 8px 8px 0;
    width: 100px;
    word-wrap: break-word;
  }
  &__listCreatorTypes {
    padding: 8px 0;
    width: 140px;
    color: $font-color-lightgray;
    &.isCreator {
      color: $font-color-black;
      font-weight: bold;
    }
  }
  &__listActiveCheck {
    padding: 8px 0;
    width: 140px;
    color: $font-color-lightgray;
    &.isActive {
      color: $font-color-black;
      font-weight: bold;
    }
  }
  &__buttonWrap {
    padding: 8px 0;
    width: 160px;
    display: flex;
    justify-content: space-around;
  }
  &__inputButton {
    padding: 0 8px;
    width: 72px;
    height: 40px;
    font-size: 1.2rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
    &:disabled {
      opacity: 0.4;
    }
    svg {
      margin-right: 2px;
    }
    span {
      font-size: 1rem;
      letter-spacing: -1px;
    }
  }
  &__pages {
    padding: 16px 0;
    display: flex;
    justify-content: center;
  }
  &__page {
    margin: 0 4px;
    width: 40px;
    height: 40px;
    line-height: 38px;
    text-align: center;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    cursor: pointer;
    &.current {
      background: $background-color-lightgray-opacity;
      &:hover {
        opacity: 1;
        cursor: not-allowed;
      }
    }
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
