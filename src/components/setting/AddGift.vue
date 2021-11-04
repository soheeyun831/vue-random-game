<template>
  <div class="add-group">
    <input ref="name_input"
           v-model="new_gift_name"
           placeholder="추가하실 상품을 알려주세요.">
    <button
        @click="addGift"
        class="add-button">
      추가
    </button>
  </div>
</template>

<script>
import {ref} from 'vue';
import {useStore} from 'vuex';

export default {
  name: "AddGift",
  props: {
    gifts: Array
  },
  setup(props) {
    const store = useStore();
    const name_input = ref(null);
    let new_gift_name = ref('');

    const validate = () => {
      const valid = {
        state : true,
        message : ''
      }

      const overlap = props.gifts.some( val => {
        return val.name === new_gift_name.value
      });

      if (new_gift_name.value === '') {
        valid.state = false;
        valid.message = '추가하실 상품을 입력해주세요.'
      } else if(overlap) {
        valid.state = false;
        valid.message = '동일한 상품이 있습니다. 확인해주세요.'
      }

      return valid
    }

    const addGift = () => {
      const valid = validate()
      if (valid.state) {
        store.commit("addGift", new_gift_name)
        new_gift_name.value = '';
      } else {
        alert(valid.message);
        name_input.value.focus();
      }
    }


    return {
      name_input,
      new_gift_name,
      addGift,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/setting.scss';
</style>