<template>
  <div :class="['flush', type]">
    {{ caption }}
    <div class="flush__close" @click="hideFlush">&times;</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { FlushKey } from '@/compositions/key/flushKey'
import { FlushStore } from '@/compositions/flush'

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
  setup() {
    /** Inject **/
    const { hideFlush } = inject(FlushKey) as FlushStore
    /** /Inject **/

    /** LifeCycle **/
    setTimeout(() => {
      hideFlush()
    }, 8000)
    /** /LifeCycle **/

    return {
      hideFlush,
    }
  },
})
</script>

<style lang="scss" scoped>
.flush {
  padding: 16px;
  line-height: 1.4;
  position: fixed;
  display: flex;
  align-items: center;
  border-radius: 4px;
  animation: flushOpacity 1s ease 0s 1 normal none running;
  z-index: $zIndexFlush;
  &.success {
    background: $flush-color-success;
  }
  &.error {
    background: $flush-color-error;
  }
  &__close {
    width: 24px;
    height: 24px;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
    position: absolute;
    top: -8px;
    right: -8px;
    border-radius: 50%;
    background: $background-color-darkgray-opacity;
    cursor: pointer;
  }
}
.pc {
  .flush {
    width: 320px;
    height: 120px;
    right: 16px;
    bottom: 16px;
  }
}
.sp {
  .flush {
    margin: auto;
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}

@keyframes flushOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
