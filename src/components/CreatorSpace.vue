<template>
  <section class="creatorSpace">
    <h3 class="creatorSpace__title">{{ $t('creatorSpace.title') }}</h3>
    <div v-if="state.isCreator.value === 'notCreator'">
      <p class="creatorSpace__caption">{{ $t('creatorSpace.caption1') }}</p>
      <p v-if="isVerified()" class="creatorSpace__caption">{{ $t('creatorSpace.caption2') }}</p>
      <p v-if="!isVerified()" class="creatorSpace__caption warning">
        {{ $t('creatorSpace.caption3') }}
      </p>
      <div class="creatorSpace__guideLineLinkWrap">
        <div class="creatorSpace__guideLineLink" @click="handleOpenModal('creatorGuideLine')">
          {{ $t('creatorSpace.guidLineLink') }}
        </div>
        <div v-if="isVerified()" class="creatorSpace__guideLineCheckArea">
          <input
            id="isAgreementGuideLine"
            v-model="isAgreementGuideLine"
            type="checkbox"
            name="isAgreementGuideLine"
          /><label for="isAgreementGuideLine" />{{ $t('creatorSpace.guidLineCheck') }}
        </div>
        <button
          v-if="isVerified()"
          class="creatorSpace__inputButton"
          :disabled="!isAgreementGuideLine"
          @click="handleOpenModal('addAndEditCreator')"
        >
          {{ $t('creatorSpace.addCreatorModalOpenButton') }}
        </button>
      </div>
    </div>
    <div v-if="state.isCreator.value !== 'notCreator'">
      <div v-if="isNotReceivableAccount" class="creatorSpace__attentionWrap">
        <p class="creatorSpace__attention">{{ $t('creatorSpace.attention1') }}</p>
        <p class="creatorSpace__attention">{{ $t('creatorSpace.attention2') }}</p>
      </div>
      <p class="creatorSpace__caption">{{ $t('creatorSpace.caption4') }}</p>
      <div class="creatorSpace__guideLineLinkWrap">
        <div
          class="creatorSpace__guideLineLink creator"
          @click="handleOpenModal('creatorGuideLine')"
        >
          {{ $t('creatorSpace.guidLineLink') }}
        </div>
      </div>
      <VsaList>
        <VsaItem>
          <VsaHeading>{{ $t('creatorSpace.contentsTitle1') }}</VsaHeading>
          <VsaContent>
            <EditCreator :uid="user.user_id" @reload="reload" />
          </VsaContent>
        </VsaItem>
        <VsaItem>
          <VsaHeading>{{ $t('creatorSpace.contentsTitle5') }}</VsaHeading>
          <VsaContent>
            <Pr />
          </VsaContent>
        </VsaItem>
        <VsaItem v-if="!isCommissionLimit">
          <VsaHeading>{{ $t('creatorSpace.contentsTitle6') }}</VsaHeading>
          <VsaContent>
            <PostCommission />
          </VsaContent>
        </VsaItem>
        <VsaItem>
          <VsaHeading>{{ $t('creatorSpace.contentsTitle7') }}</VsaHeading>
          <VsaContent>
            <EditCommissionList />
          </VsaContent>
        </VsaItem>
        <VsaItem v-if="state.isCreator.value !== 'commissionOnly'">
          <VsaHeading>{{ $t('creatorSpace.contentsTitle2') }}</VsaHeading>
          <VsaContent>
            <PostWork />
          </VsaContent>
        </VsaItem>
        <VsaItem>
          <VsaHeading>{{ $t('creatorSpace.contentsTitle3') }}</VsaHeading>
          <VsaContent>
            <ReceivableAccount />
          </VsaContent>
        </VsaItem>
        <VsaItem>
          <VsaHeading>{{ $t('creatorSpace.contentsTitle4') }}</VsaHeading>
          <VsaContent>
            <SalesConfirm />
          </VsaContent>
        </VsaItem>
      </VsaList>
    </div>
    <CreatorGuideLineModal />
    <AddAndEditCreatorModal user-type="user" :uid="user.user_id" @reload="reload" />
  </section>
</template>

<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import { firestore } from '@/plugins/firebase'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { CreatorSpaceKey } from '@/compositions/key/creatorSpaceKey'
import { CreatorSpaceStore } from '@/compositions/creatorSpace'
import CreatorGuideLineModal from '@/components/modals/creatorSpace/CreatorGuideLineModal.vue'
import AddAndEditCreatorModal from '@/components/modals/addAndEditCreator/AddAndEditCreatorModal.vue'
import EditCreator from '@/components/creatorSpace/EditCreator.vue'
import Pr from '@/components/creatorSpace/Pr.vue'
import PostCommission from '@/components/creatorSpace/PostCommission.vue'
import EditCommissionList from '@/components/creatorSpace/EditCommissionList.vue'
import PostWork from '@/components/creatorSpace/PostWork.vue'
import ReceivableAccount from '@/components/creatorSpace/ReceivableAccount.vue'
import SalesConfirm from '@/components/creatorSpace/SalesConfirm.vue'
import { injectGlobalState } from '@/utils/states/user'
import { getUserFromCookie } from '@/utils/cookieDecode'

