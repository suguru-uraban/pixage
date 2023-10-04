<template>
  <transition name="fade">
    <Modal v-if="modalType === 'addAndEditCreator' && !processing">
      <div class="addAndEditCreatorModal">
        <p class="addAndEditCreatorModal__title">
          {{ userType === 'admin' ? 'クリエイター追加・編集' : $t('addAndEditCreator.title') }}
        </p>
        <p class="addAndEditCreatorModal__caption">
          {{
            userType === 'admin'
              ? 'クリエイター区分は、一度設定すると元に戻せないパターンがあるのでご注意ください。'
              : $t('addAndEditCreator.caption1')
          }}
        </p>
        <ul class="addAndEditCreatorModal__attentionList">
          <li class="addAndEditCreatorModal__attentionListParts">
            {{
              userType === 'admin'
                ? '「全作業可」を選択すると「原作のみ」「作画のみ」「コミッション活動のみ」を選択することはできません。'
                : $t('addAndEditCreator.attention1')
            }}
          </li>
          <li class="addAndEditCreatorModal__attentionListParts">
            {{
              userType === 'admin'
                ? '「原作のみ」を選択すると「作画のみ」「コミッション活動のみ」を選択することはできません。'
                : $t('addAndEditCreator.attention2')
            }}
          </li>
          <li class="addAndEditCreatorModal__attentionListParts">
            {{
              userType === 'admin'
                ? '「作画のみ」を選択すると「原作のみ」「コミッション活動のみ」を選択することはできません。'
                : $t('addAndEditCreator.attention3')
            }}
          </li>
          <li class="addAndEditCreatorModal__attentionListParts">
            {{
              userType === 'admin'
                ? 'どれを選んでもコミッション活動は可能で、「全作業可」を選んでも原作のみの活動、作画のみの活動もできますのでご安心ください。'
                : $t('addAndEditCreator.attention4')
            }}
          </li>
        </ul>
        <p class="addAndEditCreatorModal__caption">
          {{
            userType === 'admin'
              ? '必ずクリエイターガイドラインを読んでから操作してください。'
              : $t('addAndEditCreator.caption2')
          }}
        </p>
        <p class="addAndEditCreatorModal__selectFormTitle">
          {{
            userType === 'admin' ? 'クリエイターの区分を選択' : $t('addAndEditCreator.subTitle1')
          }}
        </p>
        <div class="addAndEditCreatorModal__selectFormArea">
          <p class="addAndEditCreatorModal__selectFormCaption">
            {{
              userType === 'admin'
                ? 'コミッション活動のみの方はこちらを選択してください。'
                : $t('addAndEditCreator.caption5')
            }}
          </p>
          <ul class="addAndEditCreatorModal__selectFormWrap">
            <li
              v-for="CREATOR_COMMISSION_TYPE in CREATOR_COMMISSION_TYPES"
              :key="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
              class="addAndEditCreatorModal__selectForm commission"
            >
              <input
                :id="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
                type="radio"
                :name="`creatorTypes_${uid}`"
                :value="CREATOR_COMMISSION_TYPE.type"
                :checked="creatorType === CREATOR_COMMISSION_TYPE.type"
                :disabled="disableChangeCreator(CREATOR_COMMISSION_TYPE.type)"
                @change="handleChangeCreatorType(CREATOR_COMMISSION_TYPE.type)"
              /><label
                :for="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
                :class="[{ isDisabled: disableChangeCreator(CREATOR_COMMISSION_TYPE.type) }]"
                >{{
                  userType === 'admin'
                    ? CREATOR_COMMISSION_TYPE.display
                    : $t(CREATOR_COMMISSION_TYPE.displayTranslation)
                }}</label
              >
            </li>
          </ul>
        </div>
        <div class="addAndEditCreatorModal__selectFormArea">
          <p class="addAndEditCreatorModal__selectFormCaption">
            {{
              userType === 'admin'
                ? 'レンタル販売も利用する方はこちらのいずれかを選択してください。'
                : $t('addAndEditCreator.caption6')
            }}
          </p>
          <ul class="addAndEditCreatorModal__selectFormWrap">
            <li
              v-for="CREATOR_TYPE in CREATOR_TYPES"
              :key="`${uid}_${CREATOR_TYPE.type}`"
              class="addAndEditCreatorModal__selectForm"
            >
              <input
                :id="`${uid}_${CREATOR_TYPE.type}`"
                type="radio"
                :name="`creatorTypes_${uid}`"
                :value="CREATOR_TYPE.type"
                :checked="creatorType === CREATOR_TYPE.type"
                :disabled="disableChangeCreator(CREATOR_TYPE.type)"
                @change="handleChangeCreatorType(CREATOR_TYPE.type)"
              /><label
                :for="`${uid}_${CREATOR_TYPE.type}`"
                :class="[{ isDisabled: disableChangeCreator(CREATOR_TYPE.type) }]"
                >{{
                  userType === 'admin' ? CREATOR_TYPE.display : $t(CREATOR_TYPE.displayTranslation)
                }}</label
              >
            </li>
          </ul>
        </div>
        <p class="addAndEditCreatorModal__selectFormTitle">
          {{
            userType === 'admin'
              ? 'コミッション活動中かどうか選択'
              : $t('addAndEditCreator.subTitle2')
          }}
        </p>
        <div class="addAndEditCreatorModal__selectFormArea">
          <p class="addAndEditCreatorModal__selectFormCaption">
            {{
              userType === 'admin'
                ? 'こちらはコミッションサービス利用時に必要になります。'
                : $t('addAndEditCreator.caption3')
            }}
          </p>
          <div class="addAndEditCreatorModal__activeCheck">
            <input
              :id="`${uid}_active`"
              type="checkbox"
              :name="`creatorTypes_${uid}`"
              :value="true"
              :checked="isActive"
              @change="handleChangeActive(!isActive)"
            /><label :for="`${uid}_active`" />{{
              userType === 'admin' ? 'コミッション活動中' : $t('addAndEditCreator.caption4')
            }}
          </div>
        </div>
        <div class="addAndEditCreatorModal__inputButtonArea">
          <button
            class="addAndEditCreatorModal__inputButton"
            @click="clickCommitCreatorTypeAndIsActive"
          >
            {{ userType === 'admin' ? '保存する' : $t('addAndEditCreator.button') }}
          </button>
          <div class="addAndEditCreatorModal__cancelLink" @click="handleOpenModal('noModal')">
            {{ userType === 'admin' ? 'キャンセル' : $t('addAndEditCreator.cancel') }}
          </div>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject, toRefs, watch } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { AddAndEditCreatorKey } from '@/compositions/key/addAndEditCreatorKey'
