<template>
  <div class="commissionList">
    <client-only>
      <ul
        v-if="showType !== 'indexCommissions' && getViewCommission.length !== 0"
        class="commissionList__sortList"
      >
        <li
          :class="[
            'commissionList__sortListParts',
            { current: commissionSortType === 'commissionId' },
          ]"
          @click="clickSortListCommission(ctx, 'commissionId', commissionType)"
        >
          {{ $t('list.sort4') }}
        </li>
        <li
          :class="[
            'commissionList__sortListParts',
            { current: commissionSortType === 'updatedAt' },
          ]"
          @click="clickSortListCommission(ctx, 'updatedAt', commissionType)"
        >
          {{ $t('list.sort2') }}
        </li>
        <li
          :class="['commissionList__sortListParts', { current: commissionSortType === 'popular' }]"
          @click="clickSortListCommission(ctx, 'popular', commissionType)"
        >
          {{ $t('list.sort3') }}
        </li>
      </ul>
    </client-only>
    <ul class="commissionList__body">
      <li v-if="getViewCommission.length === 0" class="commissionList__caption">
        {{ $t('list.nothingCommission') }}
      </li>
      <li
        v-for="commission in getViewCommission"
        :key="commission.commissionId"
        class="commissionList__parts"
      >
        <nuxt-link :to="`/commission-detail/${commission.commissionId}`">
          <div class="commissionList__picture">
            <img
              :src="
                commission.picture
                  ? commission.picture.replace('_normal', '')
                  : require('@/assets/images/icon_default_picture.svg')
              "
              alt=""
            />
          </div>
          <div class="commissionList__titleWrap">
            <p class="commissionList__title">{{ commission.ja.commissionTitle }}</p>
            <p class="commissionList__displayName">{{ commission.displayName }}</p>
            <p class="commissionList__price">
              {{ commission.ja.currency }}{{ commission.ja.commissionPrice.toLocaleString() }}
            </p>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <div
      v-if="showType === 'indexCommissions' && getCompareCommission.length > 8"
      class="commissionList__link"
    >
      <nuxt-link :to="`/commissions-${commissionType}`"
        >{{ $t(commissionType === 'comic' ? 'list.link2' : '') }}
        {{ $t(commissionType === 'illust' ? 'list.link3' : '') }}
        {{ $t(commissionType === 'cosplay' ? 'list.link4' : '') }}
        {{ $t(commissionType === 'anime' ? 'list.link5' : '') }}</nuxt-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { ListKey } from '@/compositions/key/listKey'
import { ListStore } from '@/compositions/list'
import { CommissionType } from '@/types/commissionType'

