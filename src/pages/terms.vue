<template>
  <section class="terms">
    <h1 class="terms__title">{{ $t('terms.title') }}</h1>
    <p class="terms__caption">{{ $t('terms.caption') }}</p>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle1') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption1_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption1_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption1_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle2') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption2') }}</dd>
      <dd class="terms__blockContent">
        <ul class="terms__blockList">
          <li class="terms__blockListParts num1">{{ $t('terms.caption2_1') }}</li>
          <li class="terms__blockListParts num2">{{ $t('terms.caption2_2') }}</li>
          <li class="terms__blockListParts num3">{{ $t('terms.caption2_3') }}</li>
          <li class="terms__blockListParts num4">{{ $t('terms.caption2_4') }}</li>
          <li class="terms__blockListParts num5">{{ $t('terms.caption2_5') }}</li>
          <li class="terms__blockListParts num6">{{ $t('terms.caption2_6') }}</li>
          <li class="terms__blockListParts num7">{{ $t('terms.caption2_7') }}</li>
          <li class="terms__blockListParts num8">{{ $t('terms.caption2_8') }}</li>
          <li class="terms__blockListParts num9">{{ $t('terms.caption2_9') }}</li>
          <li class="terms__blockListParts num10">{{ $t('terms.caption2_10') }}</li>
          <li class="terms__blockListParts num11">{{ $t('terms.caption2_11') }}</li>
          <li class="terms__blockListParts num12">{{ $t('terms.caption2_12') }}</li>
          <li class="terms__blockListParts num13">{{ $t('terms.caption2_13') }}</li>
        </ul>
      </dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle3') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption3_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption3_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption3_3') }}</dd>
      <dd class="terms__blockContentListWrap">
        <ul class="terms__blockList">
          <li class="terms__blockListParts num1">{{ $t('terms.caption3_3_1') }}</li>
          <li class="terms__blockListParts num2">{{ $t('terms.caption3_3_2') }}</li>
          <li class="terms__blockListParts num3">{{ $t('terms.caption3_3_3') }}</li>
          <li class="terms__blockListParts num4">{{ $t('terms.caption3_3_4') }}</li>
          <li class="terms__blockListParts num5">{{ $t('terms.caption3_3_5') }}</li>
          <li class="terms__blockListParts num6">{{ $t('terms.caption3_3_6') }}</li>
        </ul>
      </dd>
      <dd class="terms__blockContentList num4">{{ $t('terms.caption3_4') }}</dd>
      <dd class="terms__blockContentList num5">{{ $t('terms.caption3_5') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle4') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption4') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle5') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption5_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption5_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption5_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle6') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption6_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption6_2') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle7') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption7_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption7_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption7_3') }}</dd>
      <dd class="terms__blockContentList num4">{{ $t('terms.caption7_4') }}</dd>
      <dd class="terms__blockContentList num5">{{ $t('terms.caption7_5') }}</dd>
      <dd class="terms__blockContentList num6">{{ $t('terms.caption7_6') }}</dd>
      <dd class="terms__blockContentList num7">{{ $t('terms.caption7_7') }}</dd>
      <dd class="terms__blockContentList num8">{{ $t('terms.caption7_8') }}</dd>
      <dd class="terms__blockContentList num9">{{ $t('terms.caption7_9') }}</dd>
      <dd class="terms__blockContentList num10">{{ $t('terms.caption7_10') }}</dd>
      <dd class="terms__blockContentList num11">{{ $t('terms.caption7_11') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle8') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption8_1') }}</dd>
      <dd class="terms__blockContentListWrap">
        <ul class="terms__blockList">
          <li class="terms__blockListParts num1">{{ $t('terms.caption8_1_1') }}</li>
          <li class="terms__blockListParts num2">{{ $t('terms.caption8_1_2') }}</li>
          <li class="terms__blockListParts num3">{{ $t('terms.caption8_1_3') }}</li>
          <li class="terms__blockListParts num4">{{ $t('terms.caption8_1_4') }}</li>
          <li class="terms__blockListParts num5">{{ $t('terms.caption8_1_5') }}</li>
          <li class="terms__blockListParts num6">{{ $t('terms.caption8_1_6') }}</li>
          <li class="terms__blockListParts num7">{{ $t('terms.caption8_1_7') }}</li>
          <li class="terms__blockListParts num8">{{ $t('terms.caption8_1_8') }}</li>
          <li class="terms__blockListParts num9">{{ $t('terms.caption8_1_9') }}</li>
          <li class="terms__blockListParts num10">{{ $t('terms.caption8_1_10') }}</li>
          <li class="terms__blockListParts num11">{{ $t('terms.caption8_1_11') }}</li>
          <li class="terms__blockListParts num12">{{ $t('terms.caption8_1_12') }}</li>
          <li class="terms__blockListParts num13">{{ $t('terms.caption8_1_13') }}</li>
          <li class="terms__blockListParts num14">{{ $t('terms.caption8_1_14') }}</li>
          <li class="terms__blockListParts num15">{{ $t('terms.caption8_1_15') }}</li>
        </ul>
      </dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption8_2') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle9') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption9_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption9_2') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle10') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption10_1') }}</dd>
      <dd class="terms__blockContentListWrap">
        <ul class="terms__blockList">
          <li class="terms__blockListParts num1">{{ $t('terms.caption10_1_1') }}</li>
          <li class="terms__blockListParts num2">{{ $t('terms.caption10_1_2') }}</li>
          <li class="terms__blockListParts num3">{{ $t('terms.caption10_1_3') }}</li>
          <li class="terms__blockListParts num4">{{ $t('terms.caption10_1_4') }}</li>
          <li class="terms__blockListParts num5">{{ $t('terms.caption10_1_5') }}</li>
          <li class="terms__blockListParts num6">{{ $t('terms.caption10_1_6') }}</li>
        </ul>
      </dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption10_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption10_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle11') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption11_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption11_2') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption11_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle12') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption12_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption12_2') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption12_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle13') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption13_1') }}</dd>
      <dd class="terms__blockContentListWrap">
        <ul class="terms__blockList">
          <li class="terms__blockListParts num1">{{ $t('terms.caption13_1_1') }}</li>
          <li class="terms__blockListParts num2">{{ $t('terms.caption13_1_2') }}</li>
          <li class="terms__blockListParts num3">{{ $t('terms.caption13_1_3') }}</li>
          <li class="terms__blockListParts num4">{{ $t('terms.caption13_1_4') }}</li>
          <li class="terms__blockListParts num5">{{ $t('terms.caption13_1_5') }}</li>
          <li class="terms__blockListParts num6">{{ $t('terms.caption13_1_6') }}</li>
          <li class="terms__blockListParts num7">{{ $t('terms.caption13_1_7') }}</li>
          <li class="terms__blockListParts num8">{{ $t('terms.caption13_1_8') }}</li>
          <li class="terms__blockListParts num9">{{ $t('terms.caption13_1_9') }}</li>
          <li class="terms__blockListParts num10">{{ $t('terms.caption13_1_10') }}</li>
          <li class="terms__blockListParts num11">{{ $t('terms.caption13_1_11') }}</li>
          <li class="terms__blockListParts num12">{{ $t('terms.caption13_1_12') }}</li>
        </ul>
      </dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption13_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption13_3') }}</dd>
      <dd class="terms__blockContentList num4">{{ $t('terms.caption13_4') }}</dd>
      <dd class="terms__blockContentList num5">{{ $t('terms.caption13_5') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle14') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption14_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption14_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption14_3') }}</dd>
      <dd class="terms__blockContentList num4">{{ $t('terms.caption14_4') }}</dd>
      <dd class="terms__blockContentList num5">{{ $t('terms.caption14_5') }}</dd>
      <dd class="terms__blockContentList num6">{{ $t('terms.caption14_6') }}</dd>
      <dd class="terms__blockContentList num7">{{ $t('terms.caption14_7') }}</dd>
      <dd class="terms__blockContentList num8">{{ $t('terms.caption14_8') }}</dd>
      <dd class="terms__blockContentList num9">{{ $t('terms.caption14_9') }}</dd>
      <dd class="terms__blockContentList num10">{{ $t('terms.caption14_10') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle15') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption15_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption15_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption15_3') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle16') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption16_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption16_2') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle17') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption17') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle18') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption18_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption18_2') }}</dd>
      <dd class="terms__blockContentList num3">{{ $t('terms.caption18_3') }}</dd>
      <dd class="terms__blockContentList num4">{{ $t('terms.caption18_4') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle19') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption19') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle20') }}</dt>
      <dd class="terms__blockContentList num1">{{ $t('terms.caption20_1') }}</dd>
      <dd class="terms__blockContentList num2">{{ $t('terms.caption20_2') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle21') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption21') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle22') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption22') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle23') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption23') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle24') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption24') }}</dd>
    </dl>

    <dl class="terms__block">
      <dt class="terms__blockTitle">{{ $t('terms.subTitle25') }}</dt>
      <dd class="terms__blockContent">{{ $t('terms.caption25') }}</dd>
    </dl>

    <p class="terms__createdAt">{{ $t('terms.updatedAt') }}</p>
  </section>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { title, meta } = useMeta()

    title.value = '利用規約'
    meta.value = [
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '利用規約 | Pixage' },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/terms' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.terms {
  &__title {
    font-weight: bold;
    margin-bottom: 16px;
  }
  &__caption {
    margin-bottom: 24px;
    line-height: 1.4;
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
  &__blockContentList {
    margin: 0 0 8px 8px;
    font-size: 1.4rem;
    line-height: 1.4;
    position: relative;
    &.num1 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '1.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num2 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '2.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num3 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '3.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num4 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '4.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num5 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '5.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num6 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '6.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num7 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '7.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num8 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '8.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num9 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '9.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num10 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '10.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num11 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '11.';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  &__blockContentListWrap {
    margin: 0 0 8px 8px;
    padding-left: 16px;
    line-height: 1.4;
  }
  &__blockList {
    padding-left: 16px;
  }
  &__blockListParts {
    margin-bottom: 8px;
    font-size: 1.4rem;
    position: relative;
    &.num1 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(1)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num2 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(2)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num3 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(3)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num4 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(4)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num5 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(5)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num6 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(6)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num7 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(7)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num8 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(8)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num9 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(9)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num10 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(10)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num11 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(11)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num12 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(12)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num13 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(13)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num14 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(14)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &.num15 {
      padding-left: 32px;
      &:before {
        width: 32px;
        content: '(15)';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  &__createdAt {
    padding-top: 24px;
    font-weight: bold;
  }
}
.pc {
  .terms {
    margin: 0 auto 16px;
    padding: 0 8px 32px;
    width: 100%;
    max-width: 1200px;
    min-height: 400px;
    &__title {
      font-size: 2.4rem;
    }
    &__caption {
      font-size: 1.6rem;
    }
    &__blockTitle {
      font-size: 1.8rem;
    }
    &__blockContent {
      font-size: 1.4rem;
    }
    &__createdAt {
      font-size: 1.6rem;
    }
  }
}
.sp {
  .terms {
    padding: 0 8px 16px;
    width: 100%;
    &__title {
      font-size: 1.4rem;
    }
    &__caption {
      font-size: 1.4rem;
    }
    &__blockTitle {
      font-size: 1.4rem;
    }
    &__blockContent {
      font-size: 1.4rem;
    }
    &__createdAt {
      font-size: 1.4rem;
    }
  }
}
</style>
