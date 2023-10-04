<template>
  <div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { env, route, app } = useContext()
    const { link, htmlAttrs, bodyAttrs } = useMeta()
    const path = computed(() => {
      return route.value.path
    })

    htmlAttrs.value = {
      lang: 'ja',
    }

    bodyAttrs.value = {
      class: app.$device.isDesktop ? 'pc' : 'sp',
      ontouchstart: '',
    }

    link.value = [
      {
        rel: 'canonical',
        href: `${env.BASE_URL}${path.value}`,
      },
    ]

    return {
      path,
    }
  },
  head: {},
})
</script>
