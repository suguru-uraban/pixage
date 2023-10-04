<template>
  <div class="receivableAccount">
    <p class="receivableAccount__caption">
      {{ $t('receivableAccount.attention0_1') }}
    </p>
    <p class="receivableAccount__caption">
      {{ $t('receivableAccount.attention0_2') }}
    </p>
    <p class="receivableAccount__caption">
      {{ $t('receivableAccount.attention0_3') }}
    </p>
    <div class="receivableAccount__block">
      <dl class="receivableAccount__infoBlock">
        <dt class="receivableAccount__infoTitle">
          {{ $t('receivableAccount.itemName1') }}<span>{{ $t('receivableAccount.required') }}</span>
        </dt>
        <dd>
          <ul class="receivableAccount__attentionList">
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention1_1') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention1_2') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention1_3') }}
            </li>
          </ul>
        </dd>
        <dd class="receivableAccount__infoInput">
          <input
            v-model="accountName"
            value=""
            type="text"
            :placeholder="$t('receivableAccount.placeholder1')"
            :class="[
              'receivableAccount__inputText',
              { inValid: isDirty.accountName && params.accountName.$anyInvalid },
            ]"
            data-style="accountName"
          />
          <Error
            v-if="isDirty.accountName && params.accountName.required.$invalid"
            :message="params.accountName.required.$message"
            type="input"
          />
          <Error
            v-if="isDirty.accountName && params.accountName.format.$invalid"
            :message="params.accountName.format.$message"
            type="input"
          />
        </dd>
      </dl>
      <dl class="receivableAccount__infoBlock">
        <dt class="receivableAccount__infoTitle">
          {{ $t('receivableAccount.itemName2') }}<span>{{ $t('receivableAccount.required') }}</span>
        </dt>
        <dd>
          <ul class="receivableAccount__attentionList">
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention2_1') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention2_2') }}
            </li>
          </ul>
        </dd>
        <dd class="receivableAccount__infoInput">
          <input
            v-model="financialInstitutionName"
            value=""
            type="text"
            :placeholder="$t('receivableAccount.placeholder2')"
            :class="[
              'receivableAccount__inputText',
              {
                inValid:
                  isDirty.financialInstitutionName && params.financialInstitutionName.$anyInvalid,
              },
            ]"
            data-style="financialInstitutionName"
          />
          <Error
            v-if="
              isDirty.financialInstitutionName && params.financialInstitutionName.required.$invalid
            "
            :message="params.financialInstitutionName.required.$message"
            type="input"
          />
          <Error
            v-if="
              isDirty.financialInstitutionName && params.financialInstitutionName.format.$invalid
            "
            :message="params.financialInstitutionName.format.$message"
            type="input"
          />
        </dd>
      </dl>
      <dl class="receivableAccount__infoBlock">
        <dt class="receivableAccount__infoTitle">
          {{ $t('receivableAccount.itemName3') }}<span>{{ $t('receivableAccount.required') }}</span>
        </dt>
        <dd>
          <ul class="receivableAccount__attentionList">
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention3_1') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention3_2') }}
            </li>
          </ul>
        </dd>
        <dd class="receivableAccount__infoInput">
          <input
            v-model="branchName"
            value=""
            type="text"
            :placeholder="$t('receivableAccount.placeholder3')"
            :class="[
              'receivableAccount__inputText',
              {
                inValid: isDirty.branchName && params.branchName.$anyInvalid,
              },
            ]"
            data-style="branchName"
          />
          <Error
            v-if="isDirty.branchName && params.branchName.required.$invalid"
            :message="params.branchName.required.$message"
            type="input"
          />
          <Error
            v-if="isDirty.branchName && params.branchName.format.$invalid"
            :message="params.branchName.format.$message"
            type="input"
          />
        </dd>
      </dl>
      <dl class="receivableAccount__infoBlock">
        <dt class="receivableAccount__infoTitle">
          {{ $t('receivableAccount.itemName4') }}<span>{{ $t('receivableAccount.required') }}</span>
        </dt>
        <dd>
          <ul class="receivableAccount__attentionList">
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention4_1') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention4_2') }}
            </li>
          </ul>
        </dd>
        <dd class="receivableAccount__infoInput">
          <input
            v-model="accountNumber"
            value=""
            type="text"
            :placeholder="$t('receivableAccount.placeholder4')"
            :class="[
              'receivableAccount__inputText',
              {
                inValid: isDirty.accountNumber && params.accountNumber.$anyInvalid,
              },
            ]"
            data-style="accountNumber"
          />
          <Error
            v-if="isDirty.accountNumber && params.accountNumber.required.$invalid"
            :message="params.accountNumber.required.$message"
            type="input"
          />
          <Error
            v-if="isDirty.accountNumber && params.accountNumber.format.$invalid"
            :message="params.accountNumber.format.$message"
            type="input"
          />
        </dd>
      </dl>
      <dl class="receivableAccount__infoBlock">
        <dt class="receivableAccount__infoTitle">
          {{ $t('receivableAccount.itemName5') }}<span>{{ $t('receivableAccount.required') }}</span>
        </dt>
        <dd>
          <ul class="receivableAccount__attentionList">
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention5_1') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention5_2') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention5_3') }}
            </li>
            <li class="receivableAccount__attentionListParts">
              {{ $t('receivableAccount.attention5_4') }}
            </li>
          </ul>
        </dd>
        <dd class="receivableAccount__infoInput">
          <input
            v-model="phoneNumber"
            value=""
            type="text"
            :placeholder="$t('receivableAccount.placeholder5')"
            :class="[
              'receivableAccount__inputText',
              {
                inValid: isDirty.phoneNumber && params.phoneNumber.$anyInvalid,
              },
            ]"
            data-style="phoneNumber"
          />
          <Error
            v-if="isDirty.phoneNumber && params.phoneNumber.required.$invalid"
            :message="params.phoneNumber.required.$message"
            type="input"
          />
          <Error
            v-if="isDirty.phoneNumber && params.phoneNumber.format.$invalid"
            :message="params.phoneNumber.format.$message"
            type="input"
          />
        </dd>
      </dl>
    </div>
    <div class="receivableAccount__sendButtonArea">
      <button
        v-if="!isUpdate"
        class="receivableAccount__sendButton"
        :disabled="processing"
        @click="clickSendReceivableAccount"
      >
        {{ $t('receivableAccount.send') }}
      </button>
      <div v-if="isUpdate" class="receivableAccount__isUpdate">
        {{ $t('receivableAccount.complete') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ReceivableAccountKey } from '@/compositions/key/receivableAccountKey'
import { ReceivableAccountStore } from '@/compositions/receivableAccount'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  components: {
    Error,
  },
  setup() {
    /** Inject **/
    const {
      processing,
      isUpdate,
      accountName,
      financialInstitutionName,
      branchName,
      accountNumber,
      phoneNumber,
      isDirty,
      params,
      initReceivableAccounts,
      clickSendReceivableAccount,
    } = inject(ReceivableAccountKey) as ReceivableAccountStore
    /** /Inject **/

    /** Created **/
    // 受取り口座登録を初期化する関数を呼び出し
    initReceivableAccounts()
    /** /Created **/

    return {
      processing,
      isUpdate,
      accountName,
      financialInstitutionName,
      branchName,
      accountNumber,
      phoneNumber,
      isDirty,
      params,
      clickSendReceivableAccount,
    }
  },
})
</script>

