<template>
  <footer class="footer">
    <img src="@/assets/images/logo_gray.svg" alt="Pixage" :width="width" :height="height" />
    <ul class="footer__menu">
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/inquiry" class="footer__menuLink">{{ $t('footer.inquiry') }}</nuxt-link>
      </li>
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/privacy-policy" class="footer__menuLink">{{
          $t('footer.privacyPolicy')
        }}</nuxt-link>
      </li>
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/terms" class="footer__menuLink">{{ $t('footer.terms') }}</nuxt-link>
      </li>
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/tokushoho" class="footer__menuLink">{{ $t('footer.tokushoho') }}</nuxt-link>
      </li>
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/faq" class="footer__menuLink">{{ $t('footer.faq') }}</nuxt-link>
      </li>
      <li class="footer__menuParts" @click="closeMenuSp">
        <nuxt-link to="/company" class="footer__menuLink">{{ $t('footer.company') }}</nuxt-link>
      </li>
      <li
        v-if="state.role.value === 'admin' || state.role.value === 'staff'"
        :class="['footer__menuParts', 'admin']"
      >
        <nuxt-link to="/admin" class="footer__menuLink">{{ $t('footer.admin') }}</nuxt-link>
      </li>
    </ul>
    <p class="footer__copyright">&copy; 2022 Pixage Inc.</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import { MenuKey } from '@/compositions/key/menuKey'
import { MenuStore } from '@/compositions/menu'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  props: {
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    /** /composition-api **/

    /** Inject **/
    const state = injectGlobalState()
    const { handleOpenMenu } = inject(MenuKey) as MenuStore
    /** /Inject **/

    /** Function **/
    // SPではタップするとメニューが消える
    const closeMenuSp = () => {
      if (!app.$device.isDesktop) {
        handleOpenMenu()
      }
    }
    /** /Function **/

    return {
      state,
      closeMenuSp,
    }
  },
})
</script>

<style lang="scss" scoped>
.footer {
  margin: 0 auto;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  &__menu {
    width: 100%;
    margin-top: 24px;
    display: flex;
  }
  &__menuParts {
    position: relative;
  }
  &__menuLink {
    font-size: 1.4rem;
    color: $font-color-white;
  }
  &__copyright {
    margin-top: 24px;
    font-size: 1.2rem;
    color: $font-color-lightgray;
  }
}
.pc {
  .footer {
    padding: 24px;
    &__menu {
      justify-content: center;
    }
    &__menuParts {
      padding-right: 20px;
      height: 20px;
      &:after {
        width: 20px;
        height: 20px;
        content: '・';
        color: $font-color-lightgray;
        display: block;
        position: absolute;
        top: 0;
        right: 0;
      }
      &:nth-last-of-type(1) {
        padding: 0;
        &:after {
          content: none;
        }
      }
      a {
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}
.sp {
  .footer {
    padding: 24px 0;
    height: calc(332px + env(safe-area-inset-bottom));
    &__menu {
      text-align: left;
      flex-direction: column;
      border-top: $border-color-lightgray solid 1px;
    }
    &__menuParts {
      border-bottom: $border-color-lightgray solid 1px;
      a {
        padding: 0 16px;
        height: 40px;
        display: flex;
        align-items: center;
        &:active {
          background: $background-color-lightgray-opacity;
        }
      }
    }
    .admin {
      display: none;
    }
  }
}
</style>
