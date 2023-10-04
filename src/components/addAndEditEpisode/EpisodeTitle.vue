<template>
  <div class="episodeTitle">
    <h2 class="episodeTitle__subTitle">サブタイトル</h2>
    <ul class="episodeTitle__attentionList">
      <li class="episodeTitle__attentionListParts">サブタイトルは50文字以内で入力してください。</li>
      <li class="episodeTitle__attentionListParts">
        読み切り等の場合もあるため、サブタイトルは必須ではありません
      </li>
    </ul>
    <div class="episodeTitle__inputBlock">
      <input
        :value="getEpisodeTitle"
        type="text"
        placeholder="サブタイトルを入力"
        :class="['episodeTitle__inputText', { inValid: isDirty && params.$anyInvalid }]"
        @input="handleInput($event, ctx)"
        @focus="resetInput(ctx)"
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
      default: '',
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
    const getEpisodeTitle = computed(() => props.value)
    /** /Computed **/

    return {
      ctx,
      handleInput,
      resetInput,
      getEpisodeTitle,
    }
  },
})
</script>

<style lang="scss" scoped>
.episodeTitle {
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
    width: 820px;
    padding-bottom: 16px;
    display: flex;
    position: relative;
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
  }
}
</style>
