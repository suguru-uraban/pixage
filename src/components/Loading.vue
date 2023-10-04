<template>
  <div
    :class="[
      'loading',
      { full: pageType === 'full', normal: pageType === 'normal', modal: pageType === 'modal' },
    ]"
  >
    <img src="@/assets/images/logo_loading.svg" alt="Pixage" />
    <p class="loading__caption">{{ $t('loading.caption') }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    pageType: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  left: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: $zIndexLoading;
  background: $background-color-default;
  &.full {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
  }
  &.normal {
    width: 100%;
    position: fixed;
    top: 48px;
  }
  &.modal {
    width: 100%;
    height: 100%;
    background: none;
  }
  img {
    width: 48px;
    height: auto;
    animation: logoTransform 2s ease-in-out 0s infinite normal none running;
  }
  &__caption {
    margin-top: 16px;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.pc {
  .loading {
    &.normal {
      height: calc(100vh - 48px);
      top: 80px;
    }
  }
}
.sp {
  .loading {
    &.normal {
      height: calc(100vh - 112px);
      top: 56px;
    }
  }
}

@keyframes logoTransform {
  0% {
    transform: rotateY(0deg);
  }
  15% {
    transform: rotateY(0deg);
  }
  45% {
    transform: rotateY(180deg);
  }
  85% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
