<template>
  <div class="postWork">
    <div v-if="uploadSuccess" class="postWork__uploadSuccess">
      <p class="postWork__uploadSuccessCaptionUpper">{{ $t('postWork.uploadSuccess1') }}</p>
      <p class="postWork__uploadSuccessCaptionLower">{{ $t('postWork.uploadSuccess2') }}</p>
      <p class="postWork__uploadSuccessCaptionLower">{{ $t('postWork.uploadSuccess3') }}</p>
    </div>
    <div v-if="!uploadSuccess">
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle1') }}
        </h4>
        <p class="postWork__caption">{{ $t('postWork.caption1') }}</p>
        <div class="postWork__nameArea">
          <p class="postWork__nameBlock">{{ state.displayName.value }}</p>
          <button
            v-if="isVerified()"
            class="postWork__editButton"
            @click="handleOpenModal('displayNameEdit')"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle7') }}
        </h4>
        <p class="postWork__caption">{{ $t('postWork.caption12') }}</p>
        <ul class="postWork__attentionList">
          <li class="postWork__attentionListParts">{{ $t('postWork.attention19') }}</li>
        </ul>
        <div class="postWork__inputBlock">
          <input
            v-model="email"
            value=""
            type="text"
            :placeholder="$t('postWork.placeholder8')"
            :class="['postWork__inputText', { inValid: isDirty.email && params.email.$anyInvalid }]"
            :disabled="hasEmail"
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
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle2')
          }}<span
            v-if="
              state.isCreator.value === 'storyOnly' ||
              state.isCreator.value === 'drawingOnly' ||
              isCreatorForCollaborator !== 'notCollaborator'
            "
            >{{ $t('postWork.required') }}</span
          >
        </h4>
        <p class="postWork__caption">{{ $t('postWork.caption2') }}</p>
        <ul class="postWork__attentionList">
          <li class="postWork__attentionListParts">{{ $t('postWork.attention1') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention2') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention3') }}</li>
        </ul>
        <div v-if="state.isCreator.value === 'all'">
          <div class="postWork__inputBlock">
            <div class="postWork__select" data-style="collaborator">
              <select v-model="isCreatorForCollaborator" @change="toggleCollaborator">
                <option value="notCollaborator" selected>{{ $t('postWork.creator3') }}</option>
                <option value="storyOnly">{{ $t('postWork.creator1') }}</option>
                <option value="drawingOnly">{{ $t('postWork.creator2') }}</option>
              </select>
            </div>
          </div>
          <div
            v-if="isCreatorForCollaborator !== 'notCollaborator'"
            class="postWork__inputBlock"
            data-style="collaboratorBlock"
          >
            <input
              v-model="collaborator"
              value=""
              type="text"
              :placeholder="$t('postWork.placeholder2')"
              :class="[
                'postWork__inputText',
                {
                  inValid: isDirty.collaborator && collaboratorParams.$anyInvalid,
                },
              ]"
              data-style="collaborator"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.required.$invalid"
              :message="collaboratorParams.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.format.$invalid"
              :message="collaboratorParams.format.$message"
              type="input"
            />
          </div>
        </div>
        <div v-if="state.isCreator.value === 'storyOnly'">
          <div class="postWork__inputBlock">
            <div class="postWork__select" data-style="collaborator">
              <select disabled>
                <option value="drawingOnly" selected>{{ $t('postWork.creator2') }}</option>
              </select>
            </div>
          </div>
          <div class="postWork__inputBlock" data-style="collaboratorBlock">
            <input
              v-model="collaborator"
              value=""
              type="text"
              :placeholder="$t('postWork.placeholder2')"
              :class="[
                'postWork__inputText',
                { inValid: isDirty.collaborator && collaboratorParams.$anyInvalid },
              ]"
              data-style="collaborator"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.required.$invalid"
              :message="collaboratorParams.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.format.$invalid"
              :message="collaboratorParams.format.$message"
              type="input"
            />
          </div>
        </div>
        <div v-if="state.isCreator.value === 'drawingOnly'">
          <div class="postWork__inputBlock">
            <div class="postWork__select" data-style="collaborator">
              <select disabled>
                <option value="storyOnly" selected>{{ $t('postWork.creator1') }}</option>
              </select>
            </div>
          </div>
          <div class="postWork__inputBlock" data-style="collaboratorBlock">
            <input
              v-model="collaborator"
              value=""
              type="text"
              :placeholder="$t('postWork.placeholder2')"
              :class="[
                'postWork__inputText',
                { inValid: isDirty.collaborator && collaboratorParams.$anyInvalid },
              ]"
              data-style="collaborator"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.required.$invalid"
              :message="collaboratorParams.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.collaborator && collaboratorParams.format.$invalid"
              :message="collaboratorParams.format.$message"
              type="input"
            />
          </div>
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle3') }}
        </h4>
        <p v-if="existingWorks.length" class="postWork__caption">{{ $t('postWork.caption3') }}</p>
        <div v-if="existingWorks.length" class="postWork__workCheck">
          <input id="isExisting" type="checkbox" name="isExisting" @input="toggleWork" /><label
            for="isExisting"
          />{{ $t('postWork.caption4') }}
        </div>
        <div v-if="!isExisting" class="postWork__workInfoWrap">
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName1') }}<span>{{ $t('postWork.required') }}</span>
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention4') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <input
                v-model="workTitle"
                value=""
                type="text"
                :placeholder="$t('postWork.placeholder3')"
                :class="[
                  'postWork__inputText',
                  { inValid: isDirty.workTitle && workParams.workTitle.$anyInvalid },
                ]"
                data-style="workTitle"
              />
              <Error
                v-if="isDirty.workTitle && workParams.workTitle.required.$invalid"
                :message="workParams.workTitle.required.$message"
                type="input"
              />
              <Error
                v-if="isDirty.workTitle && workParams.workTitle.format.$invalid"
                :message="workParams.workTitle.format.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName2') }}<span>{{ $t('postWork.required') }}</span>
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention5') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention20') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <textarea
                v-model="workDescription"
                type="text"
                :placeholder="$t('postWork.placeholder4')"
                :class="[
                  'postWork__textarea',
                  {
                    inValid: isDirty.workDescription && workParams.workDescription.$anyInvalid,
                  },
                ]"
              />
              <TextCount :text="workDescription" :max="250" layout="default" />
              <Error
                v-if="isDirty.workDescription && workParams.workDescription.required.$invalid"
                :message="workParams.workDescription.required.$message"
                type="description"
              />
              <Error
                v-if="isDirty.workDescription && workParams.workDescription.format.$invalid"
                :message="workParams.workDescription.format.$message"
                type="description"
              />
            </dd>
          </dl>
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName3') }}<span>{{ $t('postWork.required') }}</span>
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention6') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <div
                :class="[
                  'postWork__select',
                  { inValid: isDirty.genre && workParams.genre.$anyInvalid },
                ]"
                data-style="genre"
              >
                <select v-model="genre">
                  <option value="" hidden>{{ $t('postWork.placeholder1') }}</option>
                  <option v-for="genreParts in genres" :key="genreParts.id">
                    {{ genreParts.value }}
                  </option>
                </select>
                <Error
                  v-if="isDirty.genre && workParams.genre.required.$invalid"
                  :message="workParams.genre.required.$message"
                  type="input"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div v-if="isExisting" class="postWork__workInfoWrap">
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName4') }}<span>{{ $t('postWork.required') }}</span>
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention7') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <div
                :class="[
                  'postWork__select',
                  {
                    inValid:
                      isDirty.selectExistingWorkTitle &&
                      workParams.selectExistingWorkTitle.$anyInvalid,
                  },
                ]"
                data-style="selectWork"
              >
                <select
                  v-model="selectExistingWorkTitle"
                  @change="choiceExistingWorkData(selectExistingWorkTitle)"
                >
                  <option value="">{{ $t('postWork.placeholder1') }}</option>
                  <option
                    v-for="(existingWork, index) in existingWorks"
                    :key="index"
                    :value="existingWork.workTitle"
                  >
                    {{ existingWork.workTitle }}
                  </option>
                </select>
                <Error
                  v-if="
                    isDirty.selectExistingWorkTitle &&
                    workParams.selectExistingWorkTitle.required.$invalid
                  "
                  :message="workParams.selectExistingWorkTitle.required.$message"
                  type="input"
                />
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle4') }}
        </h4>
        <p class="postWork__caption">{{ $t('postWork.caption5') }}</p>
        <div class="postWork__workInfoWrap">
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName5') }}<span>{{ $t('postWork.required') }}</span>
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention8') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention9') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention10') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <input
                v-model="episodeNum"
                value=""
                type="text"
                :placeholder="$t('postWork.placeholder5')"
                :class="[
                  'postWork__inputText',
                  { inValid: isDirty.episodeNum && params.episodeNum.$anyInvalid },
                ]"
                data-style="episodeNum"
              />
              <Error
                v-if="
                  isDirty.episodeNum &&
                  params.episodeNum.$dirty &&
                  params.episodeNum.required.$invalid
                "
                :message="params.episodeNum.required.$message"
                type="input"
              />
              <Error
                v-if="
                  isDirty.episodeNum &&
                  params.episodeNum.$dirty &&
                  params.episodeNum.format.$invalid
                "
                :message="params.episodeNum.format.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName6') }}
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention11') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention12') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <input
                v-model="episodeTitle"
                value=""
                type="text"
                :placeholder="$t('postWork.placeholder6')"
                :class="[
                  'postWork__inputText',
                  { inValid: isDirty.episodeTitle && params.episodeTitle.$anyInvalid },
                ]"
                data-style="episodeTitle"
              />
              <Error
                v-if="
                  isDirty.episodeTitle &&
                  params.episodeTitle.$dirty &&
                  params.episodeTitle.format.$invalid
                "
                :message="params.episodeTitle.format.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="postWork__workInfoBlock">
            <dt class="postWork__workInfoTitle">
              {{ $t('postWork.itemName7') }}
            </dt>
            <dd>
              <ul class="postWork__attentionList">
                <li class="postWork__attentionListParts">{{ $t('postWork.attention21') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention22') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention23') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention24') }}</li>
                <li class="postWork__attentionListParts">{{ $t('postWork.attention25') }}</li>
              </ul>
            </dd>
            <dd class="postWork__workInfoInput">
              <input
                v-model="episodePrice"
                value=""
                type="number"
                :placeholder="$t('postWork.placeholder9')"
                :class="[
                  'postWork__inputText',
                  { inValid: isDirty.episodePrice && params.episodePrice.$anyInvalid },
                ]"
                :disabled="canInputPrice && !isExisting"
                data-style="episodePrice"
              />
              <Error
                v-if="
                  isDirty.episodePrice &&
                  params.episodePrice.$dirty &&
                  params.episodePrice.format.$invalid
                "
                :message="params.episodePrice.format.$message"
                type="input"
              />
            </dd>
          </dl>
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle5') }}
        </h4>
        <p class="postWork__caption">{{ $t('postWork.caption6') }}</p>
        <div class="postWork__textAreaBlock">
          <textarea
            v-model="memo"
            type="text"
            :placeholder="$t('postWork.placeholder7')"
            :class="[
              'postWork__textarea memo',
              { inValid: isDirty.memo && params.memo.$anyInvalid },
            ]"
          />
          <TextCount :text="memo" :max="300" layout="default" />
          <Error
            v-if="isDirty.memo && params.memo.$dirty && params.memo.format.$invalid"
            :message="params.memo.format.$message"
            type="memo"
          />
        </div>
      </div>
      <div class="postWork__block">
        <h4 class="postWork__subTitle">
          {{ $t('postWork.subTitle6') }}<span>{{ $t('postWork.required') }}</span>
        </h4>
        <p class="postWork__caption">
          {{ $device.isDesktop ? $t('postWork.caption10') : $t('postWork.caption11') }}
        </p>
        <ul class="postWork__attentionList">
          <li class="postWork__attentionListParts">{{ $t('postWork.attention13') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention14') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention15') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention16') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention17') }}</li>
          <li class="postWork__attentionListParts">{{ $t('postWork.attention18') }}</li>
        </ul>
        <div :class="['postWork__upload', { inValid: isDirty.files && params.files.$anyInvalid }]">
          <p
            v-if="files.length === 0 && !uploadError"
            class="postWork__caption"
            data-style="upload"
          >
            {{ $device.isDesktop ? $t('postWork.caption7') : $t('postWork.caption8') }}
          </p>
          <dl v-if="files.length === 0 && uploadError" class="postWork__uploadError">
            <dt class="postWork__uploadErrorTitle">{{ $t('postWork.validateTitle') }}</dt>
            <dd class="postWork__uploadErrorCaption">{{ uploadError }}</dd>
          </dl>
          <ul v-if="files.length !== 0" class="postWork__uploadedArea">
            <li v-for="file in files" :key="file.id" class="postWork__uploadedAreaInner">
              <div class="postWork__uploadedDelete" @click="uploadDelete">
                <font-awesome-icon :icon="['fas', 'times']" />
              </div>
              <div class="postWork__uploadedIcon">
                <font-awesome-icon :icon="['fas', 'file-archive']" />
              </div>
              <p class="postWork__uploadedCaption">{{ file.name }}</p>
              <p class="postWork__uploadedCaption">
                {{ convertFileSize(file.size) }}
              </p>
            </li>
          </ul>
          <button class="postWork__inputButton">
            <FileUpload
              ref="upload"
              :value="files"
              :drop="true"
              :drop-directory="false"
              :multiple="true"
              @input="uploadValidation"
              >{{ $t('postWork.button1') }}</FileUpload
            >
          </button>
        </div>
        <Error
          v-if="isDirty.files && params.files.$dirty && params.files.required.$invalid"
          :message="params.files.required.$message"
          type="upload"
        />
      </div>
      <div
        v-if="$device.isDesktop"
        v-show="$refs.upload && $refs.upload.dropActive"
        class="postWork__dropActive"
      >
        <p class="postWork__dropActiveCaption">{{ $t('postWork.caption9') }}</p>
      </div>
      <div v-if="uploading" class="postWork__uploadProgress">
        <p class="postWork__dropActiveCaption">{{ `${progress}% ` }}</p>
        <div class="postWork__progressBar">
          <div
            class="postWork__progressBarInner"
            :style="{ width: `${(progress / 100) * 100}%` }"
          />
        </div>
      </div>
      <div class="postWork__sendButtonArea">
        <button class="postWork__sendButton" @click="clickSendPostWork(state.email.value)">
          {{ $t('postWork.send') }}
        </button>
      </div>
    </div>
    <DisplayNameEditModal />
    <EmailEditModal />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@nuxtjs/composition-api'
