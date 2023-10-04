<template>
  <div class="pr">
    <p class="pr__caption">
      {{ $t('pr.caption') }}
    </p>
    <div class="pr__block">
      <dl class="pr__infoBlock">
        <dd>
          <ul class="pr__attentionList">
            <li class="pr__attentionListParts">
              {{ $t('pr.attention1') }}
            </li>
          </ul>
        </dd>
        <dd class="pr__infoInput">
          <textarea
            v-model="pr"
            value=""
            :class="['pr__inputText', { inValid: isDirty.pr && params.pr.$anyInvalid }]"
          ></textarea>
          <TextCount :text="pr" :max="250" layout="default" />
          <Error
            v-if="isDirty.pr && params.pr.format.$invalid"
            :message="params.pr.format.$message"
            type="prArea"
          />
        </dd>
      </dl>
    </div>
    <div class="pr__sendButtonArea">
      <button v-if="!isUpdate" class="pr__sendButton" :disabled="processing" @click="clickSendPr">
        {{ $t('pr.send') }}
      </button>
      <div v-if="isUpdate" class="pr__isUpdate">{{ $t('pr.complete') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { PrKey } from '@/compositions/key/prKey'
import { PrStore } from '@/compositions/pr'
import Error from '@/components/shared/Error.vue'
import TextCount from '@/components/shared/TextCount.vue'

export default defineComponent({
  components: {
    Error,
    TextCount,
  },
  setup() {
    /** Inject **/
    const { processing, isUpdate, pr, isDirty, params, initPr, clickSendPr } = inject(
      PrKey
    ) as PrStore
    /** /Inject **/

    /** Created **/
    // PRを初期化する関数を呼び出し
    initPr()
    /** /Created **/

    return {
      processing,
      isUpdate,
      pr,
      isDirty,
      params,
      clickSendPr,
    }
  },
})
</script>

<style lang="scss" scoped>
.pr {
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: $border-color-lightgray solid 1px;
  &__block {
    margin-bottom: 24px;
  }
  &__caption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    line-height: 1.4;
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
  &__inputText {
    padding: 4px;
    width: 100%;
    height: 300px;
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
  &__infoBlock {
    margin: 16px 0 0 8px;
  }
  &__infoTitle {
    font-weight: normal;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__infoInput {
    margin-top: 4px;
    padding: 0 8px 16px 0;
    position: relative;
  }
  &__sendButtonArea {
    padding: 32px 0 16px;
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
  &__isUpdate {
    margin: 0 auto;
    height: 40px;
    color: $font-color-green;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $border-color-green;
    background: $background-color-opalGreen;
  }
}
.pc {
  .pr {
    &__sendButton {
      width: 200px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 200px;
    }
  }
}
.sp {
  .pr {
    &__sendButton {
      width: 100%;
      &:active {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 100%;
    }
  }
}
</style>
