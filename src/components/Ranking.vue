<!--<template>
  <section class="ranking">
    <h1 class="ranking__title">{{ $t('section.rankingTitle') }}</h1>
    <ul class="ranking__body">
      <li v-for="(data, index) in bookRanking" :key="data.id" class="ranking__parts">
        <nuxt-link :to="`${bookType}/${data.id}`">
          <div :class="['ranking__rank', rankingColors[index]]">{{ index + 1 }}</div>
          <img
            :src="require(`@/dummy/images/${$t(`${bookType}.${data.id}.image`)}`)"
            :alt="$t(`${bookType}.${data.id}.title`)"
          />
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>-->

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.ranking {
  margin: 0 auto;
  padding: 0 8px 32px;
  width: 100%;
  &__title {
    margin: 0 8px 16px;
    font-size: 2.4rem;
    color: $font-color-white;
    font-weight: bold;
  }
  &__body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  &__rank {
    width: 100%;
    font-weight: bold;
    text-align: center;
    &.first {
      color: $font-color-white;
      background: $ranking-color-first;
    }
    &.second {
      color: $font-color-white;
      background: $ranking-color-second;
    }
    &.third {
      color: $font-color-white;
      background: $ranking-color-third;
    }
    &.under {
      color: $font-color-gray;
      background: $ranking-color-under;
    }
  }
  &__parts {
    padding: 0 8px 16px;
    width: 236px;
    a {
      width: 220px;
      display: block;
      img {
        width: 220px;
        height: auto;
        box-shadow: 0 0 8px 0 $glow-color;
      }
    }
  }
}
.pc {
  .ranking {
    margin: 0 auto;
    padding: 0 8px 32px;
    max-width: 1200px;
    &__title {
      font-size: 2.4rem;
    }
    &__rank {
      height: 32px;
      font-size: 1.6rem;
      line-height: 32px;
    }
    &__parts {
      width: 236px;
      a {
        width: 220px;
        img {
          width: 220px;
        }
      }
    }
  }
}
.sp {
  .ranking {
    padding: 0 8px 16px;
    &__title {
      font-size: 1.4rem;
    }
    &__rank {
      height: 18px;
      font-size: 1.2rem;
      line-height: 18px;
    }
    &__parts {
      width: calc(100% / 3);
      a {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
