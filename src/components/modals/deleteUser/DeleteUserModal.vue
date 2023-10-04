<template>
  <transition name="fade">
    <Modal v-if="modalType === 'deleteUser'">
      <div class="deleteUserModal">
        <p class="deleteUserModal__title">ユーザー『{{ name }}』を削除する</p>
        <p class="deleteUserModal__caption">
          以下のユーザーを削除します。よろしければ下のボタンを押してください。
        </p>
        <div class="deleteUserModal__attention">
          <ul class="deleteUserModal__attentionList">
            <li class="deleteUserModal__attentionListParts">
              クリエイター種別が「原作のみ」「作画のみ」のクリエイターの場合、作品も消えて問題ないのかもう一方の作者に必ず確認してください。
            </li>
            <li class="deleteUserModal__attentionListParts">
              コミッション活動をしているクリエイターの場合、現在稼働中の作業はないか確認してください。
            </li>
          </ul>
        </div>
        <div class="deleteUserModal__userData">
          <div class="deleteUserModal__userDataLeft">
            <div class="deleteUserModal__userDataPicture">
              <img
                :src="
                  pic
                    ? pic.replace('_normal', '')
                    : require('@/assets/images/icon_default_picture.svg')
                "
                alt=""
              />
            </div>
          </div>
          <dl class="deleteUserModal__userDataRight">
            <dt class="deleteUserModal__userDataDisplayName">{{ name }}</dt>
            <dd class="deleteUserModal__userDataParts">
              {{ prov === 'twitter.com' ? 'Twitterでログイン' : 'メールアドレスでログイン' }}
            </dd>
            <dd class="deleteUserModal__userDataParts">
              {{ mail !== '' ? mail : 'メールアドレス記載なし' }}
            </dd>
            <dd class="deleteUserModal__userDataParts">
              {{ fname !== '' && lname !== '' ? `${fname} ${lname}` : '本名記載なし' }}
            </dd>
            <dd class="deleteUserModal__userDataParts">
              {{ creator === 'notCreator' ? '一般ユーザー' : '' }}
              {{ creator === 'all' ? '全作業可' : '' }}
              {{ creator === 'storyOnly' ? '原作のみ' : '' }}
              {{ creator === 'drawingOnly' ? '作画のみ' : '' }}
              {{ creator === 'commissionOnly' ? 'コミッション活動のみ' : '' }}
            </dd>
            <dd class="deleteUserModal__userDataParts">
              {{ active ? 'コミッション活動中' : 'コミッション活動休止中' }}
            </dd>
          </dl>
        </div>
        <div class="deleteUserModal__inputButtonArea">
          <button class="deleteUserModal__inputButton" @click="clickDeleteUser">削除する</button>
        </div>
        <div class="deleteUserModal__inputButtonArea">
          <p class="deleteUserModal__cancelLink" @click="handleOpenModal('noModal')">キャンセル</p>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { UsersKey } from '@/compositions/key/usersKey'
import { UsersStore } from '@/compositions/users'
import { DeleteUserKey } from '@/compositions/key/deleteUserKey'
import { DeleteUserStore } from '@/compositions/deleteUser'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    uid: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    prov: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, _) {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { initUsers } = inject(UsersKey) as UsersStore
    const { deleteUser } = inject(DeleteUserKey) as DeleteUserStore
    /** /Inject **/

    /** Created **/
    // 値を初期化

    /** /Created **/

    /** Function **/
    // クリックして削除を確定する
    const clickDeleteUser = async () => {
      await deleteUser(props.uid)
      initUsers()
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      clickDeleteUser,
    }
  },
})
</script>

<style lang="scss" scoped>
.deleteUserModal {
  width: 600px;
  position: relative;
  &__title {
    margin-bottom: 16px;
    color: $font-color-white;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__caption {
    margin-top: 16px;
    padding: 0 8px;
    color: $font-color-white;
  }
  &__attention {
    margin-top: 16px;
    padding: 16px;
    border: $border-color-red solid 2px;
    background: $background-color-white;
  }
  &__attentionList {
    padding-left: 1.4rem;
  }
  &__attentionListParts {
    margin-bottom: 4px;
    padding-left: 1.4rem;
    font-size: 1.4rem;
    color: $font-color-carmine;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
  &__userData {
    margin: 16px auto 0;
    width: 480px;
    display: flex;
  }
  &__userDataLeft {
    width: 80px;
  }
  &__userDataRight {
    padding-left: 16px;
    width: 400px;
  }
  &__userDataPicture {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: auto;
    }
  }
  &__userDataDisplayName {
    margin-bottom: 8px;
    font-size: 1.6rem;
    color: $font-color-white;
    font-weight: bold;
  }
  &__userDataParts {
    margin: 0 0 8px 8px;
    color: $font-color-white;
  }
  &__inputButtonArea {
    padding-top: 32px;
    text-align: center;
  }
  &__inputButton {
    padding: 0 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
  &__cancelLink {
    color: $font-color-white;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
