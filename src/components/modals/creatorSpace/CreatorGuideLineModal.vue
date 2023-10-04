<template>
  <transition name="fade">
    <Modal v-if="modalType === 'creatorGuideLine'">
      <div class="creatorGuideLineModal">
        <p class="creatorGuideLineModal__title">{{ $t('creatorGuideLine.title') }}</p>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle1') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption1_1') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption1_3') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption1_4') }}</dd>
          <dd>
            <ul class="creatorGuideLineModal__attentionList">
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption1_5') }}
              </li>
            </ul>
          </dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption1_6') }}</dd>
        </dl>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle2') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption2_1') }}</dd>
          <dd>
            <ul class="creatorGuideLineModal__attentionList">
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption2_2') }}
              </li>
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption2_3') }}
              </li>
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption2_4') }}
              </li>
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption2_5') }}
              </li>
            </ul>
          </dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption2_6') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption2_7') }}</dd>
        </dl>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle3') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_1') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_2') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_3') }}</dd>
          <dd>
            <ul class="creatorGuideLineModal__attentionList">
              <li class="creatorGuideLineModal__attentionListParts">
                {{ $t('creatorGuideLine.caption3_4') }}
              </li>
            </ul>
          </dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_5') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_6') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_7') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_12') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_8') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_9') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_10') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption3_11') }}</dd>
        </dl>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle13') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_1') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_2') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_3') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_4') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_5') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption13_6') }}</dd>
        </dl>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle14') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_1') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_2') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_3') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_4') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_5') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_6') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_7') }}</dd>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption14_8') }}</dd>
        </dl>
        <dl class="creatorGuideLineModal__block">
          <dt class="creatorGuideLineModal__subTitle">{{ $t('creatorGuideLine.subTitle4') }}</dt>
          <dd class="creatorGuideLineModal__caption">{{ $t('creatorGuideLine.caption4_1') }}</dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle5') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_3') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_4') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_5') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_6') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_7') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption5_8') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle6') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption6_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption6_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption6_3') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption6_4') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle7') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_3') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_4') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_5') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_6') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption7_7') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle8') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption8_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption8_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption8_3') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption8_4') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption8_5') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle9') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption9_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption9_2') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle10') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption10_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption10_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption10_3') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle11') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption11_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption11_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption11_3') }}
              </dd>
            </dl>
          </dd>
          <dd>
            <dl class="creatorGuideLineModal__childList">
              <dt class="creatorGuideLineModal__childListTitle">
                {{ $t('creatorGuideLine.subTitle12') }}
              </dt>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_1') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_2') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_3') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_4') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_5') }}
              </dd>
              <dd class="creatorGuideLineModal__childListContent">
                {{ $t('creatorGuideLine.caption12_6') }}
              </dd>
            </dl>
          </dd>
        </dl>
        <button class="creatorGuideLineModal__button" @click="handleOpenModal('noModal')">
          {{ $t('creatorGuideLine.close') }}
        </button>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    /** /Inject **/

    return {
      modalType,
      handleOpenModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.creatorGuideLineModal {
  position: relative;
  &__title {
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__block {
    margin-top: 24px;
  }
  &__subTitle {
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__caption {
    margin: 16px 0 0 16px;
    line-height: 1.4;
  }
  &__attentionList {
    margin: 8px 0 0 24px;
    padding-left: 1.2rem;
    text-indent: -1rem;
  }
  &__attentionListParts {
    margin-top: 8px;
    font-size: 1.2rem;
    line-height: 1.4;
    &:before {
      content: '※';
    }
    &:nth-child(1) {
      margin-top: 0;
    }
  }
  &__childList {
    margin: 16px 0 0 16px;
  }
  &__childListTitle {
    font-weight: bold;
  }
  &__childListContent {
    margin: 8px 0 0 8px;
    line-height: 1.4;
  }
  &__button {
    margin: 32px auto 8px;
    padding: 0 16px;
    width: 160px;
    height: 40px;
    font-size: 1.3rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
}
.pc {
  .creatorGuideLineModal {
    width: 800px;
  }
}
.sp {
  .creatorGuideLineModal {
    width: 100%;
  }
}
</style>
