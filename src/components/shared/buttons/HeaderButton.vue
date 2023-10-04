<template>
  <div :class="['indexHeaderButton', linkTo]">
    <nuxt-link :to="to">{{ linkName }}</nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },
    linkTo: {
      type: String,
      required: true,
    },
    linkName: {
      type: String,
      required: true,
    },
  },
  setup() {},
})
</script>

<style lang="scss" scoped>
.indexHeaderButton {
  box-sizing: border-box;
  &.signup {
    > a {
      border: $button-color-singUp-border solid 1px;
      background: $button-color-singUp-bg;
    }
  }
  &.signin {
    > a {
      color: $font-color-darkgray;
      border: $button-color-normal-border solid 1px;
      background: $button-color-normal-bg;
    }
  }
  > a {
    width: 100%;
    text-align: center;
    display: block;
    border-radius: 4px;
  }
}
.pc {
  .indexHeaderButton {
    height: 40px;
    > a {
      height: 40px;
      font-size: 1.6rem;
      line-height: 40px;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .indexHeaderButton {
    height: 32px;
    > a {
      height: 32px;
      font-size: 1.4rem;
      line-height: 32px;
      &:active {
        opacity: 0.6;
      }
    }
  }
}
</style>
