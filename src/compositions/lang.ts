import { reactive, ref, useContext, useMeta } from '@nuxtjs/composition-api'
import { $cookiesOptEternal } from '@/plugins/cookie'
import localeList from '@/locales/locales.json'

const useDefaultLang = () => {
  const { app } = useContext()
  const { htmlAttrs } = useMeta()
  const lang = app.$cookie.get('locale') === undefined ? 'ja' : app.$cookie.get('locale').lang

  app.i18n.setLocale(lang)
  app.i18n.fallbackLocale = lang
  htmlAttrs.value = {
    lang,
  }
}

const useChangeLang = () => {
  const { app } = useContext()
  const { htmlAttrs } = useMeta()
  const isOpenLangMenu = ref<boolean>(false)
  const locales = reactive(localeList)
  const currentLang = ref<string>(
    app.$cookie.get('locale') === undefined ? '日本語' : app.$cookie.get('locale').name
  )
  const handleOpenLangMenu = () => {
    isOpenLangMenu.value = !isOpenLangMenu.value
  }
  const handleLangChange = (locale: { lang: string; name: string }) => {
    app.$cookie.set('locale', locale, $cookiesOptEternal)
    app.i18n.setLocale(app.$cookie.get('locale').lang)
    app.i18n.fallbackLocale = app.$cookie.get('locale').lang
    htmlAttrs.value = {
      lang: app.$cookie.get('locale').lang,
    }
    currentLang.value = app.$cookie.get('locale').name
    isOpenLangMenu.value = false
  }

  return {
    isOpenLangMenu,
    locales,
    currentLang,
    handleOpenLangMenu,
    handleLangChange,
  }
}

export { useDefaultLang, useChangeLang }
