<template>
  <div class="creator">
    <h2 class="creator__subTitle">作者名<span>※必須</span></h2>
    <ul class="creator__attentionList">
      <li class="creator__attentionListParts">
        一人の場合は、「全作業可」のクリエイターしか選択できません。
      </li>
      <li class="creator__attentionListParts">
        二人の場合、原作には「原作のみ」か「全作業可」、作画には「作画のみ」か「全作業可」のクリエイターが選択できます。
      </li>
      <li class="creator__attentionListParts">
        二人の場合、原作と作画に同じクリエイターを選択することはできません。原作と作画が同一人物の場合は「作家が一人の場合」を選択してください。
      </li>
    </ul>
    <div class="creator__inputBlock">
      <div class="creator__inputBlockInnerLeft">
        <ul class="creator__radioCreatorWrap">
          <li class="creator__radioCreator">
            <input
              id="author_single"
              type="radio"
              name="author"
              value="single"
              :checked="radio === 'single'"
              @change="changeCreatorNum($event, ctx)"
            /><label for="author_single">作家が一人の場合</label>
          </li>
          <li class="creator__radioCreator">
            <input
              id="author_multi"
              type="radio"
              name="author"
              value="multi"
              :checked="radio === 'multi'"
              @change="changeCreatorNum($event, ctx)"
            /><label for="author_multi">原作と作画の二人で作業する場合</label>
          </li>
        </ul>
        <div class="creator__creatorArrow">↓</div>
        <div v-if="radio === 'single'" class="creator__creatorSelectButtonWrap">
          <div
            class="creator__creatorSelectButton"
            @click="clickHandleOpenModalWithFetchCreator('selectAll')"
          >
            作家を選択する
          </div>
        </div>
        <div v-if="radio === 'multi'" class="creator__creatorSelectButtonWrap">
          <div
            class="creator__creatorSelectButton"
            @click="clickHandleOpenModalWithFetchCreator('selectStory')"
          >
            原作担当を選択する
          </div>
          <div
            class="creator__creatorSelectButton"
            @click="clickHandleOpenModalWithFetchCreator('selectDrawing')"
          >
            作画担当を選択する
          </div>
        </div>
      </div>
      <dl :class="['creator__inputBlockInnerRight', { inValid: isDirty && error !== '' }]">
        <dt class="creator__selectedCreatorTitle">選択中のクリエイター</dt>
        <dd v-if="radio === 'single'">
          <p class="creator__selectedCreatorSingle" :data-style="creatorName.all ? '' : 'noData'">
            {{ creatorName.all ? creatorName.all : '未登録' }}
          </p>
        </dd>
        <dd v-if="radio === 'multi'">
          <dl class="creator__selectedCreatorMulti">
            <dt class="creator__selectedCreatorMultiTitle">原作</dt>
            <dd
              class="creator__selectedCreatorMultiData"
              :data-style="creatorName.story ? '' : 'noData'"
            >
              {{ creatorName.story ? creatorName.story : '未登録' }}
            </dd>
          </dl>
          <dl class="creator__selectedCreatorMulti">
            <dt class="creator__selectedCreatorMultiTitle">作画</dt>
            <dd
              class="creator__selectedCreatorMultiData"
              :data-style="creatorName.drawing ? '' : 'noData'"
            >
              {{ creatorName.drawing ? creatorName.drawing : '未登録' }}
            </dd>
          </dl>
        </dd>
      </dl>
      <Error v-if="isDirty && error !== ''" :message="error" type="creator" />
    </div>
    <SelectCreatorModal :creators="getCreators" @select-creator="clickSetCreator($event)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, toRefs, watch } from '@nuxtjs/composition-api'
import { firestore } from '@/plugins/firebase'
import Error from '@/components/shared/Error.vue'
import SelectCreatorModal from '@/components/modals/addAndEditWork/SelectCreatorModal.vue'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'
import { ModalType } from '@/types/modalType'

