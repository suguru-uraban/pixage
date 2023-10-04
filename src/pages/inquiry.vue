<template>
  <div class="inquiry">
    <div class="inquiry__body">
      <h1 class="inquiry__title">{{ $t('inquiry.title') }}</h1>
      <div v-if="!isSended">
        <div class="inquiry__block">
          <h2 class="inquiry__subTitle">
            {{ $t('inquiry.subTitle1') }}<span>{{ $t('inquiry.required') }}</span>
          </h2>
          <ul class="inquiry__attentionList">
            <li class="inquiry__attentionListParts">{{ $t('inquiry.attention1') }}</li>
          </ul>
          <div class="inquiry__inputBlock">
            <input
              v-model="inquiryName"
              value=""
              type="text"
              :class="[
                'inquiry__inputText',
                { inValid: isDirty.inquiryName && params.inquiryName.$anyInvalid },
              ]"
              data-style="name"
            />
            <Error
              v-if="isDirty.inquiryName && params.inquiryName.format.$invalid"
              :message="params.inquiryName.format.$message"
              type="input"
            />
          </div>
        </div>
        <div class="inquiry__block">
          <h2 class="inquiry__subTitle">
            {{ $t('inquiry.subTitle2') }}<span>{{ $t('inquiry.required') }}</span>
          </h2>
          <div class="inquiry__inputBlock">
            <input
              v-model="inquiryMail"
              value=""
              type="text"
              :class="[
                'inquiry__inputText',
                { inValid: isDirty.inquiryMail && params.inquiryMail.$anyInvalid },
              ]"
              data-style="mail"
            />
            <Error
              v-if="isDirty.inquiryMail && params.inquiryMail.format.$invalid"
              :message="params.inquiryMail.format.$message"
              type="input"
            />
          </div>
        </div>
        <div class="inquiry__block">
          <h4 class="inquiry__subTitle">
            {{ $t('inquiry.subTitle3') }}<span>{{ $t('postWork.required') }}</span>
          </h4>
          <div class="inquiry__inputBlock">
            <input
              v-model="inquiryMailConfirm"
              value=""
              type="text"
              :class="[
                'inquiry__inputText',
                { inValid: isDirty.inquiryMailConfirm && params.inquiryMailConfirm.match.$invalid },
              ]"
              data-style="mail"
            />
            <Error
              v-if="isDirty.inquiryMailConfirm && params.inquiryMailConfirm.match.$invalid"
              :message="params.inquiryMailConfirm.match.$message"
              type="input"
            />
          </div>
        </div>
        <div class="inquiry__block">
          <h2 class="inquiry__subTitle">
            {{ $t('inquiry.subTitle4') }}<span>{{ $t('inquiry.required') }}</span>
          </h2>
          <ul class="inquiry__attentionList">
            <li class="inquiry__attentionListParts">{{ $t('inquiry.attention2') }}</li>
          </ul>
          <div class="inquiry__inputBlock">
            <input
              v-model="inquirySubject"
              value=""
              type="text"
              :class="[
                'inquiry__inputText',
                { inValid: isDirty.inquirySubject && params.inquirySubject.$anyInvalid },
              ]"
              data-style="subject"
            />
            <Error
              v-if="isDirty.inquirySubject && params.inquirySubject.format.$invalid"
              :message="params.inquirySubject.format.$message"
              type="input"
            />
          </div>
        </div>
        <div class="inquiry__block">
          <h2 class="inquiry__subTitle">
            {{ $t('inquiry.subTitle5') }}<span>{{ $t('inquiry.required') }}</span>
          </h2>
          <ul class="inquiry__attentionList">
            <li class="inquiry__attentionListParts">{{ $t('inquiry.attention3') }}</li>
          </ul>
          <div class="inquiry__inputBlock">
            <textarea
              v-model="inquiryContent"
              type="text"
              :class="[
                'inquiry__textarea',
                { inValid: isDirty.inquiryContent && params.inquiryContent.$anyInvalid },
              ]"
            />
            <Error
              v-if="isDirty.inquiryContent && params.inquiryContent.format.$invalid"
              :message="params.inquiryContent.format.$message"
              type="inquiry"
            />
          </div>
        </div>
        <div class="inquiry__agreeCheck">
          <input id="agree" v-model="isAgree" type="checkbox" /><label for="agree" />{{
            $t('inquiry.subTitle6')
          }}
        </div>
        <p class="inquiry__caption">{{ $t('inquiry.caption1') }}</p>
        <div class="inquiry__sendButtonArea">
          <button
            class="inquiry__sendButton"
            :disabled="
              inquiryName === '' ||
              inquiryMail === '' ||
              inquiryMailConfirm === '' ||
              inquirySubject === '' ||
              inquiryContent === '' ||
              !isAgree
            "
            @click="sendInquiry"
          >
            {{ $t('inquiry.send') }}
          </button>
        </div>
      </div>
      <div v-if="isSended">
        <p class="inquiry__sendedCaption">{{ $t('inquiry.caption2') }}</p>
        <p class="inquiry__sendedCaption">{{ $t('inquiry.caption3') }}</p>
        <div class="inquiry__link">
          <nuxt-link to="/" class="error__link">{{ $t('inquiry.link') }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, useMeta } from '@nuxtjs/composition-api'
