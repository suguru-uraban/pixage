<template>
  <p
    :class="[
      'error',
      { input: type === 'input' },
      { total: type === 'total' },
      { modalTotal: type === 'modalTotal' },
      { description: type === 'description' },
      { memo: type === 'memo' },
      { prArea: type === 'prArea' },
      { commissionDescription: type === 'commissionDescription' },
      { creator: type === 'creator' },
      { upload: type === 'upload' },
      { inquiry: type === 'inquiry' },
    ]"
  >
    <span>{{ message }}</span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {},
})
</script>

<style lang="scss" scoped>
.error {
  font-size: 1.2rem;
  color: $font-color-red;
  line-height: 1.2;
  display: inline-block;
  font-weight: bold;
  position: absolute;
  left: 0;
  &.input {
    top: 42px;
  }
  &.total {
    margin: auto;
    right: 0;
    bottom: 68px;
  }
  &.modalTotal {
    margin: auto;
    text-align: center;
    right: 0;
    bottom: 74px;
  }
  &.description {
    top: 150px;
  }
  &.memo {
    top: 170px;
  }
  &.prArea {
    top: 322px;
  }
  &.commissionDescription {
    top: 622px;
  }
  &.inquiry {
    top: 302px;
  }
  &.creator {
    top: 126px;
    left: 422px;
  }
  span {
    display: inline-block;
    text-align: left;
  }
}
.pc {
  .error {
    &.upload {
      top: 590px;
    }
  }
}
.sp {
  .error {
    &.upload {
      top: 564px;
    }
  }
}
</style>
