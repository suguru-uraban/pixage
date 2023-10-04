<template>
  <div class="official">
    <h2 class="official__subTitle">公式付与</h2>
    <ul class="official__attentionList">
      <li class="official__attentionListParts">
        Pixage公式の契約作品とする場合はチェックしてください。
      </li>
    </ul>
    <div class="official__inputBlock">
      <div class="official__check">
        <input
          id="official"
          type="checkbox"
          name="pixage_official"
          :checked="getOfficial"
          :value="getOfficial"
          @input="handleCheck($event, ctx)"
        /><label for="official" />
        <p class="official__checkCaption">公式作品にする</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  setup(props, ctx) {
    /** Inject **/
    const { handleCheck } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Computed **/
    const getOfficial = computed(() => props.value)
    /** /Computed **/

    return {
      ctx,
      handleCheck,
      getOfficial,
    }
  },
})
</script>

<style lang="scss" scoped>
.official {
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
  &__check {
    padding: 8px 0;
    display: flex;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin: auto;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
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
  &__checkCaption {
    margin-left: 8px;
    font-size: 1.6rem;
  }
}
</style>
