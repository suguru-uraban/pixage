<template>
  <div class="workList">
    <client-only>
      <ul v-if="showType === 'comics' && works.length !== 0" class="workList__sortList">
        <li
          :class="['workList__sortListParts', { current: sortType === 'workId' }]"
          @click="clickSortList(ctx, 'workId')"
        >
          {{ $t('list.sort1') }}
        </li>
        <li
          :class="['workList__sortListParts', { current: sortType === 'updatedAt' }]"
          @click="clickSortList(ctx, 'updatedAt')"
        >
          {{ $t('list.sort2') }}
        </li>
        <li
          :class="['workList__sortListParts', { current: sortType === 'popular' }]"
          @click="clickSortList(ctx, 'popular')"
        >
          {{ $t('list.sort3') }}
        </li>
      </ul>
    </client-only>
    <ul class="workList__body">
      <li v-if="works.length === 0" class="workList__caption">
        {{ showType === 'indexComics' ? $t('list.nothingTop') : '' }}
        {{ showType === 'comics' ? $t('list.nothingComic') : '' }}
        {{ showType === 'favoriteWorks' ? $t('list.nothingFavorite') : '' }}
      </li>
      <li v-for="work in works" :key="work.workId" class="workList__parts">
        <img
          v-if="work.official"
          :src="require('@/assets/images/logo_official.svg')"
          :alt="$t('list.official')"
          class="workList__official"
        />
        <nuxt-link :to="`/comic-detail/${work.workId}`">
          <img
            :src="
              work.ja.thumbnail
                ? work.ja.thumbnail
                : require('@/assets/images/thumbnail_noImage.jpg')
            "
            :alt="work.ja.title"
          />
        </nuxt-link>
      </li>
    </ul>
    <div v-if="showType === 'indexComics' && works.length > 0" class="workList__link">
      <nuxt-link to="/comics">{{ $t('list.link1') }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ListKey } from '@/compositions/key/listKey'
import { ListStore } from '@/compositions/list'

export default defineComponent({
  props: {
    showType: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { works, sortType, initIndexComics, initComics, initFavoriteWorks, clickSortList } =
      inject(ListKey) as ListStore
    /** /Inject **/

    /** Created **/
    // リストの初期化呼び出し
    if (props.showType === 'indexComics') {
      initIndexComics(ctx)
    } else if (props.showType === 'comics') {
      initComics(ctx)
    } else if (props.showType === 'favoriteWorks') {
      initFavoriteWorks(ctx)
    }
    /** /Created **/

    return {
      ctx,
      works,
      sortType,
      clickSortList,
    }
  },
})
</script>

<style lang="scss" scoped>
.workList {
  width: 100%;
  &__body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  &__sortList {
    margin-bottom: 16px;
    padding: 0 8px;
    width: 100%;
    display: flex;
  }
  &__sortListParts {
    margin-right: 8px;
    padding: 0 8px;
    height: 40px;
    line-height: 38px;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    cursor: pointer;
    &.current {
      color: $font-color-black;
      background: $background-color-lightgray-opacity;
    }
  }
  &__parts {
    padding: 0 8px 16px;
    position: relative;
    a {
      display: block;
      img {
        height: auto;
        box-shadow: 0 0 8px 0 $glow-color;
      }
    }
  }
  &__official {
    width: auto;
    position: absolute;
    left: 4px;
    z-index: 1;
  }
}
.pc {
  .workList {
    &__caption {
      padding: 0 8px;
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
    &__official {
      height: 32px;
      top: -10px;
    }
    &__link {
      padding: 0 8px;
      text-align: right;
      a {
        text-decoration: underline;
        display: inline-block;
        position: relative;
        &:before {
          content: '>>';
        }
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}
.sp {
  .workList {
    &__caption {
      padding: 0 8px;
      font-size: 1.2rem;
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
    &__official {
      height: 24px;
      top: -8px;
    }
    &__link {
      a {
        margin: 0 8px;
        height: 40px;
        line-height: 38px;
        text-align: center;
        display: block;
        position: relative;
        border-radius: 4px;
        border: $border-color-white solid 1px;
        background: $background-color-darkgray-opacity;
        &:active {
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
