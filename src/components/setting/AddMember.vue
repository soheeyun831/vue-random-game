<template>
  <div class="add-group">
    <input ref="name_input"
           v-model="new_member_name"
           placeholder="추가하실 분의 성함을 알려주세요.">
    <button
        @click="addMember"
        class="add-button">
      추가
    </button>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';

export default {
  name: "AddMember",
  setup() {
    const store = useStore();
    const members = computed(() => store.state.member);

    const name_input = ref(null);
    let new_member_name = ref('');

    const validate = () => {
      const valid = {
        state: true,
        message: ''
      }

      const overlap = members.value.some(val => {
        return val.name === new_member_name.value
      });

      if (new_member_name.value === '') {
        valid.state = false;
        valid.message = '추가하실 분의 성함을 알려주세요.'
      } else if (overlap) {
        valid.state = false;
        valid.message = '동일한 이름이 있습니다. 확인해주세요.'
      }

      return valid
    }

    const addMember = () => {
      const valid = validate()
      if (valid.state) {
        store.commit("addMember", new_member_name)
        new_member_name.value = '';
      } else {
        alert(valid.message);
        name_input.value.focus();
      }
    }


    return {
      name_input,
      new_member_name,
      addMember,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/setting.scss';
</style>