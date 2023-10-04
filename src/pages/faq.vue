<template>
  <section class="faq">
    <h1 class="faq__title">{{ $t('faq.title') }}</h1>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question1') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer1') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question2') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer2') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question3') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer3') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question4') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer4') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question5') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer5_1') }}</dd>
      <dd class="faq__blockAttention">{{ $t('faq.answer5_2') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question6') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer6_1') }}</dd>
      <dd class="faq__blockAttention">{{ $t('faq.answer6_2') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question7') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer7') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question8') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer8') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question9') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer9_1') }}</dd>
      <dd class="faq__blockAttention">{{ $t('faq.answer9_2') }}</dd>
      <dd class="faq__blockAttention">{{ $t('faq.answer9_3') }}</dd>
      <dd class="faq__blockAttention">{{ $t('faq.answer9_4') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question10') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer10') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question11') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer11') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question12') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer12') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question13') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer13') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question14') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer14') }}</dd>
    </dl>

    <dl class="faq__block">
      <dt class="faq__blockTitle">{{ $t('faq.question15') }}</dt>
      <dd class="faq__blockContent">{{ $t('faq.answer15') }}</dd>
    </dl>
  </section>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    /** composition-api **/
    const { title, meta } = useMeta()
    /** /composition-api **/

    /** Meta **/
    title.value = 'よくある質問'
    meta.value = [
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'よくある質問 | Pixage' },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/faq' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.faq {
  &__title {
    font-weight: bold;
    margin-bottom: 16px;
  }
  &__blockTitle {
    margin-bottom: 8px;
    line-height: 1.4;
    font-weight: bold;
  }
  &__blockContent {
    margin: 0 0 8px 16px;
    line-height: 1.4;
  }
  &__blockAttention {
    margin: 0 0 8px 16px;
    line-height: 1.4;
  }
}
.pc {
  .faq {
    margin: 0 auto 16px;
    padding: 0 8px 32px;
    width: 100%;
    max-width: 1200px;
    min-height: 400px;
    &__title {
      font-size: 2.4rem;
    }
    &__block {
      margin: 0 8px 32px;
    }
    &__blockTitle {
      padding-left: 2.2rem;
      font-size: 1.8rem;
      text-indent: -3rem;
    }
    &__blockContent {
      padding-left: 1.9rem;
      font-size: 1.6rem;
      text-indent: -1.5rem;
    }
    &__blockAttention {
      padding-left: 1.9rem;
      font-size: 1.6rem;
      text-indent: -0.8rem;
    }
  }
}
.sp {
  .faq {
    padding: 0 8px 16px;
    width: 100%;
    &__title {
      font-size: 1.4rem;
    }
    &__block {
      margin: 0 16px 32px;
    }
    &__blockTitle {
      padding-left: 0.4rem;
      font-size: 1.4rem;
      text-indent: -1.5rem;
    }
    &__blockContent {
      padding-left: 0.4rem;
      font-size: 1.4rem;
      text-indent: -1.3rem;
    }
    &__blockAttention {
      padding-left: 0.4rem;
      font-size: 1.4rem;
      text-indent: -0.9rem;
    }
  }
}
</style>
