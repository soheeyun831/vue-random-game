<template>
  <div>
    <div>
      <h3>참가인원은 아래와 같습니까?</h3>
      <ul>
        <li v-for="mem in members"
            :key="mem.no">
          {{ mem.name }}
          <button
              @click="deleteMember(mem.no)">
            del
          </button>
        </li>
      </ul>
      <AddMember :member="members"/>
    </div>
    {{ members }}
    <div>
      <h3>당첨 상품은 무엇입니까?</h3>
      <ul>
        <li v-for="gift in gifts"
            :key="gift.no">
          {{ gift.name }}
          <span>{{ gift.count }}개</span>
          <button @click="updateGiftCount(gift, -1)">-</button>
          <button @click="updateGiftCount(gift, 1)">+</button>
          <button
              @click="deleteGift(gift.no)">
            del
          </button>
        </li>
      </ul>

      <AddGift :gifts="gifts"/>
      {{gifts}}
    </div>
   <div>
      <h3>이용하실 게임은 무엇입니까?</h3>
      <ul>
        <li>
          <button @click="moveGamePage('/ladder')">사다리타기</button>
        </li>
        <li>
          <button @click="moveGamePage('/roulette')">룰렛돌리기</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import AddMember
  from '@/components/setting/AddMember'
import AddGift
  from '@/components/setting/AddGift'

export default {
  name: "index",
  components: {AddMember, AddGift},
  setup() {
    const store = useStore();
    const router = useRouter();
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);

    const deleteMember = (no) => {
      store.dispatch("deleteMember", no)
    }
    const deleteGift = (no) => {
      store.dispatch("deleteGift", no)
    }
    const updateGiftCount = (gift, sum) => {
      if((gift.count + sum) > 0) {
        store.dispatch("updateGiftCount", {no:gift.no, sum:sum})
      } else {
        alert('상품을 삭제하시는 것이 아니라면 상품의 갯수가 0보다 작을 수 없습니다.')
      }

    }

    const moveGamePage = (page_name) => {
      router.push(page_name);
    }

    return {
      members,
      gifts,
      deleteMember,
      deleteGift,
      updateGiftCount,
      moveGamePage
    }
  }
}
</script>

<style scoped>

</style>