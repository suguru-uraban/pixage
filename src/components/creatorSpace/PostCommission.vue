<template>
  <div class="postCommission">
    <div v-if="isCompleted" class="postCommission__completed">
      <p class="postCommission__completedCaptionUpper">{{ $t('postCommission.completed1') }}</p>
      <p class="postCommission__completedCaptionLower">{{ $t('postCommission.completed2') }}</p>
      <p class="postCommission__completedCaptionLower">{{ $t('postCommission.completed3') }}</p>
      <p class="postCommission__completedCaptionLower">{{ $t('postCommission.completed4') }}</p>
    </div>
    <div v-if="!isCompleted">
      <p class="postCommission__caption">
        {{ $t('postCommission.caption1') }}
      </p>
      <p class="postCommission__caption">
        {{ $t('postCommission.caption2') }}
      </p>
      <p class="postCommission__caption">
        {{ $t('postCommission.caption4') }}
      </p>
      <div class="postCommission__block">
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle7')
            }}<span v-if="!hasEmail">{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention7_1') }}
              </li>
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention7_2') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <input
              v-model="email"
              value=""
              type="text"
              :placeholder="$t('postCommission.placeholder7')"
              :disabled="hasEmail"
              :class="[
                'postCommission__inputText',
                { inValid: isDirty.email && params.email.$anyInvalid },
              ]"
              data-style="email"
            />
            <Error
              v-if="isDirty.email && params.email.required.$invalid"
              :message="params.email.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.email && params.email.format.$invalid"
              :message="params.email.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle1') }}<span>{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention1_1') }}
              </li>
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention1_2') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <input
              v-model="commissionTitle"
              value=""
              type="text"
              :placeholder="$t('postCommission.placeholder1')"
              :class="[
                'postCommission__inputText',
                { inValid: isDirty.commissionTitle && params.commissionTitle.$anyInvalid },
              ]"
              data-style="title"
            />
            <Error
              v-if="isDirty.commissionTitle && params.commissionTitle.required.$invalid"
              :message="params.commissionTitle.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.commissionTitle && params.commissionTitle.format.$invalid"
              :message="params.commissionTitle.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle2') }}<span>{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention2_1') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <div class="postCommission__inputBlock">
              <div
                :class="[
                  'postCommission__select',
                  { inValid: isDirty.commissionType && params.commissionType.$anyInvalid },
                ]"
                data-style="collaborator"
              >
                <select v-model="commissionType">
                  <option value="" selected hidden>
                    {{ $t('postCommission.placeholder2_1') }}
                  </option>
                  <option value="comic">{{ $t('postCommission.placeholder2_2') }}</option>
                  <option value="illust">{{ $t('postCommission.placeholder2_3') }}</option>
                  <option value="cosplay">{{ $t('postCommission.placeholder2_4') }}</option>
                  <option value="anime">{{ $t('postCommission.placeholder2_5') }}</option>
                </select>
              </div>
            </div>
            <Error
              v-if="isDirty.commissionType && params.commissionType.required.$invalid"
              :message="params.commissionType.required.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle3') }}<span>{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention3_1') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <input
              v-model="commissionPrice"
              value=""
              type="number"
              :placeholder="$t('postCommission.placeholder3')"
              :class="[
                'postCommission__inputText',
                { inValid: isDirty.commissionPrice && params.commissionPrice.$anyInvalid },
              ]"
              data-style="commissionPrice"
            />
            <Error
              v-if="isDirty.commissionPrice && params.commissionPrice.required.$invalid"
              :message="params.commissionPrice.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.commissionPrice && params.commissionPrice.format.$invalid"
              :message="params.commissionPrice.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle4') }}<span>{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention4_1') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <textarea
              v-model="commissionDescription"
              value=""
              :class="[
                'postCommission__textarea',
                {
                  inValid:
                    isDirty.commissionDescription && params.commissionDescription.$anyInvalid,
                },
              ]"
            ></textarea>
            <TextCount :text="commissionDescription" :max="2000" layout="default" />
            <Error
              v-if="isDirty.commissionDescription && params.commissionDescription.required.$invalid"
              :message="params.commissionDescription.required.$message"
              type="commissionDescription"
            />
            <Error
              v-if="isDirty.commissionDescription && params.commissionDescription.format.$invalid"
              :message="params.commissionDescription.format.$message"
              type="commissionDescription"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommission.subTitle6') }}<span>{{ $t('postCommission.required') }}</span>
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention6_1') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput">
            <input
              v-model="workPeriod"
              value=""
              type="number"
              :placeholder="$t('postCommission.placeholder6')"
              :class="[
                'postCommission__inputText',
                { inValid: isDirty.workPeriod && params.workPeriod.$anyInvalid },
              ]"
              data-style="workPeriod"
            />
            <Error
              v-if="isDirty.workPeriod && params.workPeriod.required.$invalid"
              :message="params.workPeriod.required.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dd class="postCommission__infoInput">
            <div class="postCommission__check">
              <input
                id="acceptDetail"
                v-model="acceptDetail"
                type="checkbox"
                name="acceptDetail"
              /><label for="acceptDetail" />{{ $t('postCommission.subTitle5') }}
            </div>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommission.attention5_1') }}
              </li>
            </ul>
          </dd>
        </dl>
        <dl class="postCommission__infoBlock">
          <dt class="postCommission__infoTitle">
            {{ $t('postCommissionImages.title') }}
          </dt>
          <dd>
            <ul class="postCommission__attentionList">
              <li class="postCommission__attentionListParts">
                {{ $t('postCommissionImages.attention1') }}
              </li>
              <li class="postCommission__attentionListParts">
                {{ $t('postCommissionImages.attention2') }}
              </li>
              <li class="postCommission__attentionListParts">
                {{ $t('postCommissionImages.attention3') }}
              </li>
              <li class="postCommission__attentionListParts">
                {{ $t('postCommissionImages.attention4') }}
              </li>
            </ul>
          </dd>
          <dd class="postCommission__infoInput image">
            <UploadImages
              ref="myVueUploadDropImagesRef"
              :upload-msg="$t('postCommissionImages.uploadMsg')"
              :clear-all="$t('postCommissionImages.clearAll')"
              @changed="handleImage"
            />
            <div class="postCommission__error">{{ imageFilesErrorMessage }}</div>
          </dd>
        </dl>
      </div>
      <div class="postCommission__sendButtonArea">
        <button
          class="postCommission__sendButton"
          :disabled="processing"
          @click="clickPostCommission"
        >
          {{ $t('postCommission.send') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@nuxtjs/composition-api'
import { CreatorSpaceKey } from '@/compositions/key/creatorSpaceKey'
import { CreatorSpaceStore } from '@/compositions/creatorSpace'
import { PostCommissionKey } from '@/compositions/key/postCommissionKey'
import { PostCommissionStore } from '@/compositions/postCommission'
import { EditCommissionListKey } from '@/compositions/key/editCommissionListKey'
import { EditCommissionListStore } from '@/compositions/editCommissionList'
import Error from '@/components/shared/Error.vue'
import TextCount from '@/components/shared/TextCount.vue'

export default defineComponent({
  components: {
    Error,
    TextCount,
  },
  setup() {
    /** Inject **/
    const { checkCommissionLimit } = inject(CreatorSpaceKey) as CreatorSpaceStore
    const {
      isDevelop,
      processing,
      email,
      hasEmail,
      creatorId,
      commissionTitle,
      commissionType,
      commissionPrice,
      commissionDescription,
      workPeriod,
      acceptDetail,
      imageFilesErrorMessage,
      isCompleted,
      myVueUploadDropImagesRef,
      isDirty,
      params,
      initPostCommission,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickSendPostCommission,
      handleImage,
    } = inject(PostCommissionKey) as PostCommissionStore
    const { initEditCommissionList } = inject(EditCommissionListKey) as EditCommissionListStore
    /** /Inject **/

    /** Created **/
    // コミッション作成を初期化する関数を呼び出し
    initPostCommission()
    /** /Created **/

    /** LifeCycle **/
    onMounted(() => {
      isDevelop.value = !!window.location.href.match(/development|localhost/)
      isCompleted.value = false
    })
    /** /LifeCycle **/

    /** Function **/
    const clickPostCommission = () => {
      clickSendPostCommission().then(() => {
        initEditCommissionList(creatorId.value)
        checkCommissionLimit()
      })
    }
    /** /Function **/

    return {
      processing,
      email,
      hasEmail,
      commissionTitle,
      commissionType,
      commissionPrice,
      commissionDescription,
      workPeriod,
      acceptDetail,
      imageFilesErrorMessage,
      isCompleted,
      myVueUploadDropImagesRef,
      isDirty,
      params,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickPostCommission,
      handleImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.postCommission {
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
  &__infoInput {
    margin-top: 4px;
    padding: 0 8px 16px 0;
    position: relative;
    &.image {
      padding: 0 8px 0 0;
      color: $font-color-black;
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
    &:disabled {
      border: $border-color-gray solid 1px;
      background: $border-color-lightgray;
    }
  }
  &__textarea {
    padding: 4px;
    width: 100%;
    height: 600px;
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
  &__select {
    margin-right: 8px;
    width: 168px;
    position: relative;
    &:after {
      margin: auto;
      width: 0;
      height: 0;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      border-style: solid;
      border-width: 10px 8px 0 8px;
      border-color: $border-color-gray transparent transparent transparent;
      pointer-events: none;
    }
    select {
      padding: 8px 4px;
      width: 100%;
      font-size: 1.6rem;
      color: $font-color-darkgray;
      border-radius: 4px;
      border: $border-color-gray solid 1px;
      background: $background-color-white;
      &:disabled {
        border: $border-color-gray solid 1px;
        background: $border-color-lightgray;
      }
      &:hidden {
        opacity: 0.6;
      }
    }
    &.inValid {
      select {
        border: $border-color-red solid 1px;
        background: $background-color-pink;
      }
    }
  }
  &__check {
    padding: 8px 0;
    color: $font-color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin: 0 8px;
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
  &__completed {
    width: 100%;
  }
  &__completedCaptionUpper {
    margin-bottom: 16px;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
  }
  &__completedCaptionLower {
    font-size: 1.4rem;
    line-height: 1.6;
  }
  &__error {
    height: 14px;
    margin: 8px 0 16px;
    color: $font-color-red;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.pc {
  .postCommission {
    &__inputText {
      &[data-style='title'] {
        width: 100%;
      }
      &[data-style='email'] {
        width: 400px;
      }
      &[data-style='workPeriod'] {
        width: 200px;
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
  .postCommission {
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
