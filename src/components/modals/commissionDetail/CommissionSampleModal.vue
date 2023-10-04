<template>
  <transition name="fade">
    <Modal v-if="modalType === 'commissionSample'">
      <div class="commissionSampleModal">
        <div class="commissionSampleModal__image">
          <img :src="sampleImage" alt="" />
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject, onUnmounted } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { CommissionDetailKey } from '@/compositions/key/commissionDetailKey'
import { CommissionDetailStore } from '@/compositions/commissionDetail'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { sampleImage } = inject(CommissionDetailKey) as CommissionDetailStore
    /** /Inject **/

    /** LifeCycle **/
    onUnmounted(() => {
      sampleImage.value = ''
    })
    /** /LifeCycle **/

    return {
      modalType,
      handleOpenModal,
      sampleImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.commissionSampleModal {
  position: relative;
  &__image {
    position: relative;
  }
}
.pc {
  .commissionSampleModal {
    width: 800px;
    &__image {
      margin: 0 auto;
      width: 680px;
      height: 680px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
.sp {
  .commissionSampleModal {
    width: 100%;
    &__image {
      margin: 0 auto;
      width: 100%;
      padding-top: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>