<style lang="scss" scoped>
.receivableAccount {
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: $border-color-lightgray solid 1px;
  &__block {
    margin-bottom: 24px;
  }
  &__caption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    line-height: 1.4;
  }
  &__attentionList {
    margin: 8px 8px 0 8px;
    padding-left: 1.2rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__inputText {
    padding: 4px;
    height: 40px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__infoBlock {
    margin: 16px 0 0 8px;
  }
  &__infoTitle {
    font-weight: normal;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__infoInput {
    margin-top: 4px;
    padding: 0 8px 16px 0;
    position: relative;
  }
  &__sendButtonArea {
    padding: 32px 0 16px;
  }
  &__sendButton {
    margin: 0 auto;
    height: 40px;
    color: $font-color-darkgray;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $button-color-metal-border;
    background: $button-color-metal-bg;
    box-shadow: inset 1px 1px 1px $glow-color;
    &:disabled {
      opacity: 0.6;
    }
  }
  &__isUpdate {
    margin: 0 auto;
    height: 40px;
    color: $font-color-green;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $border-color-green;
    background: $background-color-opalGreen;
  }
}
.pc {
  .receivableAccount {
    &__inputText {
      &[data-style='accountName'] {
        width: 100%;
      }
      &[data-style='financialInstitutionName'],
      &[data-style='branchName'] {
        width: 500px;
      }
      &[data-style='accountNumber'],
      &[data-style='phoneNumber'] {
        width: 280px;
      }
    }
    &__sendButton {
      width: 200px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 200px;
    }
  }
}
.sp {
  .receivableAccount {
    &__inputText {
      width: 100%;
    }
    &__sendButton {
      width: 100%;
      &:active {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 100%;
    }
  }
}
</style>
