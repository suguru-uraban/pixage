<template>
  <div id="comicPreview" class="comicPreview">
    <div
      v-show="
        $device.isDesktop
          ? activeIndex !== images.length + (images.length % 2 !== 0 ? 1 : 0)
          : activeIndex !== images.length + (images.length % 2 !== 0 ? 2 : 1)
      "
      class="comicPreview__swiperNext"
    >
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </div>
    <swiper ref="swiper" class="comicPreview__swiper" :options="swiperOption" dir="rtl">
      <swiper-slide class="comicPreview__slideAd">
        <img src="@/assets/images/logo_black.svg" alt="Pixage" class="comicPreview__slideLogo" />
        <div v-if="$device.isDesktop" class="comicPreview__slideBottom" />
      </swiper-slide>
      <swiper-slide
        v-for="(image, index) in images"
        :key="index"
        class="comicPreview__slide"
        :style="{ 'background-image': `url(${image})` }"
        @click.right.prevent
      >
        <div v-if="$device.isDesktop" class="comicPreview__slideBottom">
          <button class="comicPreview__zoomButton" @click="handleZoom(125, image)">
            <font-awesome-icon :icon="['fas', 'search-plus']" />125%
          </button>
          <button class="comicPreview__zoomButton" @click="handleZoom(150, image)">
            <font-awesome-icon :icon="['fas', 'search-plus']" />150%
          </button>
          <button class="comicPreview__zoomButton" @click="handleZoom(200, image)">
            <font-awesome-icon :icon="['fas', 'search-plus']" />200%
          </button>
        </div>
      </swiper-slide>
      <swiper-slide v-if="images.length % 2 !== 0" class="comicPreview__slideAd">
        <img src="@/assets/images/logo_black.svg" alt="Pixage" class="comicPreview__slideLogo" />
        <div v-if="$device.isDesktop" class="comicPreview__slideBottom" />
      </swiper-slide>
      <swiper-slide class="comicPreview__slideAd">
        <div v-if="userType === 'user'" class="comicPreview__slideLikeArea">
          <p class="comicPreview__slideLikeCaption">{{ $t('like.caption1') }}</p>
          <p class="comicPreview__slideLikeCaption">{{ $t('like.caption2') }}</p>
          <button v-if="!isLike" class="comicPreview__likeButton" @click="clickLike">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />
          </button>
          <div v-if="isLike" class="comicPreview__likeDone">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />
          </div>
          <p v-if="isLike" class="comicPreview__slideLikeDoneCaption">{{ $t('like.caption3') }}</p>
        </div>
        <div v-if="userType === 'admin'" class="comicPreview__slideLikeArea">
          <div class="comicPreview__slideLikeInnerAdmin">
            <p>いいねエリア</p>
          </div>
        </div>
        <div v-if="$device.isDesktop" class="comicPreview__slideBottom" />
      </swiper-slide>
    </swiper>
    <div v-show="activeIndex !== 0" class="comicPreview__swiperPrev">
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </div>
    <button v-if="isZoom === null" class="comicPreview__previewClose" @click="close">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>
    <div v-if="isZoom !== null" class="comicPreview__zoomArea">
      <div v-dragscroll class="comicPreview__zoomBlock">
        <div
          :class="[
            'comicPreview__scrollImage',
            { small: isZoom === 125, middle: isZoom === 150, large: isZoom === 200 },
          ]"
          :style="{ 'background-image': `url(${zoomImage})` }"
        />
      </div>
      <ul class="comicPreview__zoomHandler">
        <li class="comicPreview__zoomHandlerParts">
          <button
            v-if="isZoom !== 125"
            class="comicPreview__zoomHandlerButton"
            @click="handleZoom(125, zoomImage)"
          >
            <font-awesome-icon :icon="['fas', 'search-plus']" />125%
          </button>
          <div v-if="isZoom === 125" class="comicPreview__zoomHandlerActive">
            <font-awesome-icon :icon="['fas', 'search-plus']" />125%
          </div>
        </li>
        <li class="comicPreview__zoomHandlerParts">
          <button
            v-if="isZoom !== 150"
            class="comicPreview__zoomHandlerButton"
            @click="handleZoom(150, zoomImage)"
          >
            <font-awesome-icon :icon="['fas', 'search-plus']" />150%
          </button>
          <div v-if="isZoom === 150" class="comicPreview__zoomHandlerActive">
            <font-awesome-icon :icon="['fas', 'search-plus']" />150%
          </div>
        </li>
        <li class="comicPreview__zoomHandlerParts">
          <button
            v-if="isZoom !== 200"
            class="comicPreview__zoomHandlerButton"
            @click="handleZoom(200, zoomImage)"
          >
            <font-awesome-icon :icon="['fas', 'search-plus']" />200%
          </button>
          <div v-if="isZoom === 200" class="comicPreview__zoomHandlerActive">
            <font-awesome-icon :icon="['fas', 'search-plus']" />200%
          </div>
        </li>
        <li class="comicPreview__zoomHandlerParts">
          <button class="comicPreview__zoomHandlerButton" @click="handleZoom(null, null)">
            <font-awesome-icon :icon="['fas', 'times']" />Close
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { ComicPreviewKey } from '@/compositions/key/comicPreviewKey'
import { ComicPreviewStore } from '@/compositions/comicPreview'

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    images: {
      type: Array,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    workId: {
      type: Number,
      required: true,
    },
    episodeId: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    /** composition-api **/
    const { app } = useContext()
    /** /composition-api **/

    /** Variables **/
    const currentImages = ref<string[]>([])
    const swiper = ref()
    const activeIndex = ref<number>(0)
    /** /Variables **/

    /** Inject **/
    const { isLike, isZoom, zoomImage, initComic, makeItLike, handleZoom } = inject(
      ComicPreviewKey
    ) as ComicPreviewStore
    /** /Inject **/

    /** Swiper **/
    const swiperOption = reactive({
      slidesPerView: app.$device.isDesktop ? 2 : 1,
      slidesPerGroup: app.$device.isDesktop ? 2 : 1,
      grabCursor: true,
      invert: true,
      navigation: {
        nextEl: '.comicPreview__swiperNext',
        prevEl: '.comicPreview__swiperPrev',
      },
      on: {
        slideChange: () => {
          activeIndex.value = mySwiper.value.activeIndex
        },
      },
    })
    /** /Swiper **/

    /** Created **/
    // コミックプレビューの初期化呼び出し
    initComic(props.workId, props.episodeId)
    /** /Created **/

    /** LifeCycle **/
    let mySwiper: ComputedRef<any>
    onMounted(() => {
      const comicPreview = document.getElementById('comicPreview')
      if (comicPreview) {
        disableBodyScroll(comicPreview)
      }
      mySwiper = computed(() => {
        return swiper.value?.$swiper
      })
    })

    onBeforeUnmount(() => {
      clearAllBodyScrollLocks()
    })
    /** /LifeCycle **/

    /** Function **/
    // プレビューを閉じる
    const close = () => {
      ctx.emit('preview-close')
    }

    // いいねボタンを押した後に下の画面をリロードする
    const clickLike = () => {
      makeItLike(props.workId, props.episodeId, ctx)
    }
    /** /Function **/

    return {
      currentImages,
      swiper,
      activeIndex,
      isLike,
      isZoom,
      zoomImage,
      handleZoom,
      swiperOption,
      close,
      clickLike,
    }
  },
})
</script>

