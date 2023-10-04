<template>
  <div class="thanks">
    <div class="thanks__body">
      <p class="thanks__caption">
        お問い合わせいただきありがとうございました。<br />
        折り返し、担当者よりご連絡差し上げますのでお待ちください。<br />
        （お問い合わせ内容によっては、お答えできない場合もございますのでご了承ください）
      </p>
      <a href="https://pixage.app" target="_top" class="thanks__backButton">TOPへ戻る</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'IframeInner',
  setup() {
    const { meta, title } = useMeta()

    title.value = 'Pixageへのお問い合わせ受付完了'
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: 'Pixageへのお問い合わせ受付完了',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
    ]
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.thanks {
  &__body {
    position: relative;
    width: 100%;
  }
  &__caption {
    line-height: 1.6;
  }
  &__backButton {
    margin-top: 32px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: $font-color-darkgray;
    text-align: center;
    display: block;
    border-radius: 8px;
    background: linear-gradient(to bottom, $font-color-white 0%, $font-color-lightgray 100%);
  }
}
.pc {
  .thanks {
    &__caption {
      font-size: 1.8rem;
    }
  }
}
.sp {
  .thanks {
    &__caption {
      font-size: 1.4rem;
    }
  }
}
</style>