import { AddAndEditCreatorStore } from '@/compositions/addAndEditCreator'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    userType: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      CREATOR_TYPES,
      CREATOR_COMMISSION_TYPES,
      processing,
      creatorType,
      isActive,
      initCreatorTypeAndIsActive,
      disableChangeCreator,
      handleChangeCreatorType,
      handleChangeActive,
      commitCreatorTypeAndIsActive,
    } = inject(AddAndEditCreatorKey) as AddAndEditCreatorStore
    /** /Inject **/

    /** Watch **/
    // propsで受け取ったuidの変化を検知するためリアクティブ化する
    const { uid } = toRefs(props)

    // uidを監視して、変化があればinitCreatorTypeAndIsActiveが発火
    watch(uid, () => {
      initCreatorTypeAndIsActive(uid.value)
    })
    /** /Watch **/

    /** Function **/
    // クリックして変更を確定させる
    const clickCommitCreatorTypeAndIsActive = () => {
      commitCreatorTypeAndIsActive(props.uid, ctx)
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      CREATOR_TYPES,
      CREATOR_COMMISSION_TYPES,
      processing,
      creatorType,
      isActive,
      disableChangeCreator,
      handleChangeCreatorType,
      handleChangeActive,
      clickCommitCreatorTypeAndIsActive,
    }
  },
})
</script>

<style lang="scss" scoped>
.addAndEditCreatorModal {
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
    line-height: 1.4;
  }
  &__attentionList {
    margin-bottom: 8px;
    padding-left: 2.2rem;
    text-indent: -0.1rem;
  }
  &__attentionListParts {
    margin-top: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    color: $font-color-white;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__inputButtonArea {
    padding-top: 32px;
    text-align: center;
  }
  &__inputButton {
    margin: 0 auto 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  &__cancelLink {
    margin-top: 16px;
    color: $font-color-lightgray;
    display: inline-block;
    text-decoration: underline;
    cursor: pointer;
  }
  &__selectFormTitle {
    margin-top: 16px;
    color: $font-color-white;
    font-weight: bold;
  }
  &__selectFormCaption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    color: $font-color-white;
  }
  &__selectFormArea {
    margin-top: 4px;
    padding: 8px 0;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
  }
  &__selectFormWrap {
    padding: 8px 0;
    display: flex;
    justify-content: space-around;
  }
  &__selectForm {
    width: 30%;
    height: 40px;
    input[type='radio'] {
      display: none;
    }
    label {
      width: 100%;
      height: 100%;
      color: $font-color-white;
      line-height: 38px;
      text-align: center;
      display: block;
      border-radius: 8px;
      border: $border-color-lightgray solid 1px;
      background: $font-color-darkgray;
      &.isDisabled {
        opacity: 0.4;
        cursor: default;
      }
    }
    input[type='radio']:checked + label {
      color: $font-color-black;
      background: $background-color-lightgray-opacity;
    }
    &.commission {
      width: 80%;
    }
  }
  &__activeCheck {
    padding: 8px 0;
    color: $font-color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin: 0 8px;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
      background: $background-color-white;
    }
    input[type='checkbox']:checked + label:after {
      width: 10px;
      height: 16px;
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      border-right: $border-color-gray solid 3px;
      border-bottom: $border-color-gray solid 3px;
      transform: rotate(45deg);
    }
  }
}
.pc {
  .addAndEditCreatorModal {
    width: 500px;
    &__inputButton {
      width: 300px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:hover {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .addAndEditCreatorModal {
    width: 100%;
    &__inputButton {
      width: 100%;
      font-size: 1.3rem;
      &:active {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:active {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
</style>
