<template>
  <div class="episodePrice">
    <h2 class="episodePrice__subTitle">レンタル価格<span>※必須</span></h2>
    <ul class="episodePrice__attentionList">
      <li class="episodePrice__attentionListParts">
        価格は直接入力できません。Stripeとの連動になります。
      </li>
      <li class="episodePrice__attentionListParts">0が入力されている場合は無料になります。</li>
    </ul>
    <div class="episodePrice__inputBlock">
      ￥<input
        :value="getEpisodePrice"
        type="number"
        readonly
        :class="['episodePrice__inputText', { inValid: isDirty && params.$anyInvalid }]"
        @input="handleInput($event, ctx)"
        @focus="resetInput(ctx)"
      />
      <Error
        v-if="isDirty && params.$dirty && params.required.$invalid"
        :message="params.required.$message"
        type="input"
      />
      <Error
        v-if="isDirty && params.$dirty && params.format.$invalid"
        :message="params.format.$message"
        type="input"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { AddAndEditEpisodeKey } from '@/compositions/key/addAndEditEpisodeKey'
import { AddAndEditEpisodeStore } from '@/compositions/addAndEditEpisode'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  components: {
    Error,
  },
  props: {
    params: {
      type: Object,
      required: true,
    },
    isDirty: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
      default: '0',
    },
    pageType: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  setup(props, ctx) {
    /** Inject **/
    const { handleInput, resetInput } = inject(AddAndEditEpisodeKey) as AddAndEditEpisodeStore
    /** /Inject **/

    /** Computed **/
    const getEpisodePrice = computed(() => String(props.value))
    /** /Computed **/

    return {
      ctx,
      handleInput,
      resetInput,
      getEpisodePrice,
    }
  },
})
</script>

<style lang="scss" scoped>
.episodePrice {
  margin-bottom: 16px;
  padding: 0 8px;
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.6rem;
    line-height: 2;
    font-weight: bold;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__attentionList {
    padding-left: 1.2rem;
    text-indent: -1rem;
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
    width: 240px;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    position: relative;
    input {
      margin-left: 4px;
      width: 100px;
    }
  }
  &__inputText {
    padding: 4px;
    width: 100%;
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
    &[readonly] {
      background: $background-color-gray;
    }
  }
}
</style>