import { InquiryKey } from '@/compositions/key/inquiryKey'
import { InquiryStore } from '@/compositions/inquiry'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  components: {
    Error,
  },
  setup() {
    /** composition-api **/
    const { meta, title } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const {
      isDevelop,
      inquiryName,
      inquiryMail,
      inquiryMailConfirm,
      inquirySubject,
      inquiryContent,
      isAgree,
      isSended,
      isDirty,
      params,
      sendInquiry,
    } = inject(InquiryKey) as InquiryStore
    /** /Inject **/

    /** LifeCycle **/
    onMounted(() => {
      isDevelop.value = !!window.location.href.match(/development|localhost/)
    })
    onUnmounted(() => {
      isSended.value = false
    })
    /** /LifeCycle **/

    /** Meta **/
    title.value = 'Pixageへのお問い合わせ'
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: 'Pixageへのお問い合わせはこちらから',
      },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'Pixageへのお問い合わせ' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Pixageへのお問い合わせはこちらから',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/inquiry' },
      { hid: 'og:image', property: 'og:image', content: 'https://pixage.app/icon.png' },
    ]
    /** /Meta **/

    return {
      inquiryName,
      inquiryMail,
      inquiryMailConfirm,
      inquirySubject,
      inquiryContent,
      isAgree,
      isSended,
      isDirty,
      params,
      sendInquiry,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.inquiry {
  &__title {
    margin-bottom: 16px;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__body {
    position: relative;
  }
  &__block {
    margin-bottom: 32px;
    position: relative;
  }
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.8rem;
    color: $font-color-white;
    font-weight: bold;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
      font-weight: normal;
    }
  }
  &__attentionList {
    margin: 8px 8px 0 8px;
    padding-left: 1.2rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__inputBlock {
    align-items: center;
    position: relative;
    &[data-style='collaboratorBlock'] {
      margin-top: 4px;
    }
  }
  &__textAreaBlock {
    margin: 8px 0 0 8px;
    padding-bottom: 8px;
    align-items: center;
    position: relative;
  }
  &__inputText {
    padding: 4px;
    height: 40px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__textarea {
    padding: 8px 4px;
    width: 100%;
    height: 300px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    resize: none;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__sendButtonArea {
    padding: 16px 0;
  }
  &__sendButton {
    margin: 0 auto;
    height: 40px;
    color: $font-color-darkgray;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $button-color-metal-border;
    background: $button-color-metal-bg;
    box-shadow: inset 1px 1px 1px $glow-color;
    &:disabled {
      opacity: 0.6;
    }
  }
  &__agreeCheck {
    padding: 8px 0 24px;
    color: $font-color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin: 0 8px;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
      background: $background-color-white;
    }
    input[type='checkbox']:checked + label:after {
      width: 10px;
      height: 16px;
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      border-right: $border-color-gray solid 3px;
      border-bottom: $border-color-gray solid 3px;
      transform: rotate(45deg);
    }
  }
  &__caption {
    margin-bottom: 16px;
    text-align: center;
  }
  &__sendedCaption {
    margin-bottom: 16px;
  }
  &__link {
    margin-top: 64px;
    text-align: center;
    a {
      text-decoration: underline;
    }
  }
}
.pc {
  .inquiry {
    &__title {
      font-size: 2.4rem;
    }
    &__body {
      margin: 0 auto;
      width: 800px;
    }
    &__inputText {
      &[data-style='name'],
      &[data-style='subject'] {
        width: 480px;
      }
      &[data-style='mail'] {
        width: 400px;
      }
    }
    &__sendButton {
      width: 200px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__link {
      a:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .inquiry {
    &__title {
      margin-bottom: 16px;
      font-size: 1.5rem;
    }
    &__body {
      margin: 0 16px;
    }
    &__inputText {
      width: 100%;
    }
    &__sendButton {
      width: 100%;
      &:active {
        opacity: 0.6;
      }
    }
    &__link {
      a:active {
        text-decoration: none;
      }
    }
  }
}
</style>
