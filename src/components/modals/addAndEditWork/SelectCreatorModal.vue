<template>
  <transition name="fade">
    <Modal
      v-if="
        modalType === 'selectAll' || modalType === 'selectStory' || modalType === 'selectDrawing'
      "
    >
      <div class="selectCreatorModal">
        <p class="selectCreatorModal__title">{{ pageTitle }}</p>
        <ul v-if="!!creators.length" class="selectCreatorModal__list">
          <li
            v-for="creator in creators"
            :key="String(creator.creatorId)"
            class="selectCreatorModal__listBlock"
            @click="selectCreator(creator.creatorId)"
          >
            {{ creator.displayName }}
          </li>
        </ul>
        <p v-if="!creators.length" class="selectCreatorModal__attention">
          選択できるクリエイターがいません
        </p>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    creators: {
      type: Array,
      required: true,
    },
  },
  setup(_, ctx) {
    /** Inject **/
    const { modalType } = inject(ModalKey) as ModalStore
    /** /Inject **/

    /** Computed **/
    const pageTitle = computed(() => {
      if (modalType.value === 'selectStory') {
        return 'クリエイター（原作担当）を選択'
      } else if (modalType.value === 'selectDrawing') {
        return 'クリエイター（作画担当）を選択'
      } else {
        return 'クリエイターを選択'
      }
    })
    /** /Computed **/

    /** Function **/
    // 上位コンポーネントで選択したクリエイターをセットする
    const selectCreator = (creatorId: number) => {
      ctx.emit('select-creator', creatorId)
    }
    /** /Function **/

    return {
      modalType,
      pageTitle,
      selectCreator,
    }
  },
})
</script>

<style lang="scss" scoped>
.selectCreatorModal {
  width: 600px;
  position: relative;
  &__title {
    margin-bottom: 16px;
    color: $font-color-white;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__list {
    margin-top: 16px;
    padding: 0 8px;
  }
  &__listBlock {
    width: 100%;
    height: 40px;
    color: $font-color-white;
    line-height: 1.4;
    display: flex;
    align-items: center;
    border-bottom: $border-color-lightgray dotted 1px;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
  &__attention {
    margin-top: 16px;
    padding: 0 8px;
    color: $font-color-white;
  }
}
</style>