export default defineComponent({
  components: {
    CreatorGuideLineModal,
    AddAndEditCreatorModal,
    EditCreator,
    Pr,
    PostCommission,
    EditCommissionList,
    PostWork,
    ReceivableAccount,
    SalesConfirm,
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    /** composition-api **/

    /** Variables **/
    const user = getUserFromCookie(app.$cookie.get('__session'))
    /** /Variables **/

    /** Inject **/
    const state = injectGlobalState()
    const { isVerified } = inject(AccountKey) as AccountStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      isAgreementGuideLine,
      isNotReceivableAccount,
      isCommissionLimit,
      checkReceivableAccount,
      checkCommissionLimit,
    } = inject(CreatorSpaceKey) as CreatorSpaceStore
    /** /Inject **/

    /** Created **/
    // 売り上げがあるのに口座が入力されていない場合の処理の呼び出し
    checkReceivableAccount()

    // コミッションの制限数に達した場合の処理の呼び出し
    checkCommissionLimit()
    /** /Created **/

    /** Function **/
    // 変更したらusersSecretDataをもう一度取得する
    const reload = () => {
      firestore
        .doc(`usersPublicData/${user?.user_id}`)
        .get()
        .then((res) => {
          state.isCreator.value =
            res && res.data()?.isCreator ? res.data()?.isCreator : 'notCreator'
          state.isActive.value = res && res.data()?.isActive ? res.data()?.isActive : false
          state.creatorId.value = res && res.data()?.creatorId ? res.data()?.creatorId : 0
        })
    }
    /** /Function **/

    return {
      user,
      state,
      isVerified,
      handleOpenModal,
      isAgreementGuideLine,
      isNotReceivableAccount,
      isCommissionLimit,
      reload,
    }
  },
})
</script>

<style lang="scss" scoped>
.creatorSpace {
  background: $myPage-color-opacity;
  &__title {
    font-size: 1.6rem;
    line-height: 1.6;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__caption {
    line-height: 1.6;
    &.warning {
      color: $font-color-red;
    }
  }
  &__attentionWrap {
    margin: 8px 0;
    padding: 8px;
    border: $border-color-red solid 2px;
  }
  &__attention {
    color: $font-color-red;
    line-height: 1.4;
    font-weight: bold;
  }
  &__guideLineLinkWrap {
    text-align: center;
  }
  &__guideLineLink {
    margin-bottom: 32px;
    font-weight: bold;
    text-decoration: underline;
    display: inline-block;
    cursor: pointer;
    &.creator {
      margin-bottom: 8px;
    }
  }
  &__guideLineCheckArea {
    margin-bottom: 24px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
      background: $background-color-white;
    }
    input[type='checkbox']:checked + label:after {
      width: 10px;
      height: 16px;
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      border-right: $border-color-gray solid 3px;
      border-bottom: $border-color-gray solid 3px;
      transform: rotate(45deg);
    }
  }
  &__inputButton {
    margin: 0 auto;
    height: 40px;
    color: $font-color-darkgray;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:disabled {
      opacity: 0.4;
    }
  }
}
.pc {
  .creatorSpace {
    padding: 24px;
    width: 100%;
    &__title {
      margin-bottom: 8px;
    }
    &__caption {
      margin-bottom: 4px;
    }
    &__guideLineLinkWrap {
      padding: 16px 0;
    }
    &__guideLineLink {
      &:hover {
        text-decoration: none;
      }
    }
    &__inputButton {
      width: 280px;
    }
  }
}
.sp {
  .creatorSpace {
    padding: 16px 0;
    width: 100%;
    &__title {
      margin: 0 16px 8px;
    }
    &__caption {
      margin: 0 16px 4px;
      font-size: 1.2rem;
    }
    &__guideLineLinkWrap {
      padding: 16px;
    }
    &__guideLineLink {
      &:active {
        text-decoration: none;
      }
    }
    &__inputButton {
      width: 100%;
    }
  }
}
.vsa-list {
  --vsa-max-width: 100%;
  --vsa-min-width: 100%;
  --vsa-text-color: #ffffff;
  --vsa-highlight-color: #8b96ad;
  --vsa-bg-color: #424852;
  --vsa-border-color: transparent;
  --vsa-border-width: none;
  --vsa-border-style: solid;
  --vsa-heading-padding: 1rem 1rem;
  --vsa-content-padding: 1rem 1rem;
  --vsa-default-icon-size: 0.5;
}
.vsa-item {
  border-bottom: #8b96ad solid 1px;
}
.vsa-item__trigger {
  transition: all 50ms linear !important;
}
</style>