<style lang="scss" scoped>
.comicPreview {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: $background-color-overlay;
  z-index: $zIndexModal;
  &__swiper {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__slide {
    margin-bottom: 40px;
    width: 100%;
    position: relative;
    background-repeat: no-repeat;
    background-size: contain;
    user-select: none;
    background-color: $background-color-white;
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &__slideBottom {
    margin: auto;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    background: $background-color-overlay;
    z-index: 2;
  }
  &__zoomButton {
    margin: 0 16px;
    width: 80px;
    height: 28px;
    color: $font-color-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row-reverse;
    border-radius: 4px;
    border: $border-color-dark solid 1px;
    &:hover {
      color: $font-color-lightgray;
      border: $border-color-lightgray solid 1px;
      background: $background-color-gray-hover;
    }
    > svg {
      margin-right: 4px;
    }
  }
  &__slideAd {
    width: 100%;
    position: relative;
    background: $background-color-white;
  }
  &__slideLikeArea {
    padding-top: 40px;
    width: 100%;
    height: 40%;
    position: relative;
  }
  &__slideLikeInnerAdmin {
    margin: 0 8px;
    width: calc(100% - 16px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: $border-color-lemon solid 2px;
    p {
      font-size: 3.2rem;
      color: $font-color-lemon;
      text-align: center;
    }
  }
  &__slideLikeCaption {
    font-size: 1.6rem;
    color: $font-color-darkgray;
    line-height: 1.6;
    font-weight: bold;
    text-align: center;
  }
  &__likeButton {
    margin: 24px auto 0;
    width: 80px;
    height: 80px;
    font-size: 3.2rem;
    color: $font-color-darkgray;
    line-height: 78px;
    text-align: center;
    display: block;
    border-radius: 50%;
    border: 1px solid $button-color-metal-border;
    background: $button-color-metal-bg;
    box-shadow: inset 1px 1px 1px $glow-color;
  }
  &__likeDone {
    margin: 24px auto 0;
    width: 80px;
    height: 80px;
    font-size: 3.2rem;
    color: $font-color-lemon;
    line-height: 78px;
    text-align: center;
    display: block;
    border-radius: 50%;
    border: $border-color-lemon solid 1px;
    background: none;
  }
  &__slideLikeDoneCaption {
    font-size: 1.6rem;
    color: $font-color-lemon;
    line-height: 1.6;
    font-weight: bold;
    text-align: center;
  }
  &__slideLogo {
    margin: auto;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__previewClose {
    width: 32px;
    height: 32px;
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1000;
    > svg {
      width: 32px;
      height: 32px;
      color: $font-color-white;
    }
  }
  &__swiperNext,
  &__swiperPrev {
    margin: auto;
    position: absolute;
    border-radius: 8px;
    background: $background-color-lightgray-opacity;
    outline: none;
    cursor: pointer;
    > svg {
      margin: auto;
      color: $font-color-gray;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  &__swiperNext {
    left: 24px;
  }
  &__swiperPrev {
    right: 24px;
  }
  &__zoomArea {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: $background-color-overlay;
    z-index: 3;
  }
  &__zoomBlock {
    margin: auto;
    width: calc(100% - 272px);
    height: calc(100% - 32px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    border: $border-color-lightgray solid 2px;
    background: $background-color-darkgray-opacity;
  }
  &__zoomHandler {
    margin: auto;
    width: 120px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 0 4px 4px 0;
    background: $background-color-gray-opacity;
  }
  &__zoomHandlerParts {
    margin: 0 auto;
    width: 112px;
    height: 40px;
  }
  &__zoomHandlerButton {
    width: 100%;
    height: 100%;
    color: $font-color-white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: $border-color-white solid 1px;
    cursor: pointer;
    &:hover {
      color: $font-color-lightgray;
      border: $border-color-lightgray solid 1px;
      background: $background-color-gray-hover;
    }
    > svg {
      margin-right: 4px;
    }
  }
  &__zoomHandlerActive {
    width: 100%;
    height: 100%;
    color: $font-color-lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    background: $background-color-gray-hover;
    > svg {
      margin-right: 4px;
    }
  }
}
.pc {
  .comicPreview {
    &__swiper {
      width: 64vw;
      height: calc(64vw / 2 * 1.415 + 40px);
    }
    &__slideLogo {
      width: 16vw;
    }
    &__swiperNext,
    &__swiperPrev {
      width: 56px;
      height: 80px;
      top: 0;
      bottom: 0;
      > svg {
        width: 32px;
        height: 32px;
      }
    }
    &__swiperNext {
      left: 24px;
    }
    &__swiperPrev {
      right: 24px;
    }
    &__scrollImage {
      background-repeat: no-repeat;
      background-size: contain;
      background-color: $background-color-white;
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
      &.small {
        width: calc(64vw * 1.25);
        height: calc((64vw * 1.25) * 1.415);
      }
      &.middle {
        width: calc(64vw * 1.5);
        height: calc((64vw * 1.5) * 1.415);
      }
      &.large {
        width: calc(64vw * 2);
        height: calc((64vw * 2) * 1.415);
      }
    }
  }
}
.sp {
  .comicPreview {
    margin: 0 auto;
    padding-top: calc(56.25% + 32px);
    width: 100%;
    &__swiper {
      width: 100vw;
      height: calc(100vw * 1.415);
    }
    &__slideLogo {
      width: 32vw;
    }
    &__swiperNext,
    &__swiperPrev {
      width: 40px;
      height: 60px;
      bottom: 16px;
      > svg {
        width: 24px;
        height: 24px;
      }
    }
    &__swiperNext {
      left: 4px;
    }
    &__swiperPrev {
      right: 4px;
    }
  }
}
</style>
