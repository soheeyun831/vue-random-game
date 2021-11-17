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
      <div ref="ladder_el" id="ladder"
           class="ladder">
        <div id="dimmed"
             class="dim"></div>
        <canvas ref="ladder_canvas"
                class="ladder_canvas"
                id="ladder_canvas"></canvas>
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
    const ladder_el = ref(null);
    const ladder_canvas = ref(null);
    const state = reactive({
      ladder: {},
      nodes: [],
      row: 0,
      height_node: 10,
      width_node: 0,
      global_footer_print: {},
      global_check_foot_print: {},
      working: false,
      gifts: []
    });

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

      const rest = state.width_node - state.gifts.length;
      for (let r = 0; r < rest; r++) {
        state.gifts.push({name: '꽝'})
      }

      state.gifts.sort(() => Math.random() - 0.5);
    };

    const setDefaultFootPrint = () => {
      for (let r = 0; r < state.height_node; r++) {
        for (let column = 0; column < state.width_node; column++) {
          state.global_footer_print[`${column}-${r}`] = false;
        }
      }
    };

    const reSetCheckFootPrint = () => {
      for (let r = 0; r < state.height_node; r++) {
        for (let column = 0; column < state.width_node; column++) {
          state.global_check_foot_print[`${column}-${r}`] = false;
        }
      }
    };

    const setDefaultRowLine = () => {
      setDefaultGifts()
      for (let y = 0; y < state.height_node; y++) {
        let row_arr = [];
        for (let x = 0; x < state.width_node; x++) {
          const node_id = `${x}-${state.row}`;
          row_arr.push(node_id);
          // 노드그리기
          const left = x * 100;
          const top = state.row * 25;

          const node = document.createElement('div');
          node.setAttribute('class', 'node');
          node.setAttribute('id', node_id);
          node.setAttribute('data-left', String(left));
          node.setAttribute('data-top', String(top));
          node.style.position = 'absolute';
          node.style.left = `${left}px`;
          node.style.top = `${top}px`;

          ladder_el.value.appendChild(node);
        }
        state.ladder[state.row] = row_arr;
        state.row++;
      }
    }

    const setRandomNodeData = () => {
      for (let y = 0; y < state.height_node; y++) {
        for (let x = 0; x < state.width_node; x++) {
          let loop_node = `${x}-${y}`;
          const rand = Math.floor(Math.random() * 2);
          if (rand === 0) {
            state.global_footer_print[loop_node] = {
              'change': false,
              'draw': false
            }
          } else {
            if (x === (state.width_node - 1)) {
              state.global_footer_print[loop_node] = {
                'change': false,
                'draw': false
              }
            } else {
              state.global_footer_print[loop_node] = {
                'change': true,
                'draw': true
              }
              x = x + 1;
              loop_node = `${x}-${y}`;
              state.global_footer_print[loop_node] = {
                'change': true,
                'draw': false
              }
            }
          }
        }
      }
    }

    const drawDefaultLine = () => {
      const table = document.createElement('table')

      for (let y = 0; y < state.height_node - 1; y++) {
        const tr = document.createElement('tr');
        for (let x = 0; x < state.width_node - 1; x++) {
          const td = document.createElement('td');
          td.style.width = '102px';
          td.style.height = '25px';
          td.style.borderLeft = '2px solid #ddd';
          td.style.borderRight = '2px solid #ddd';
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      ladder_el.value.appendChild(table);
    }

    const drawNodeLine = () => {
      for (let y = 0; y < state.height_node; y++) {
        for (let x = 0; x < state.width_node; x++) {
          const node = `${x}-${y}`;
          const nodeInfo = state.global_footer_print[node];
          if (nodeInfo['change'] && nodeInfo['draw']) {
            stokeLine(x, y, 'w', 'r', '#ddd', '2')
          }
        }
      }
    }

    function stokeLine(x, y, flag, dir, color, width) {
      let canvas = document.getElementById('ladder_canvas');
      let ctx = canvas.getContext('2d');
      let moveToStart = 0;
      let moveToEnd = 0;
      let lineToStart = 0;
      let lineToEnd = 0;
      let eachWidth = 100;
      let eachHeight = 25;

      if (flag === "w") {
        //가로줄
        if (dir === "r") {
          ctx.beginPath();
          moveToStart = x * eachWidth;
          moveToEnd = y * eachHeight;
          lineToStart = (x + 1) * eachWidth;
          lineToEnd = y * eachHeight;

        } else {
          // dir "l"
          ctx.beginPath();
          moveToStart = x * eachWidth;
          moveToEnd = y * eachHeight;
          lineToStart = (x - 1) * eachWidth;
          lineToEnd = y * eachHeight;
        }
      } else {
        ctx.beginPath();
        moveToStart = x * eachWidth;
        moveToEnd = y * eachHeight;
        lineToStart = x * eachWidth;
        lineToEnd = (y + 1) * eachHeight;
      }

      ctx.moveTo(moveToStart + 3, moveToEnd + 2);
      ctx.lineTo(lineToStart + 3, lineToEnd + 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.closePath();
    }

    const userSetting = () => {
      const user_list = state.ladder[0];
      const html = document.createElement('div');

      for (let i = 0; i < user_list.length; i++) {
        const color = '#' + (function lol(m, s, c) {
          return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1));
        })(Math, '0123456789ABCDEF', 4);

        const x = user_list[i] ? user_list[i].split('-')[0] * 1 : 0;
        let left = x * 100 - 30
        const user_wrapper = document.createElement('div');
        user_wrapper.classList.add('user-wrap');
        user_wrapper.style.left = `${left}px`;

        const member_name = document.createElement('span');
        member_name.dataset.node = user_list[i];
        member_name.dataset.color = color;
        const member_name_text = document.createTextNode(members.value[i].name);
        member_name.appendChild(member_name_text);
        user_wrapper.appendChild(member_name);

        const ladder_start = document.createElement('button');
        ladder_start.classList.add('ladder-start');
        ladder_start.style.backgroundColor = color;
        ladder_start.dataset.color = color;
        ladder_start.dataset.node = user_list[i];

        state.nodes[i] = {
          color: color,
          node: user_list[i],
          name: members.value[i].name
        }

        user_wrapper.appendChild(ladder_start);
        html.appendChild(user_wrapper);
      }
      ladder_el.value.appendChild(html);
    }

    const resultSetting = () => {
      const result_list = state.ladder[state.height_node - 1];
      const html = document.createElement('div');

      for (let i = 0; i < result_list.length; i++) {
        const x = result_list[i] ? result_list[i].split('-')[0] * 1 : 0;
        const y = result_list[i] ? result_list[i].split('-')[1] * 1 + 1 : 0;

        const node = x + "-" + y;
        const left = x * 100 - 30

        const answer_wrapper = document.createElement('div');
        answer_wrapper.classList.add('answer-wrap');
        answer_wrapper.style.left = `${left}px`;

        const gift_name = document.createElement('span');
        gift_name.setAttribute('id', `gift-${node}`);
        gift_name.dataset.node = `gift-${node}`;
        const gift_name_text = document.createTextNode(state.gifts[i].name);
        gift_name.appendChild(gift_name_text);
        answer_wrapper.appendChild(gift_name);

        const user_name = document.createElement('p');
        user_name.setAttribute('id', `${node}-user`);
        user_name.dataset.node = `${node}-user`;
        const user_name_text = document.createTextNode('^^~');
        user_name.appendChild(user_name_text);
        answer_wrapper.appendChild(user_name)

        html.appendChild(answer_wrapper);
      }
      ladder_el.value.appendChild(html);
    }

    const getStepladder = () => {
      state.width_node = members.value.length
      ladder_el.value.style.width = (state.width_node - 1) * 100 + 6 + 'px'
      ladder_el.value.style.height = (state.height_node - 1) * 30 + 6 + 'px';
      ladder_el.value.style.backgroundColor = '#fff';
      ladder_canvas.value.setAttribute('width', (state.width_node - 1) * 100 + 6)
      ladder_canvas.value.setAttribute('height', (state.height_node - 1) * 25 + 6);

      setDefaultFootPrint();
      reSetCheckFootPrint();
      setDefaultRowLine();
      setRandomNodeData();
      drawDefaultLine();
      drawNodeLine();
      userSetting();
      resultSetting();
    }


    onMounted(getStepladder)

    const startLadder = () => {
      if (state.working) {
        return false;
      }

      const dimmed = document.getElementById('dimmed');
      dimmed.remove();

      state.working = true;
      reSetCheckFootPrint();
      // startLineDrawing(state.nodes[0]);
      for (let i = 0; i < state.nodes.length; i++) {
        // startLineDrawing(state.nodes[0].node, 'transparent', state.nodes[0].name);
        // startLineDrawing(state.nodes[1].node, state.nodes[1].color, state.nodes[1].name);
        startLineDrawing(state.nodes[i].node, state.nodes[i].color, state.nodes[i].name);
      }
    }

    function startLineDrawing(node, color, name) {
      const x = node.split('-')[0] * 1;
      const y = node.split('-')[1] * 1;
      let node_info = state.global_footer_print[node];
      state.global_check_foot_print[node] = true;

      console.log('@@@@@@@@@@@@@@@@@@@')
      console.log('@@@@@@START@@@@@@')
      console.log(`NODE = ${node} / NAME = ${name}`)
      console.log('NODE INFO')
      console.log(node_info)
      console.log(`X = ${x} / Y = ${y}`)

      if (y === state.height_node) {
        reSetCheckFootPrint();
        const target = document.getElementById(`gift-${x}-${y}`)
        if (target) target.style.color = color;
        const target_user = document.getElementById(`${x}-${y}-user`);
        target_user.innerText = name

        state.working = false;
        return false;
      } else if(y > state.height_node) {
        state.working = false;
        return false;
      }

      if (node_info && node_info['change']) {
        const left_node = `${(x - 1)}-${y}`;
        const right_node = `${(x + 1)}-${y}`;
        const down_node = `${x}-${(y + 1)}`;
        let left_node_info = state.global_footer_print[left_node];
        let right_node_info = state.global_footer_print[right_node];

        console.log('state.global_check_foot_print')
        console.log(state.global_check_foot_print)

        console.log('state.global_footer_print.hasOwnProperty(left_node)')
        // eslint-disable-next-line no-prototype-builtins
        console.log(state.global_footer_print.hasOwnProperty(left_node))

        console.log('state.global_footer_print.hasOwnProperty(right_node)')
        // eslint-disable-next-line no-prototype-builtins
        console.log(state.global_footer_print.hasOwnProperty(right_node))

        // eslint-disable-next-line no-prototype-builtins
        if (state.global_footer_print.hasOwnProperty(left_node) && state.global_footer_print.hasOwnProperty(right_node)) {
          left_node_info = state.global_footer_print[left_node];
          right_node_info = state.global_footer_print[right_node];
          if ((left_node_info['change'] && left_node_info['draw'] && !state.global_check_foot_print[left_node]) && (right_node_info['change']) && left_node_info['draw'] && !state.global_check_foot_print[right_node]) {
            //Left우선
            console.log("중복일때  LEFT 우선");
            stokeLine(x, y, 'w', 'l', color, 3)
            setTimeout(function () {
              return startLineDrawing(left_node, color, name)
            }, 100);
          } else if ((left_node_info['change'] && !left_node_info['draw'] && !state.global_check_foot_print[left_node]) && (right_node_info['change']) && !state.global_check_foot_print[right_node]) {
            console.log('RIGHT 우선')
            stokeLine(x, y, 'w', 'r', color, 3)
            console.log("right")
            setTimeout(function () {
              return startLineDrawing(right_node, color, name)
            }, 100);
          } else if ((left_node_info['change'] && left_node_info['draw'] && !state.global_check_foot_print[left_node]) && (!right_node_info['change'])) {
            //Left우선
            console.log("LEFT 우선");
            stokeLine(x, y, 'w', 'l', color, 3)
            setTimeout(function () {
              return startLineDrawing(left_node, color, name)
            }, 100);
          } else if (!left_node_info['change'] && (right_node_info['change']) && !state.global_check_foot_print[right_node]) {
            //Right우선
            console.log("RIGHT 우선");
            stokeLine(x, y, 'w', 'r', color, 3)
            setTimeout(function () {
              return startLineDrawing(right_node, color, name)
            }, 100);
          } else {
            console.log('DOWN 우선')
            stokeLine(x, y, 'h', 'd', color, 3)
            setTimeout(function () {
              return startLineDrawing(down_node, color, name)
            }, 100);
          }
        } else {
          console.log('else')
          // eslint-disable-next-line no-prototype-builtins
          if (!state.global_footer_print.hasOwnProperty(left_node) && state.global_footer_print.hasOwnProperty(right_node)) {
            /// 좌측라인
            console.log('좌측라인')
            console.log(state.global_check_foot_print)
            if ((right_node_info['change'] && !right_node_info['draw']) && !state.global_check_foot_print[right_node]) {
              //Right우선
              console.log("RIGHT 우선");
              stokeLine(x, y, 'w', 'r', color, 3)
              setTimeout(function () {
                return startLineDrawing(right_node, color, name)
              }, 100);
            } else {
              console.log('DOWN')
              stokeLine(x, y, 'h', 'd', color, 3)
              setTimeout(function () {
                return startLineDrawing(down_node, color, name)
              }, 100);
            }

            // eslint-disable-next-line no-prototype-builtins
          } else if (state.global_footer_print.hasOwnProperty(left_node) && !state.global_footer_print.hasOwnProperty(right_node)) {
            /// 우측라인
            console.log('우측라인')
            console.log('state.global_check_foot_print[left_node]')
            console.log(state.global_check_foot_print[left_node])
            console.log(state.global_check_foot_print[right_node])
            if ((left_node_info['change'] && left_node_info['draw']) && !state.global_check_foot_print[left_node]) {
              //Right우선
              console.log("LEFT 우선");
              stokeLine(x, y, 'w', 'l', color, 3)
              setTimeout(function () {
                return startLineDrawing(left_node, color, name)
              }, 100);
            } else if(left_node_info['change'] && y === 0){
              stokeLine(x, y, 'w', 'l', color, 3)
              setTimeout(function () {
                return startLineDrawing(left_node, color, name)
              }, 100);

            } else {
              console.log('DOWN')
              stokeLine(x, y, 'h', 'd', color, 3)
              setTimeout(function () {
                return startLineDrawing(down_node, color, name)
              }, 100);
            }
          } else {
            console.log('DOWN')
            stokeLine(x, y, 'h', 'd', color, 3)
            setTimeout(function () {
              return startLineDrawing(down_node, color, name)
            }, 100);
          }
        }
      } else {
        console.log("11111")
        console.log("down")
        const down_node = x + "-" + (y + 1);
        stokeLine(x, y, 'h', 'd', color, 3)
        setTimeout(function () {
          return startLineDrawing(down_node, color, name)
        }, 100);
      }
      console.log('@@@@@@END@@@@@@')
      console.log('@@@@@@@@@@@@@@@@@@@')

    }

    return {
      members,
      gifts,
      ladder_el,
      ladder_canvas,
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

table {
  border-collapse: collapse;
  border-spacing: 0;
}

.ladder_canvas {
  z-index: 999;
}

.ladder {
  position: relative;
  margin: 100px auto;
  z-index: 0;
}

.node {
  width: 0;
  height: 0;
  background-color: #000;
}

.ladder table {
  position: absolute;
  top: 2px;
  left: 1px;
  z-index: -99;
}

.user-wrap {
  width: 60px;
  position: absolute;
  top: -52px;
  text-align: center;
}

.user-wrap input {
  width: 100%;
  height: 20px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.user-wrap button {
  margin: 5px 0 0 0;
  border: 0;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  text-align: center;
  line-height: 20px;
  font-weight: bolder;
  color: #fff;
  cursor: pointer;
  outline: 0;
}

.answer-wrap {
  width: 60px;
  position: absolute;
  bottom: -45px;
  text-align: center;
}

.answer-wrap input {
  width: 100%;
  height: 20px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.answer-wrap p {
  width: 100%;
  height: 20px;
  font-weight: bold;
  font-size: 0.8em;
  line-height: 20px;
}

.start-form {
  width: 300px;
  height: 400px;
  //background-image: url("bg.png");
  background-repeat: no-repeat;
  background-position: 50% 30%;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.landing-form {
  position: absolute;
  top: 270px;
}

.landing-form input {
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.landing-form label {
  display: block;
  width: 100%;
}

.landing-form .button {
  margin-top: 10px;
  width: 220px;
}

.dim {
  width: 100%;
  height: 100%;
  /*background-color: #fff;*/
  position: absolute;
  top: 0;
  left: 0;
}
</style>
