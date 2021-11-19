<template>
  <section>
    <article
        class="game-article-header">
      <Header title="🃏 카드 뒤집기 🃏‍"
              color="797979"/>
    </article>
    <article>
      <div>
        <ul class="card-list">
          <li v-for="card in state.cards" :key="card.no" class="card-item" @click="card.visible = true">
            <div class="card-content" :class="{hide: card.visible}">
              <div class="member">{{card.member}}</div>
            </div>
            <div class="card-content" :class="{active: card.visible}">
              <div class="member">{{card.member}}</div>
              <div class="gift">{{card.gift}}</div>
            </div>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script>
import {
  computed,
  onMounted,
  reactive
} from "vue";
import {useStore} from 'vuex';
import Header
  from "@/components/layout/Header";

export default {
  name: 'Card',
  components: {Header},
  setup() {
    const store = useStore();
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);
    const state = reactive({
      members: [],
      gifts: [],
      cards: []
    })


    const setDefaultData = () => {
      for (let i = 0; i < gifts.value.length; i++) {
        if (gifts.value[i].count > 1) {
          for (let j = 0; j < gifts.value[i].count; j++) {
            state.gifts.push({name: gifts.value[i].name})
          }
        } else {
          state.gifts.push({name: gifts.value[i].name})
        }
      }

      const rest = members.value.length - state.gifts.length;
      for (let r = 0; r < rest; r++) {
        state.gifts.push({name: '꽝'})
      }

      state.members = shuffle(members.value);
      state.gifts = shuffle(state.gifts);

      state.gifts.sort(() => Math.random() - 0.5);
      // state.members.sort(() => Math.random() - 0.5);

      for (let i = 0; i < state.members.length; i++) {
        state.cards[i] = {
          no: i,
          member: state.members[i].name,
          gift: state.gifts[i].name,
          visible: false
        }
      }
    };

    const getCard = () => {
      setDefaultData()
    }

    function shuffle(array) {
      const arr = array
      for (let index = array.length - 1; index > 0; index--) {
        const randomPosition = Math.floor(Math.random() * (index + 1));
        const temporary = array[index];
        array[index] = array[randomPosition];
        array[randomPosition] = temporary;
      }
      return arr
    }


    onMounted(getCard)
    // watch(value, methods)
    return {members, gifts, state}
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/setting.scss';
@import '~@/assets/scss/base/color.scss';

.game-article-header {
  margin: 100px auto 40px;
  text-align: center;

  .start-button {
    width: 80px;
    height: 36px;
    margin-top: 20px;
    color: $white;
    font-size: 16px;
    border: transparent;
    border-radius: 6px;
    background: $point1;
    cursor: pointer;
    transition: background-color 300ms;

    &:hover {
      background-color: $light-point;
      transition: background-color 300ms;
    }
  }
}

.card-list {
  width: calc(100% - 48px);
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 40px auto;
  .card-item {
    width: calc(25% - 8px);
    height: 300px;
    position: relative;
    padding: 24px;
    margin-bottom: 16px;
    text-align: center;
    border: 1px solid $grey-03;
    border-radius: 8px;

    backface-visibility:hidden;
    -webkit-backface-visibility:hidden;
    transition:all 1.5s;
    -webkit-transition:all 1.5s;
    -moz-transition:all 1.5s;
    -o-transition:all 1.5s;

    &:before {
      content: '';
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      position: absolute;
      top: 8px;
      left: 8px;
      border: 1px solid $point1;
      border-radius: 8px;
    }
    .card-content{
      height:100%;
      width:100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size:24px;
      backface-visibility:hidden;
      -webkit-backface-visibility:hidden;
      transition:all 1.5s;
      -webkit-transition:all 1.5s;
      -moz-transition:all 1.5s;
      -o-transition:all 1.5s;
    }

    .card-content:last-child{
      position:relative;
      top:-252px;
      transform:rotateY(180deg);
      -webkit-transform:rotateY(180deg);
      -ms-transform:rotateY(180deg);
      -moz-transform:rotateY(180deg);
      -o-transform:rotateY(180deg);
    }

    .card-content.hide{
      transform:rotateY(-180deg);
      -webkit-transform:rotateY(-180deg);
      -ms-transform:rotateY(-180deg);
      -moz-transform:rotateY(-180deg);
      -o-transform:rotateY(-180deg);
    }

    .card-content.active{
      transform:rotateY(0deg);
      -webkit-transform:rotateY(0deg);
      -ms-transform:rotateY(0deg);
      -moz-transform:rotateY(0deg);
      -o-transform:rotateY(0deg);
    }


    .gift {
      color: $point1;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
