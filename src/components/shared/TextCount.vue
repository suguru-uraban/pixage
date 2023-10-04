<template>
  <div :class="['textCount', { admin: layout === 'admin' }]">
    <span
      :class="[
        'textCount__count',
        { warning: text.length >= Math.floor(max * 0.95) },
        { over: text.length >= max },
      ]"
      >{{ text.length }}</span
    >/<span class="textCount__maxCount">{{ max }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    layout: {
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
.textCount {
  width: 100%;
  height: 20px;
  color: $font-color-white;
  text-align: right;
  &.admin {
    color: $font-color-black;
  }
  &__count {
    margin-right: 4px;
    &.warning {
      color: $font-color-lemon !important;
    }
    &.over {
      color: $font-color-red !important;
      font-weight: bold;
    }
  }
  &__maxCount {
    margin-left: 4px;
    font-size: 1.2rem;
    color: $font-color-lightgray;
    font-weight: normal;
  }
}
</style>