import { useGenre } from '@/compositions/genre'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { PostWorkKey } from '@/compositions/key/postWorkKey'
import { PostWorkStore } from '@/compositions/postWork'
import Error from '@/components/shared/Error.vue'
import TextCount from '@/components/shared/TextCount.vue'
import DisplayNameEditModal from '@/components/modals/mypage/DisplayNameEditModal.vue'
import EmailEditModal from '@/components/modals/mypage/EmailEditModal.vue'
import { injectGlobalState } from '@/utils/states/user'
import { convertFileSize } from '@/utils/util'

export default defineComponent({
  components: {
    Error,
    TextCount,
    DisplayNameEditModal,
    EmailEditModal,
  },
  setup() {
    /** composition-api **/
    const { genres } = useGenre()
    /** /composition-api **/

    /** Inject **/
    const state = injectGlobalState()
    const { isVerified } = inject(AccountKey) as AccountStore
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      isDevelop,
      uploading,
      email,
      hasEmail,
      isCreatorForCollaborator,
      collaborator,
      isExisting,
      workTitle,
      workDescription,
      genre,
      existingWorks,
      selectExistingWorkTitle,
      episodeNum,
      episodeTitle,
      episodePrice,
      canInputPrice,
      memo,
      upload,
      progress,
      files,
      uploadError,
      uploadSuccess,
      uploadFinishMessage,
      isDirty,
      params,
      collaboratorParams,
      workParams,
      initPostWorks,
      toggleCollaborator,
      toggleWork,
      choiceExistingWorkData,
      uploadValidation,
      uploadDelete,
      clickSendPostWork,
    } = inject(PostWorkKey) as PostWorkStore
    /** /Inject **/

    /** Created **/
    // 作品投稿を初期化する関数を呼び出し
    initPostWorks()
    /** /Created **/

    /** LifeCycle **/
    onMounted(() => {
      isDevelop.value = !!window.location.href.match(/development|localhost/)
    })
    /** /LifeCycle **/

    return {
      convertFileSize,
      genres,
      state,
      isVerified,
      modalType,
      handleOpenModal,
      uploading,
      email,
      hasEmail,
      isCreatorForCollaborator,
      collaborator,
      isExisting,
      workTitle,
      workDescription,
      genre,
      existingWorks,
      selectExistingWorkTitle,
      episodeNum,
      episodeTitle,
      episodePrice,
      canInputPrice,
      memo,
      upload,
      progress,
      files,
      uploadError,
      uploadSuccess,
      uploadFinishMessage,
      isDirty,
      params,
      collaboratorParams,
      workParams,
      toggleCollaborator,
      toggleWork,
      choiceExistingWorkData,
      uploadValidation,
      uploadDelete,
      clickSendPostWork,
    }
  },
})
</script>

