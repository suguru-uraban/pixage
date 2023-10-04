<template>
  <div class="genre">
    <h2 class="genre__subTitle">ジャンル<span>※必須</span></h2>
    <ul class="genre__attentionList">
      <li class="genre__attentionListParts">最も近いと思われるジャンルを一つ選択してください。</li>
    </ul>
    <div class="genre__inputBlock">
      <div :class="['genre__selectGenre', { inValid: isDirty && params.$anyInvalid }]">
        <select :value="getGenre" @input="handleInput($event, ctx)" @focus="resetInput(ctx)">
          <option hidden>選択してください</option>
          <option v-for="genre in genres" :key="genre.id">
            {{ genre.value }}
          </option>
        </select>
      </div>
      <Error
        v-if="isDirty && params.$dirty && params.required.$invalid"
        :message="params.required.$message"
        type="input"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import Error from '@/components/shared/Error.vue'
import { useGenre } from '@/compositions/genre'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'

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
    /** composition-api **/
    const { genres } = useGenre()
    /** /composition-api **/

    /** Inject **/
    const { handleInput, resetInput } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Computed **/
    const getGenre = computed(() => props.value)
    /** /Computed **/

    return {
      ctx,
      genres,
      handleInput,
      resetInput,
      getGenre,
    }
  },
})
</script>

<style lang="scss" scoped>
.genre {
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
  &__selectGenre {
    width: 300px;
    position: relative;
    &:after {
      margin: auto;
      width: 0;
      height: 0;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      border-style: solid;
      border-width: 10px 8px 0 8px;
      border-color: $border-color-gray transparent transparent transparent;
      pointer-events: none;
    }
    select {
      padding: 8px 4px;
      width: 100%;
      font-size: 1.6rem;
      color: $font-color-darkgray;
      border-radius: 4px;
      border: $border-color-gray solid 1px;
      background: $background-color-white;
    }
    &.inValid {
      select {
        border: $border-color-red solid 1px;
        background: $background-color-pink;
      }
    }
  }
}
</style>
