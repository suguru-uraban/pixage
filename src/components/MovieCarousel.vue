<!--<template>
  <div class="movieCaroucel">
    <swiper class="movieCaroucel__swiper" :options="swiperOption">
      <swiper-slide v-for="data in movieData" :key="data.id" class="movieCaroucel__slide">
        <nuxt-link :to="`movie/${data.id}`">
          <img :src="require(`@/dummy/images/${data.image}`)" :alt="data.title" />
        </nuxt-link>
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination"></div>
    </swiper>
  </div>
</template>-->

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const swiperOption = reactive({
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    })

    return {
      swiperOption,
    }
  },
})
</script>

<style lang="scss" scoped>
.pc {
  .movieCaroucel {
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    height: 302px;
    &__swiper {
      width: 100%;
      height: 100%;
    }
    &__slide {
      width: 480px;
      height: 270px;
    }
  }
}
.sp {
  .movieCaroucel {
    margin: 0 auto;
    padding-top: calc(56.25% + 32px);
    width: 100%;
    position: relative;
    &__swiper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    &__slide {
      width: 100%;
      a {
        display: block;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
.swiper-container {
  padding-bottom: 32px;
}
.swiper-pagination {
  /deep/ .swiper-pagination-bullet {
    background-color: $font-color-white;
    opacity: 0.3;
  }
  /deep/ .swiper-pagination-bullet.swiper-pagination-bullet-active {
    opacity: 1;
  }
}
</style>
