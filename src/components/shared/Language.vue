<template>
  <div class="language">
    <dl class="language__current">
      <dt class="language__currentTitle">
        <span class="language__currentTitleIcon"
          ><font-awesome-icon :icon="['fas', 'globe']" /></span
        >Language：
      </dt>
      <dd class="language__currentLang" @click="handleOpenLangMenu">
        {{ currentLang
        }}<span class="language__currentLangIcon"
          ><font-awesome-icon :icon="['fas', 'caret-down']"
        /></span>
      </dd>
    </dl>
    <transition name="fade">
      <ul v-if="isOpenLangMenu" class="language__list">
        <li
          v-for="locale in locales"
          :key="locale.id"
          :class="['language__listParts', { active: currentLang === locale.name }]"
          @click="handleLangChangeMobile(locale)"
        >
          <span class="language__listPartsIcon">
            <font-awesome-icon v-if="currentLang === locale.name" :icon="['fas', 'check']" /></span
          >{{ locale.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@nuxtjs/composition-api'
import { useChangeLang } from '@/compositions/lang'

export default defineComponent({
  setup(_, ctx: SetupContext) {
    /** composition-api **/
    const { isOpenLangMenu, locales, currentLang, handleOpenLangMenu, handleLangChange } =
      useChangeLang()
    /** /composition-api **/

    /** Function **/
    // SP用の言語変更
    const handleLangChangeMobile = (locale: { lang: string; name: string }) => {
      handleLangChange(locale)
      ctx.emit('close-menu')
    }
    /** /Function **/

    return {
      isOpenLangMenu,
      locales,
      currentLang,
      handleOpenLangMenu,
      handleLangChangeMobile,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.language {
  flex: 1;
  position: relative;
  &__current {
    padding: 10px 32px 10px 0;
    display: flex;
  }
  &__currentTitle {
    color: $font-color-white;
    line-height: 20px;
    font-weight: normal;
    background-size: 16px;
  }
  &__currentTitleIcon {
    margin-right: 8px;
  }
  &__currentLang {
    color: $font-color-white;
    line-height: 20px;
    cursor: pointer;
  }
  &__list {
    padding: 16px;
    position: absolute;
    border-radius: 2px;
    box-shadow: 2px 2px 4px $shadow-color;
    &.isOpen {
      display: block;
    }
  }
  &__listParts {
    color: $font-color-lightgray;
    cursor: pointer;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
  &__listPartsIcon {
    width: 20px;
    height: 16px;
    font-size: 1.6rem;
    display: inline-block;
  }
}
.pc {
  .language {
    min-width: 240px;
    &__current {
      padding: 10px 32px 10px 0;
      justify-content: flex-end;
    }
    &__currentTitle {
      font-size: 1.6rem;
    }
    &__currentLang {
      padding-right: 16px;
      font-size: 1.6rem;
    }
    &__currentLangIcon {
      margin-left: 8px;
    }
    &__list {
      top: 32px;
      right: 40px;
      background: $background-color-gray-opacity;
    }
    &__listParts {
      margin-bottom: 8px;
      font-size: 1.6rem;
      &.active,
      &:hover {
        color: $font-color-white;
      }
    }
  }
}
.sp {
  .language {
    &__current {
      padding: 16px 32px 0 0;
    }
    &__currentTitle {
      padding: 16px 0;
      font-size: 2rem;
    }
    &__currentTitleIcon {
      margin-right: 8px;
      width: 20px;
      font-size: 2rem;
      display: inline-block;
      text-align: center;
    }
    &__currentLang {
      padding: 16px 16px 16px 0;
      font-size: 2rem;
    }
    &__currentLangIcon {
      margin-left: 4px;
      width: 20px;
      font-size: 2rem;
      display: inline-block;
      text-align: center;
    }
    &__list {
      width: 60%;
      top: 64px;
      left: 24px;
      background: $background-color-darkgray-opacity;
    }
    &__listParts {
      padding: 16px 0;
      font-size: 2rem;
      &.active {
        color: $font-color-white;
      }
    }
  }
}
</style>
