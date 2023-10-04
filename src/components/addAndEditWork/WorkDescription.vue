<template>
  <div class="workDescription">
    <h2 class="workDescription__subTitle">作品概要<span>※必須</span></h2>
    <ul class="workDescription__attentionList">
      <li class="workDescription__attentionListParts">作品概要は250文字以内で入力してください。</li>
    </ul>
    <div class="workDescription__inputBlock">
      <textarea
        :value="getWorkDescription"
        type="text"
        placeholder="作品の概要を入力"
        :class="['workDescription__textarea', { inValid: isDirty && params.$anyInvalid }]"
        @input="handleInput($event, ctx)"
        @focus="resetInput(ctx)"
      />
      <TextCount :text="getWorkDescription" :max="250" layout="admin" />
      <Error
        v-if="isDirty && params.$dirty && params.required.$invalid"
        :message="params.required.$message"
        type="description"
      />
      <Error
        v-if="isDirty && params.$dirty && params.format.$invalid"
        :message="params.format.$message"
        type="description"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import Error from '@/components/shared/Error.vue'
import TextCount from '@/components/shared/TextCount.vue'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'

export default defineComponent({
  components: {
    Error,
    TextCount,
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
    const { handleInput, resetInput } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Computed **/
    const getWorkDescription = computed(() => props.value)
    /** /Computed **/

    return {
      ctx,
      handleInput,
      resetInput,
      getWorkDescription,
    }
  },
})
</script>

<style lang="scss" scoped>
.workDescription {
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
    position: relative;
  }
  &__textarea {
    padding: 8px 4px;
    width: 100%;
    height: 128px;
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
}
</style>
