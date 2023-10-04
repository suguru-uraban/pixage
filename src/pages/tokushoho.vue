<template>
  <section>
    <div class="tokushoho">
      <h1 class="tokushoho__title">{{ $t('tokushoho.title1') }}</h1>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle1') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption1') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle2') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption2') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle3') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption3_1') }}</dd>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption3_2') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle4') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption4') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle5') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption5_1') }}</dd>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption5_2') }}</dd>
      </dl>
    </div>

    <div class="tokushoho">
      <h1 class="tokushoho__title">{{ $t('tokushoho.title2') }}</h1>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle6') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption6') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle7') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption7') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle8') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption8') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle9') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption9') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle10') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption10') }}</dd>
      </dl>

      <dl class="tokushoho__block">
        <dt class="tokushoho__blockTitle">{{ $t('tokushoho.subTitle11') }}</dt>
        <dd class="tokushoho__blockContent">{{ $t('tokushoho.caption11') }}</dd>
      </dl>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { title, meta } = useMeta()

    title.value = '特定商法取引法に関する表記'
    meta.value = [
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '特定商法取引法に関する表記 | Pixage' },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/tokushoho' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.tokushoho {
  &__title {
    font-weight: bold;
    margin-bottom: 24px;
  }
  &__block {
    margin: 0 8px 24px;
  }
  &__blockTitle {
    margin-bottom: 16px;
    font-weight: bold;
  }
  &__blockContent {
    margin: 0 0 8px 8px;
    line-height: 1.4;
  }
}
.pc {
  .tokushoho {
    margin: 0 auto 16px;
    padding: 0 8px 32px;
    width: 100%;
    max-width: 1200px;
    min-height: 400px;
    &__title {
      font-size: 2.4rem;
    }
    &__blockTitle {
      font-size: 1.8rem;
    }
    &__blockContent {
      font-size: 1.4rem;
    }
  }
}
.sp {
  .tokushoho {
    padding: 0 8px 16px;
    width: 100%;
    &__title {
      font-size: 1.4rem;
    }
    &__blockTitle {
      font-size: 1.4rem;
    }
    &__blockContent {
      font-size: 1.4rem;
    }
  }
}
</style>
