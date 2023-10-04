<template>
  <div class="editCreator">
    <div class="editCreator__selectFormArea">
      <p class="editCreator__caption">
        {{ $t('addAndEditCreator.caption1') }}
      </p>
      <ul class="editCreator__attentionList">
        <li class="editCreator__attentionListParts">
          {{ $t('addAndEditCreator.attention1') }}
        </li>
        <li class="editCreator__attentionListParts">
          {{ $t('addAndEditCreator.attention2') }}
        </li>
        <li class="editCreator__attentionListParts">
          {{ $t('addAndEditCreator.attention3') }}
        </li>
        <li class="editCreator__attentionListParts">
          {{ $t('addAndEditCreator.attention4') }}
        </li>
      </ul>
      <p class="editCreator__selectFormTitle">
        {{ $t('addAndEditCreator.subTitle1') }}
      </p>
      <p class="editCreator__selectFormCaption">
        {{ $t('addAndEditCreator.caption5') }}
      </p>
      <ul class="editCreator__selectFormWrap">
        <li
          v-for="CREATOR_COMMISSION_TYPE in CREATOR_COMMISSION_TYPES"
          :key="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
          class="editCreator__selectForm commission"
        >
          <input
            :id="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
            type="radio"
            :name="`creatorTypes_${uid}`"
            :value="CREATOR_COMMISSION_TYPE.type"
            :checked="creatorType === CREATOR_COMMISSION_TYPE.type"
            :disabled="disableChangeCreator(CREATOR_COMMISSION_TYPE.type)"
            @change="handleChangeCreatorType(CREATOR_COMMISSION_TYPE.type)"
          /><label
            :for="`${uid}_${CREATOR_COMMISSION_TYPE.type}`"
            :class="[{ isDisabled: disableChangeCreator(CREATOR_COMMISSION_TYPE.type) }]"
            >{{ $t(CREATOR_COMMISSION_TYPE.displayTranslation) }}</label
          >
        </li>
      </ul>
      <p class="editCreator__selectFormCaption">
        {{ $t('addAndEditCreator.caption6') }}
      </p>
      <ul class="editCreator__selectFormWrap">
        <li
          v-for="CREATOR_TYPE in CREATOR_TYPES"
          :key="`${uid}_${CREATOR_TYPE.type}`"
          class="editCreator__selectForm"
        >
          <input
            :id="`${uid}_${CREATOR_TYPE.type}`"
            type="radio"
            :name="`creatorTypes_${uid}`"
            :value="CREATOR_TYPE.type"
            :checked="creatorType === CREATOR_TYPE.type"
            :disabled="disableChangeCreator(CREATOR_TYPE.type)"
            @change="handleChangeCreatorType(CREATOR_TYPE.type)"
          /><label
            :for="`${uid}_${CREATOR_TYPE.type}`"
            :class="[{ isDisabled: disableChangeCreator(CREATOR_TYPE.type) }]"
            >{{ $t(CREATOR_TYPE.displayTranslation) }}</label
          >
        </li>
      </ul>
    </div>
    <div class="editCreator__selectFormArea">
      <p class="editCreator__selectFormTitle">
        {{ $t('addAndEditCreator.subTitle2') }}
      </p>
      <p class="editCreator__selectFormCaption">
        {{ $t('addAndEditCreator.caption3') }}
      </p>
      <div class="editCreator__activeCheck">
        <input
          :id="`${uid}_active`"
          type="checkbox"
          :name="`creatorTypes_${uid}`"
          :value="true"
          :checked="isActive"
          @change="handleChangeActive(!isActive)"
        /><label :for="`${uid}_active`" />{{ $t('addAndEditCreator.caption4') }}
      </div>
    </div>
    <div class="editCreator__inputButtonArea">
      <button class="editCreator__inputButton" @click="clickCommitCreatorTypeAndIsActive">
        {{ $t('addAndEditCreator.button') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AddAndEditCreatorKey } from '@/compositions/key/addAndEditCreatorKey'
import { AddAndEditCreatorStore } from '@/compositions/addAndEditCreator'

export default defineComponent({
  props: {
    uid: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const {
      CREATOR_TYPES,
      CREATOR_COMMISSION_TYPES,
      processing,
      creatorType,
      isActive,
      initCreatorTypeAndIsActive,
      disableChangeCreator,
      handleChangeCreatorType,
      handleChangeActive,
      commitCreatorTypeAndIsActive,
    } = inject(AddAndEditCreatorKey) as AddAndEditCreatorStore
    /** /Inject **/

    /** Created **/
    initCreatorTypeAndIsActive(props.uid)
    /** /Created **/

    /** Function **/
    const clickCommitCreatorTypeAndIsActive = () => {
      commitCreatorTypeAndIsActive(props.uid, ctx)
    }
    /** /Function **/

    return {
      CREATOR_TYPES,
      CREATOR_COMMISSION_TYPES,
      processing,
      creatorType,
      isActive,
      disableChangeCreator,
      handleChangeCreatorType,
      handleChangeActive,
      clickCommitCreatorTypeAndIsActive,
    }
  },
})
</script>

<style lang="scss" scoped>
.editCreator {
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: $border-color-lightgray solid 1px;
  &__inputButtonArea {
    text-align: center;
  }
  &__inputButton {
    margin: 0 auto 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  &__caption {
    padding: 0 8px;
    color: $font-color-white;
    line-height: 1.4;
  }
  &__attentionList {
    margin-bottom: 16px;
    padding-left: 2.2rem;
    text-indent: -0.1rem;
  }
  &__attentionListParts {
    margin-top: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    color: $font-color-white;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__selectFormTitle {
    margin: 0 8px;
    color: $font-color-white;
    font-weight: bold;
  }
  &__selectFormCaption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    color: $font-color-white;
  }
  &__selectFormArea {
    margin-bottom: 16px;
  }
  &__selectFormWrap {
    padding: 8px 0;
    display: flex;
    justify-content: space-around;
  }
  &__selectForm {
    width: 30%;
    height: 40px;
    input[type='radio'] {
      display: none;
    }
    label {
      width: 100%;
      height: 100%;
      color: $font-color-white;
      line-height: 38px;
      text-align: center;
      display: block;
      border-radius: 8px;
      border: $border-color-lightgray solid 1px;
      background: $font-color-darkgray;
      &.isDisabled {
        opacity: 0.4;
        cursor: default;
      }
    }
    input[type='radio']:checked + label {
      color: $font-color-black;
      background: $background-color-lightgray-opacity;
    }
    &.commission {
      width: 80%;
    }
  }
  &__activeCheck {
    padding: 8px 0;
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
}
.pc {
  .editCreator {
    &__inputButton {
      width: 300px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:hover {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .editCreator {
    &__caption {
      font-size: 1.2rem;
    }
    &__inputButton {
      width: 100%;
      font-size: 1.3rem;
      &:active {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:active {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
</style>