<style lang="scss" scoped>
.postWork {
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: $border-color-lightgray solid 1px;
  &__block {
    margin-bottom: 24px;
    padding-top: 40px;
    position: relative;
    &:before {
      margin: auto;
      width: 0;
      height: 0;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      border-top: 16px solid $font-color-gray;
      border-right: 16px solid transparent;
      border-left: 16px solid transparent;
    }
    &:nth-of-type(1) {
      padding-top: 0;
      &:before {
        content: none;
      }
    }
  }
  &__subTitle {
    margin-bottom: 8px;
    color: $font-color-white;
    font-weight: bold;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
      font-weight: normal;
    }
  }
  &__caption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    line-height: 1.4;
    &[data-style='upload'] {
      margin: 0 16px 16px;
      font-size: 1.6rem;
      color: $font-color-black;
      font-weight: bold;
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
  &__nameArea {
    margin-bottom: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
  }
  &__nameBlock {
    margin-right: 8px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__editButton {
    font-size: 1.6rem;
    color: $font-color-darkgray;
    text-align: center;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
  }
  &__inputBlock {
    margin-left: 8px;
    align-items: center;
    position: relative;
    &[data-style='collaboratorBlock'] {
      margin-top: 4px;
    }
  }
  &__textAreaBlock {
    margin: 8px 0 0 8px;
    padding-bottom: 8px;
    align-items: center;
    position: relative;
  }
  &__select {
    margin-right: 8px;
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
    }
    &.inValid {
      select {
        border: $border-color-red solid 1px;
        background: $background-color-pink;
      }
    }
    &[data-style='collaborator'] {
      width: 168px;
    }
    &[data-style='selectWork'] {
      width: 100%;
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
    &[data-style='email'],
    &[data-style='episodePrice'] {
      &:disabled {
        border: $border-color-gray solid 1px;
        background: $border-color-lightgray;
      }
    }
  }
  &__textarea {
    padding: 8px 4px;
    width: 100%;
    height: 128px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    resize: none;
    &.memo {
      height: 148px;
    }
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__workCheck {
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
  &__inputButtonArea {
    text-align: center;
  }
  &__inputButton {
    margin: 0 auto 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  &__workInfoWrap {
    margin-top: 8px;
  }
  &__workInfoBlock {
    margin: 16px 0 0 8px;
  }
  &__workInfoTitle {
    font-weight: normal;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__workInfoInput {
    margin-top: 4px;
    padding: 0 8px 16px 0;
    position: relative;
  }
  &__upload {
    margin: 24px 8px 16px;
    width: calc(100% - 16px);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: $border-color-dark dashed 4px;
    background: $background-color-white;
    &.inValid {
      border: $border-color-red dashed 4px;
      background: $background-color-pink;
    }
  }
  &__uploadedArea {
    margin: 0 auto 8px;
    width: 100%;
    height: 160px;
  }
  &__uploadedAreaInner {
    padding-top: 40px;
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
  }
  &__uploadedDelete {
    margin: auto;
    width: 40px;
    height: 40px;
    font-size: 40px;
    color: $font-color-black;
    position: absolute;
    top: 0;
    left: 0;
    right: -120px;
    cursor: pointer;
  }
  &__uploadedIcon {
    margin: 0 auto 8px;
    font-size: 5rem;
    color: $font-color-black;
  }
  &__uploadedCaption {
    margin: 0 16px 8px;
    color: $font-color-black;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__inputButton {
    margin: 0 auto 16px;
    padding: 0 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
  }
  &__dropActive {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    opacity: 0.8;
    text-align: center;
    background: $background-color-default;
  }
  &__uploadProgress {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    opacity: 0.8;
    text-align: center;
    background: $background-color-default;
  }
  &__dropActiveCaption {
    font-size: 2rem;
    font-weight: bold;
  }
  &__uploadError {
    margin-bottom: 16px;
    width: 100%;
  }
  &__uploadErrorTitle {
    margin-bottom: 8px;
    color: $font-color-red;
    font-weight: bold;
    text-align: center;
  }
  &__uploadErrorCaption {
    margin-bottom: 8px;
    color: $font-color-red;
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
  }
  &__uploadSuccess {
    width: 100%;
    align-items: center;
  }
  &__uploadSuccessCaptionUpper {
    margin-bottom: 16px;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
  }
  &__uploadSuccessCaptionLower {
    font-size: 1.4rem;
    line-height: 1.6;
  }
  &__progressBar {
    margin: 16px auto 0;
    height: 32px;
    position: relative;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
  }
  &__progressBarInner {
    height: 100%;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    background: $background-color-gray;
  }
}
.pc {
  .postWork {
    &__editButton {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__inputBlock {
      display: flex;
    }
    &__inputText {
      &[data-style='collaborator'],
      &[data-style='episodeTitle'],
      &[data-style='workTitle'] {
        width: 500px;
      }
      &[data-style='email'],
      &[data-style='episodeNum'] {
        width: 400px;
      }
      &[data-style='episodePrice'] {
        width: 200px;
      }
    }
    &__select {
      &[data-style='genre'] {
        width: 300px;
      }
    }
    &__upload {
      height: 300px;
    }
    &__uploadErrorCaption {
      text-align: center;
    }
    &__sendButton {
      width: 200px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__uploadSuccess {
      padding: 80px 16px;
    }
    &__progressBar {
      width: 400px;
    }
  }
}
.sp {
  .postWork {
    &__editButton {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      &:active {
        opacity: 0.6;
      }
    }
    &__inputText {
      &[data-style='email'],
      &[data-style='collaborator'],
      &[data-style='workTitle'],
      &[data-style='episodeTitle'] {
        width: 100%;
      }
      &[data-style='episodeNum'],
      &[data-style='episodePrice'] {
        width: 80%;
      }
    }
    &__select {
      &[data-style='genre'] {
        width: 100%;
      }
    }
    &__upload {
      padding: 16px 0;
      height: auto;
    }
    &__uploadErrorCaption {
      margin: 0 16px;
    }
    &__sendButton {
      width: 100%;
      &:active {
        opacity: 0.6;
      }
    }
    &__uploadSuccess {
      padding: 40px 16px;
    }
    &__progressBar {
      width: calc(100% - 32px);
    }
  }
}
</style>
