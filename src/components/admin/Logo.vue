<template>
  <img src="@/assets/images/logo_black.svg" alt="Pixage" :width="width" :height="height" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

type Props = {
  width: string
  height: string
}

export default defineComponent({
  setup(props: Props) {
    /** Variables **/
    const width = ref<string>(props.width)
    const height = ref<string>(props.height)
    /** /Variables **/

    return {
      width,
      height,
    }
  },
})
</script>
