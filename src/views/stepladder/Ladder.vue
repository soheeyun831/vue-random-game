<template>
  <section>
    <article
        class="game-article-header">
      <Header title="🪜 사다리 타기 🧗‍"
              color="797979"/>
      <button class="start-button"
              @click="startLadder">
        시작
      </button>
    </article>
    <article>
      <div ref="ladder_member"
           id="sadari-start-data"
           class="result-row">
        <ul>
          <li v-for="member in state.members" :key="member.no">
            {{member.name}}
          </li>
        </ul>
      </div>
      <div class="result-line-wrapper">
        <canvas ref="ladder_el"
                id="sadari-line"
                class="result-line"></canvas>
      </div>
      <div ref="ladder_gift"
           id="sadari-end-data"
           class="result-row">

        <ul>
          <li v-for="gift in state.gifts" :key="gift.no">
            {{gift.name}}
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script>
import {
  ref,
  computed,
  onMounted,
  reactive
} from "vue";
import {useStore} from 'vuex';
import Header
  from "@/components/layout/Header";


export default {
  name: 'Stepladder',
  components: {Header},
  setup() {
    const store = useStore();
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);
    const ladder_member = ref(null);
    const ladder_el = ref(null);
    const ladder_gift = ref(null);
    const state = reactive({
      members: [],
      gifts: [],
      hide_middle: false,
      show_direct: false,
    })

    const setDefaultGifts = () => {
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

      state.gifts.sort(() => Math.random() - 0.5);
      state.members = members.value.sort(() => Math.random() - 0.5);
    };

    const getStepladder = () => {
      setDefaultGifts();
    }


    onMounted(getStepladder)

    const startLadder = () => {
    }


    return {
      state,
      ladder_member,
      ladder_el,
      ladder_gift,
      startLadder
    }
  }
}
</script>
<style lang="scss">
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

#app-result:after {
  content: '';
  position: absolute;
  display: block;
  height: 50%;
  opacity: 0;
  -webkit-transition: all 500ms;
  -o-transition: all 500ms;
  transition: all 500ms;
  background-color: #fff;
  background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 71%, rgba(255, 255, 255, 1) 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255, 255, 255, 0)), color-stop(71%, rgba(255, 255, 255, 1)), color-stop(100%, rgba(255, 255, 255, 1)));
  background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 71%, rgba(255, 255, 255, 1) 100%);
  background: -o-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 71%, rgba(255, 255, 255, 1) 100%);
  background: -ms-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 71%, rgba(255, 255, 255, 1) 100%);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 71%, rgba(255, 255, 255, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ffffff', GradientType=0);
  width: 100%;
  bottom: 75px;
  z-index: 5;
  left: 0;
}

#app-result.__hider:after {
  opacity: 1;
  z-index: 20;
}

.app-page {
  display: none;
}

.app-page.__active {
  display: block;
}

.result-row {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  position: relative;
  z-index: 10;
}

.result-data {
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;
  position: relative;
  text-align: center;
}

.result-data-value {
  text-align: center;
  padding: 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  max-width: 50px;
  display: inline-block;
  /*	overflow: hidden;*/
  -webkit-transition: all 350ms;
  -o-transition: all 350ms;
  transition: all 350ms;
  border-radius: 3px;
  position: relative;
  z-index: 5;
  margin: 0 auto;
}

.result-line {
  width: 100%;
  display: block;
  height: auto;
}

.result-value {

}

.result-line-wrapper {
  display: block;
  width: 100%;
  position: relative;
  /*	z-index: 20;*/
}

.result-line-wrapper.__active:after {
  opacity: 1;
}

.result-data-value.__active {
  color: #c55;
  font-weight: bold;
}

.result-data-value.__hover {
  font-weight: bold;
  color: #fff;
}
</style>