export default defineComponent({
  components: {
    Error,
    SelectCreatorModal,
  },
  props: {
    isDirty: {
      type: Boolean,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    radio: {
      type: String,
      required: true,
    },
    creatorAllId: {
      type: Number,
      required: true,
    },
    creatorStoryId: {
      type: Number,
      required: true,
    },
    creatorDrawingId: {
      type: Number,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      processing,
      creatorName,
      getCreators,
      creatorIds,
      changeCreatorNum,
      handleOpenModalWithFetchCreator,
      setCreator,
    } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Watch **/
    // propsで受け取ったcreatorAllId, creatorStoryId, creatorDrawingIdの
    // 変化を検知するためリアクティブ化する
    const { creatorAllId, creatorStoryId, creatorDrawingId } = toRefs(props)

    // creatorAllIdを監視して、変化があればdisplayNameとcreatorIdを取得
    watch(creatorAllId, () => {
      if (props.pageType === 'edit' && creatorAllId.value !== 0) {
        firestore
          .collection('usersPublicData')
          .where('creatorId', '==', creatorAllId.value)
          .get()
          .then((userSnapshot) => {
            userSnapshot.forEach((user) => {
              creatorName.all = user.data().displayName
              creatorIds.all = user.data().creatorId
            })
          })
      }
    })

    // creatorStoryIdを監視して、変化があればdisplayNameとcreatorIdを取得
    watch(creatorStoryId, () => {
      if (props.pageType === 'edit' && creatorStoryId.value !== 0) {
        firestore
          .collection('usersPublicData')
          .where('creatorId', '==', creatorStoryId.value)
          .get()
          .then((userSnapshot) => {
            userSnapshot.forEach((user) => {
              creatorName.story = user.data().displayName
              creatorIds.story = user.data().creatorId
            })
          })
      }
    })

    // creatorDrawingIdを監視して、変化があればdisplayNameとcreatorIdを取得
    watch(creatorDrawingId, () => {
      if (props.pageType === 'edit' && creatorDrawingId.value !== 0) {
        firestore
          .collection('usersPublicData')
          .where('creatorId', '==', creatorDrawingId.value)
          .get()
          .then((userSnapshot) => {
            userSnapshot.forEach((user) => {
              creatorName.drawing = user.data().displayName
              creatorIds.drawing = user.data().creatorId
            })
          })
      }
    })
    /** /Watch **/

    /** Function **/
    // クリエイター一覧モーダル表示関数の呼び出し
    const clickHandleOpenModalWithFetchCreator = (modalType: ModalType) => {
      handleOpenModalWithFetchCreator(ctx, props.radio, modalType)
      watch(processing, () => {
        if (!processing.value) {
          handleOpenModal(modalType)
        }
      })
    }

    // クリエイターをセットする関数の呼び出し
    const clickSetCreator = (creatorId: number) => {
      setCreator(ctx, creatorId, modalType.value)
      watch(processing, () => {
        if (!processing.value) {
          handleOpenModal('noModal')
        }
      })
    }
    /** /Function **/

    return {
      ctx,
      creatorName,
      getCreators,
      changeCreatorNum,
      clickHandleOpenModalWithFetchCreator,
      clickSetCreator,
    }
  },
})
</script>

<style lang="scss" scoped>
.creator {
  margin-bottom: 16px;
  padding: 0 8px;
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.6rem;
    line-height: 2;
    font-weight: bold;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__attentionList {
    padding-left: 1.2rem;
    text-indent: -1rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__inputBlock {
    width: 820px;
    padding-bottom: 16px;
    display: flex;
    position: relative;
  }
  &__inputBlockInnerLeft {
    width: 422px;
  }
  &__inputBlockInnerRight {
    padding: 16px;
    flex: 1;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__radioCreatorWrap {
    padding: 8px 0;
    display: flex;
  }
  &__radioCreator {
    height: 32px;
    input[type='radio'] {
      display: none;
    }
    label {
      margin-right: 16px;
      padding: 0 16px;
      height: 100%;
      line-height: 30px;
      text-align: center;
      display: block;
      border-radius: 8px;
      border: $border-color-lightgray solid 1px;
    }
    input[type='radio']:checked + label {
      background: $background-color-gray-admin-hover;
    }
  }
  &__creatorArrow {
    width: 340px;
    font-size: 2.4rem;
    font-weight: bold;
    text-align: center;
  }
  &__creatorSelectButtonWrap {
    width: 340px;
    margin-top: 8px;
    display: flex;
    justify-content: space-around;
  }
  &__creatorSelectButton {
    padding: 0 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
  &__selectedCreatorTitle {
    margin-bottom: 16px;
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__selectedCreatorSingle {
    padding: 0 8px;
    font-weight: bold;
    &[data-style='noData'] {
      color: $font-color-gray;
      font-weight: normal;
    }
  }
  &__selectedCreatorMulti {
    margin-bottom: 8px;
    padding: 0 8px;
    display: flex;
    align-items: flex-start;
  }
  &__selectedCreatorMultiTitle {
    margin-right: 8px;
  }
  &__selectedCreatorMultiData {
    font-weight: bold;
    &[data-style='noData'] {
      color: $font-color-gray;
      font-weight: normal;
    }
  }
}
</style>
