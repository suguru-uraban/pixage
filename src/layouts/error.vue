<template>
  <div>
    <div class="error">
      <div class="error__container">
        <div v-if="error.statusCode === 404">
          <h1 class="error__title">404</h1>
          <p class="error__caption">{{ $t('errorPage.caption1') }}</p>
          <p class="error__caption">{{ $t('errorPage.caption3') }}</p>
        </div>
        <div v-else>
          <h1 class="error__title">ERROR</h1>
          <p class="error__caption">{{ $t('errorPage.caption2') }}</p>
          <p class="error__caption">{{ $t('errorPage.caption3') }}</p>
        </div>
        <div class="error__linkArea">
          <nuxt-link to="/" class="error__link">{{ $t('errorPage.link') }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Void',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const { app } = useContext()
    const { htmlAttrs, bodyAttrs, title } = useMeta()

    htmlAttrs.value = {
      lang: 'ja',
    }

    bodyAttrs.value = {
      class: app.$device.isDesktop ? 'pc' : 'sp',
      ontouchstart: '',
    }

    title.value = app.i18n.t('errorPage.title').toString()

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.error {
  height: calc(100vh - 242px);
  &__container {
    margin: auto;
    width: 100%;
    height: 300px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__title {
    font-size: 6rem;
    color: $font-color-lightgray;
    font-weight: bold;
    text-align: center;
  }
  &__caption {
    margin-top: 12px;
    font-size: 1.6rem;
    line-height: 1.6;
    color: $border-color-white;
    text-align: center;
  }
  &__linkArea {
    padding-top: 48px;
    text-align: center;
  }
  &__link {
    margin: 0 auto;
    font-size: 1.8rem;
    display: inline-block;
    text-decoration: underline;
  }
}
.pc {
  .error {
    &__link {
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .error {
    &__link {
      &:active {
        text-decoration: none;
      }
    }
  }
}
</style>
