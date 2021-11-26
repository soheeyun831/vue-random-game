<template>
  <section>
    <article
        class="game-article-header">
      <Header title="🪜 사다리 타기 🧗‍"
              color="797979"/>
      <button class="start-button"
              @click="startLadder"
              :disabled="state.play">
        시작
      </button>
    </article>
    <article>
      <div id="div_body"
           ref="ladder_el"></div>
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
    const ladder_el = ref(null);
    const ladder = {
      arrVerDiv: [], //수직선 div
      arrHorDiv: [], //수평선 div
      arrMovDiv: [], //이동 선 div
      arrIng: [], //진행여부 체크용
      arrMDiv: [], //이동선 배열 번호값 저장, 이동후 확인용
      nMaxWidth: 1000, //최고 넓이
      nWidth: 0, //사다리 넓이
      nHeight: 300, //사다리 높이
      nNum: 0,
      nSpeed: 10,
      arrTopDiv: [], //탑 div
      arrBotDiv: [], //아래 div
      sRndTop: ''
    }
    const state = reactive({
      members: [],
      gifts: [],
      play: false
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

    function getDiv(sWidth, sHeight, sBgColor) {
      const d = document.createElement("div");
      if (sWidth) d.style.width = sWidth;
      if (sHeight) d.style.height = sHeight;
      if (sBgColor) d.style.backgroundColor = sBgColor;
      d.style.position = "absolute";
      d.style.overflow = "hidden";
      return d;
    }

    function getRndTop() {
      const nRnd = parseInt(Math.random() * (ladder.nHeight - 100)) + 150;

      if (ladder.sRndTop.indexOf("[" + nRnd + "]") < 0) {
        ladder.sRndTop += "[" + nRnd + "]";
        return nRnd;
      } else {
        return getRndTop();
      }
    }

    const setLadder = () => {
      //갯수
      ladder.nNum = members.value.length;

      //넓이
      ladder.nWidth = parseInt(ladder.nMaxWidth / ladder.nNum);

      for (let i = 0; i < ladder.nNum; i++) {
        ladder.arrTopDiv[i] = getDiv(ladder.nWidth + "px", "50px", "");
        ladder.arrBotDiv[i] = getDiv(ladder.nWidth + "px", "50px", "");

        ladder.arrTopDiv[i].style.left = (i * ladder.nWidth) + "px";
        ladder.arrTopDiv[i].style.top = "20px";

        ladder.arrBotDiv[i].style.left = (i * ladder.nWidth) + "px";
        ladder.arrBotDiv[i].style.top = "450px";

        ladder.arrTopDiv[i].style.fontSize = "14px";
        ladder.arrBotDiv[i].style.fontSize = "14px";

        ladder.arrTopDiv[i].align = "center";
        ladder.arrBotDiv[i].align = "center";

        ladder.arrTopDiv[i].innerHTML = `<span>${state.members[i].name}</span>`;
        ladder.arrBotDiv[i].innerHTML = `<span>${state.gifts[i].name}</span>`;

        ladder_el.value.appendChild(ladder.arrTopDiv[i]);
        ladder_el.value.appendChild(ladder.arrBotDiv[i]);


        ladder.arrVerDiv[i] = getDiv("1px", ladder.nHeight + "px", "#bbbbbb");

        ladder.arrVerDiv[i].style.left = ((i * ladder.nWidth) + parseInt(ladder.nWidth / 2)) + "px";
        ladder.arrVerDiv[i].style.top = "100px";

        ladder_el.value.appendChild(ladder.arrVerDiv[i]);

      }
      createLadder();
    }

    const createLadder = () => {
      for (let i = 0; i < ladder.nNum; i++) {

        ladder.arrTopDiv[i].innerHTML = state.members[i].name;
        ladder.arrBotDiv[i].innerHTML = state.gifts[i].name;

        ladder.arrTopDiv[i].style.overflow = "auto";
        ladder.arrBotDiv[i].style.overflow = "auto";

        ladder.arrIng[i] = false;

        ladder.arrMDiv[i] = [];
      }

      for (let i = 0; i < (ladder.nNum * 7); i++) {

        const nLen = ladder.arrHorDiv.length;

        ladder.arrHorDiv[nLen] = getDiv(ladder.nWidth + "px", "1px", "#aaaaaa");

        const nRndLeft = (parseInt(Math.random() * (ladder.nNum - 1)) * ladder.nWidth) + parseInt(ladder.nWidth / 2);
        const nRndTop = getRndTop();

        ladder.arrHorDiv[nLen].style.left = nRndLeft + "px";
        ladder.arrHorDiv[nLen].style.top = nRndTop + "px";

        ladder_el.value.appendChild(ladder.arrHorDiv[nLen]);
      }
    }

    const getStepladder = () => {
      setDefaultGifts();
      setLadder();
    }


    onMounted(getStepladder)

    const startLadder = () => {
      state.play = true;
      for (let i = 0; i < state.members.length; i++) {
        if (ladder.arrIng[i]) {
          for (let j = 0; j < ladder.arrMDiv.length; j++) {
            for (let k = 0; k < ladder.arrMDiv[k].length; k++) {
              ladder.arrMovDiv[ladder.arrMDiv[j][k]].style.backgroundColor = "#CCCCCC";
              ladder.arrMovDiv[ladder.arrMDiv[j][k]].style.zIndex = 1;
            }

          }
          for (let j = 0; j < ladder.arrMDiv[i].length; j++) {
            ladder.arrMovDiv[ladder.arrMDiv[i][j]].style.backgroundColor = "#0000ff";
            ladder.arrMovDiv[ladder.arrMDiv[i][j]].style.zIndex = 2;
          }
        } else {

          const nSx = parseInt(ladder.arrVerDiv[i].style.left);
          const nSy = parseInt(ladder.arrVerDiv[i].style.top);

          moveStart("y", i, nSx, nSy);

          ladder.arrIng[i] = true; //진행
        }
      }
    }

    function byte2Hex(n) {
      const nybHexString = "0123456789ABCDEF";
      return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    function RGB2Color(r, g, b) {
      return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    function getColor(item, max_item) {
      const phase = 0;
      const center = 128;
      const width = 127;
      const frequency = Math.PI * 2 / max_item;

      const red = Math.sin(frequency * item + 2 + phase) * width + center;
      const green = Math.sin(frequency * item + phase) * width + center;
      const blue = Math.sin(frequency * item + 4 + phase) * width + center;

      return RGB2Color(red, green, blue);
    }

    function moveStart(sXy, pno, nSx, nSy) {

      const nLen = ladder.arrMovDiv.length;
      ladder.arrMovDiv[nLen] = getDiv("2px", "2px", getColor(pno, members.value.length));

      ladder.arrMDiv[pno].push(nLen);

      ladder_el.value.appendChild(ladder.arrMovDiv[nLen]);

      ladder.arrMovDiv[nLen].style.left = nSx + "px";
      ladder.arrMovDiv[nLen].style.top = nSy + "px";

      ladder.arrMovDiv[nLen].style.zIndex = 3;


      let nEx = nSx;
      let nEy = nSy;
      if (sXy === "y") {
        nEy = ladder.nHeight + 100;
      }

      let bCk = false;

      for (let i = 0; i < ladder.arrHorDiv.length; i++) {

        const nx = parseInt(ladder.arrHorDiv[i].style.left);
        const ny = parseInt(ladder.arrHorDiv[i].style.top);
        const nw = parseInt(ladder.arrHorDiv[i].style.width);

        if (sXy === "x") {
          if (ny === nSy) {
            if (nx === nSx) {
              nEx = nx + nw;
              break;
            } else if ((nx + nw) === nSx) {
              nEx = nx;
              break;
            }
          }
        } else {

          //반복하면서 큰것중에서 제일 작은것으로
          if (ny > nSy) {

            if (nx === nEx || (nx + nw) === nEx) {

              if (bCk) {
                if (ny < nEy) nEy = ny;
              } else
                nEy = ny;

              bCk = true;
            }
          }
        }
      }

      move(nLen, pno, nSx, nSy, nEx, nEy);
    }

    function move(no, pno, nSx, nSy, nEx, nEy) {
      const nw = parseInt(ladder.arrMovDiv[no].style.width);
      const nh = parseInt(ladder.arrMovDiv[no].style.height);

      let np;
      let bIng = true;

      let sXy = "";

      if (nSx !== nEx) {
        np = nw + ladder.nSpeed;
        if (nEx < nSx) {
          if ((nSx - np) <= nEx) {
            bIng = false;
            np = nSx - nEx;
          }
          ladder.arrMovDiv[no].style.left = (nSx - np) + "px";
        } else {
          if ((nSx + np) >= nEx) {
            bIng = false;
            np = nEx - nSx;
          }
        }

        ladder.arrMovDiv[no].style.height = "4px";
        ladder.arrMovDiv[no].style.width = np + "px";

        sXy = "x";
      } else {

        np = nh + ladder.nSpeed;
        if ((nSy + np) >= nEy) {
          bIng = false;
          np = nEy - nSy;
        }

        ladder.arrMovDiv[no].style.width = "4px";
        ladder.arrMovDiv[no].style.height = np + "px";

        sXy = "y";
      }


      if (bIng) {
        setTimeout(() => {
          move(no, pno, nSx, nSy, nEx, nEy)
        }, 1);

      } else {

        if ((sXy === "x")) ladder.arrMovDiv[no].style.height = "2px";
        else ladder.arrMovDiv[no].style.width = "2px";

        if (nEy < ladder.nHeight + 100) {
          moveStart((sXy === "x") ? "y" : "x", pno, nEx, nEy);
        } else {

          for (let i = 0; i < ladder.arrVerDiv.length; i++) {
            if (nEx === parseInt(ladder.arrVerDiv[i].style.left)) {
              ladder.arrBotDiv[i].innerHTML = `<b style="color: ${getColor(pno, members.value.length)};">${state.members[pno].name}</b><br>${ladder.arrBotDiv[i].innerHTML}`;

              break;
            }
          }
        }
      }
    }


    return {
      state,
      ladder_el,
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
    &:disabled {
      background-color: $grey-04;
      cursor: default;
    }
  }
}

.app-page {
  display: none;
}

.app-page.__active {
  display: block;
}

#div_body {
  width: 1000px;
  height: 450px;
  position: relative;
  margin: 0 auto;
}
</style>