export default defineComponent({
  props: {
    showType: {
      type: String,
      required: true,
    },
    commissionType: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const {
      commissionsComic,
      commissionsCosplay,
      commissionsAnime,
      commissionsIllust,
      commissionComicSortType,
      commissionCosplaySortType,
      commissionAnimeSortType,
      commissionIllustSortType,
      initIndexCommissions,
      initCommissionsComic,
      initCommissionsCosplay,
      initCommissionsAnime,
      initCommissionsIllust,
      clickSortListCommission,
    } = inject(ListKey) as ListStore
    /** /Inject **/

    /** Computed **/
    // ソートタイプを出し分け
    const commissionSortType = computed(() => {
      if (props.commissionType === 'comic') {
        return commissionComicSortType.value
      } else if (props.commissionType === 'illust') {
        return commissionIllustSortType.value
      } else if (props.commissionType === 'cosplay') {
        return commissionCosplaySortType.value
      } else {
        return commissionAnimeSortType.value
      }
    })

    // 表示するコミッションの一覧を整形
    const getViewCommission = computed(() => {
      if (props.showType === 'indexCommissions') {
        if (props.commissionType === 'comic') {
          return commissionsComic.value.slice(0, 8)
        } else if (props.commissionType === 'illust') {
          return commissionsIllust.value.slice(0, 8)
        } else if (props.commissionType === 'cosplay') {
          return commissionsCosplay.value.slice(0, 8)
        } else {
          return commissionsAnime.value.slice(0, 8)
        }
      } else if (props.commissionType === 'comic') {
        return commissionsComic.value
      } else if (props.commissionType === 'illust') {
        return commissionsIllust.value
      } else if (props.commissionType === 'cosplay') {
        return commissionsCosplay.value
      } else {
        return commissionsAnime.value
      }
    })

    // 比較のためのコミッション一覧
    const getCompareCommission = computed(() => {
      if (props.commissionType === 'comic') {
        return commissionsComic.value
      } else if (props.commissionType === 'illust') {
        return commissionsIllust.value
      } else if (props.commissionType === 'cosplay') {
        return commissionsCosplay.value
      } else {
        return commissionsAnime.value
      }
    })
    /** /Computed **/

    /** Created **/
    // リストの初期化呼び出し
    if (props.showType === 'indexCommissions') {
      initIndexCommissions(ctx, props.commissionType as CommissionType)
    } else if (props.commissionType === 'comic') {
      initCommissionsComic(ctx)
    } else if (props.commissionType === 'illust') {
      initCommissionsIllust(ctx)
    } else if (props.commissionType === 'cosplay') {
      initCommissionsCosplay(ctx)
    } else {
      initCommissionsAnime(ctx)
    }
    /** /Created **/

    return {
      ctx,
      clickSortListCommission,
      commissionSortType,
      getViewCommission,
      getCompareCommission,
    }
  },
})
</script>

<style lang="scss" scoped>
.commissionList {
  width: 100%;
  &__body {
    width: 100%;
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
  &__caption {
    padding: 8px 8px 0;
  }
  &__parts {
    position: relative;
    a {
      padding: 8px;
      border-radius: 4px;
      background: $background-color-darkgray-block-opacity;
      box-shadow: inset 0 0 4px 0 $glow-color;
    }
  }
  &__picture {
    padding: 2px;
    border: $border-color-gray solid 1px;
    img {
      width: 100%;
      height: 100%;
      box-shadow: 0 0 8px 0 $glow-color;
    }
  }
  &__title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &__displayName {
    color: $font-color-lighterGray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__price {
    line-height: 1;
    font-size: bold;
    text-align: center;
    border-radius: 4px;
    border: $border-color-white solid 1px;
  }
}
.pc {
  .commissionList {
    &__body {
      padding: 0 4px;
      display: flex;
      flex-wrap: wrap;
    }
    &__parts {
      margin: 0 4px 8px;
      width: calc(25% - 8px);
      a {
        height: 100%;
        display: block;
        &:hover {
          opacity: 0.6;
        }
      }
    }
    &__picture {
      margin: 0 auto 8px;
      width: 80px;
      height: 80px;
    }
    &__title {
      margin-bottom: 12px;
      height: 40px;
      font-size: 1.4rem;
      line-height: 20px;
      font-weight: bold;
    }
    &__displayName {
      font-size: 1.4rem;
    }
    &__price {
      margin-top: 8px;
      padding: 4px;
      font-size: 1.6rem;
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
  .commissionList {
    &__body {
      padding: 0 4px;
    }
    &__caption {
      font-size: 1.2rem;
    }
    &__parts {
      margin: 0 4px 8px;
      a {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        &:active {
          opacity: 0.6;
        }
      }
    }
    &__picture {
      margin-right: 8px;
      width: 50px;
      height: 50px;
    }
    &__titleWrap {
      width: calc(100% - 58px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    &__title {
      width: 100%;
      height: 36px;
      font-size: 1.2rem;
      line-height: 18px;
      font-weight: bold;
    }
    &__displayName {
      margin-top: 4px;
      width: calc(100% - 72px);
      font-size: 1.2rem;
    }
    &__price {
      margin-top: 4px;
      padding: 2px;
      width: 68px;
      font-size: 1.2rem;
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
