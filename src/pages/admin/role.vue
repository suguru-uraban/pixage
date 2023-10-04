<template>
  <div>
    <Breadcrumb :breadcrumbs="adminRole()" />
    <div class="adminRole">
      <h1 class="adminRole__title">管理権限付与</h1>
      <ul class="adminRole__header">
        <li class="adminRole__headerTitle" data-style="name">名前</li>
        <li class="adminRole__headerTitle" data-style="email">メールアドレス</li>
        <li class="adminRole__headerTitle" data-style="roles">権限</li>
      </ul>
      <ul class="adminRole__list">
        <li v-for="staff in staffs" :key="staff.email" class="adminRole__listBlock">
          <div class="adminRole__listName">{{ staff.lastName }} {{ staff.firstName }}</div>
          <div class="adminRole__listEmail">{{ staff.email }}</div>
          <ul class="adminRole__listRolesWrap">
            <li
              v-for="role in ['admin', 'staff', 'user']"
              :key="`${staff.uid}_${role}`"
              class="adminRole__listRoles"
            >
              <input
                :id="`${staff.uid}_${role}`"
                type="radio"
                :name="`roles_${staff.uid}`"
                :value="role"
                :checked="staff.role === role"
                @change="changeRole(role, staff.uid)"
              /><label :for="`${staff.uid}_${role}`">{{ role }}</label>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useMeta, inject } from '@nuxtjs/composition-api'
import firebase, { firestore, timestamp } from '@/plugins/firebase'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import { RoleType } from '@/types/roleType'

export default defineComponent({
  components: {
    Breadcrumb,
  },
  layout: 'Admin',
  setup() {
    const { title, titleTemplate, meta } = useMeta()

    const { adminRole } = inject(BreadcrumbKey) as BreadcrumbStore

    const staffs = ref<firebase.firestore.DocumentData>([])

    firestore
      .collection('usersSecretData')
      .where('emailDomain', '==', 'pixage.co.jp')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          staffs.value.push(...[doc.data()])
        })
      })

    const changeRole = (role: RoleType, uid: string) => {
      try {
        firestore.doc(`usersSecretData/${uid}`).update({
          role,
          updatedAt: timestamp,
        })
      } catch (err) {
        // TODO: エラーが発見され次第対応を考える
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }

    title.value = '管理権限付与'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]

    return {
      adminRole,
      staffs,
      changeRole,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.adminRole {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__header {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__headerTitle {
    padding: 8px 0;
    &[data-style='name'] {
      width: 200px;
    }
    &[data-style='email'] {
      flex: 1;
    }
    &[data-style='roles'] {
      width: 300px;
    }
  }
  &__list {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
  }
  &__listBlock {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: $border-color-lightgray dotted 1px;
  }
  &__listName {
    padding: 8px 0;
    width: 200px;
  }
  &__listEmail {
    padding: 8px 0;
    flex: 1;
  }
  &__listRolesWrap {
    padding: 8px 0;
    width: 300px;
    display: flex;
  }
  &__listRoles {
    width: 96px;
    height: 32px;
    input[type='radio'] {
      display: none;
    }
    label {
      margin-right: 16px;
      width: 80px;
      height: 100%;
      line-height: 30px;
      text-align: center;
      display: block;
      border-radius: 8px;
      border: $border-color-lightgray solid 1px;
    }
    input[type='radio']:checked + label {
      background: $background-color-gray-admin-hover;
    }
  }
}
</style>
