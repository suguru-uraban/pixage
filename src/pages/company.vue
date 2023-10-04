<template>
  <div class="company">
    <div class="company__body">
      <h1 class="company__title">会社概要</h1>
      <dl class="company__block">
        <dt class="company__blockTitle">商号</dt>
        <dd class="company__blockContent">Pixage合同会社（ピクセージゴウドウガイシャ）</dd>
      </dl>
      <dl class="company__block">
        <dt class="company__blockTitle">設立</dt>
        <dd class="company__blockContent">2021年（令和3年）3月19日</dd>
      </dl>
      <dl class="company__block">
        <dt class="company__blockTitle">所在地</dt>
        <dd class="company__blockContent">〒581-0846<br />大阪府八尾市上之島町南4-2 105号</dd>
      </dl>
      <dl class="company__block">
        <dt class="company__blockTitle">代表社員</dt>
        <dd class="company__blockContent">上島 優</dd>
      </dl>
      <dl class="company__block">
        <dt class="company__blockTitle">執行社員</dt>
        <dd class="company__blockContent">
          <ul>
            <li>原田 晃人</li>
            <li>佐藤 優</li>
          </ul>
        </dd>
      </dl>
      <dl class="company__block">
        <dt class="company__blockTitle">事業内容</dt>
        <dd class="company__blockContent">
          書籍及び電子出版物の企画、編集、制作、出版、販売並びに映像配信サービス業。
        </dd>
      </dl>
      <p class="company__information">※近日中にコーポレートサイトを作成予定です。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    /** composition-api **/
    const { meta, title } = useMeta()
    /** /composition-api **/

    /** Meta **/
    title.value = '会社概要'
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: 'Pixage合同会社 会社概要',
      },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '会社概要' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Pixage合同会社 会社概要',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/company' },
      { hid: 'og:image', property: 'og:image', content: 'https://pixage.app/icon.png' },
    ]
    /** /Meta **/
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.company {
  &__title {
    margin-bottom: 8px;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__body {
    position: relative;
    min-height: calc(100vh - 300px);
  }
  &__block {
    padding-top: 24px;
  }
  &__blockTitle {
    color: $font-color-white;
    line-height: 1.6;
    font-weight: bold;
  }
  &__blockContent {
    line-height: 1.6;
  }
  &__information {
    margin: 24px 16px 0;
  }
}
.pc {
  .company {
    &__title {
      font-size: 2.4rem;
    }
    &__body {
      margin: 0 auto;
      width: 800px;
    }
    &__block {
      display: flex;
    }
    &__blockTitle {
      padding: 0 24px 0 0;
      width: 120px;
      font-size: 1.8rem;
      text-align: right;
    }
    &__blockContent {
      font-size: 1.8rem;
      flex: 1px;
    }
  }
}
.sp {
  .company {
    &__title {
      margin: 0 16px;
      font-size: 1.5rem;
    }
    &__body {
      margin: 0 auto;
      width: 100%;
      min-height: calc(100vh - 300px);
    }
    &__block {
      margin: 0 16px;
      display: block;
    }
    &__blockTitle {
      margin-bottom: 4px;
      font-size: 1.4rem;
    }
    &__blockContent {
      font-size: 1.4rem;
    }
  }
}
</style>
