<template>
  <section>
    <article
        class="game-article-header">
      <Header title="🃏 Roulette 🃏‍"
              color="797979"/>
      <p>오늘의 {{ state.gift }} 당첨자는? <b>{{ state.member }}</b>
      </p>
      <button class="start-button"
              @click="startRoulette">
        시작
      </button>
    </article>
    <article class="game-article-body">
      <canvas id="canvas"
              ref="roulette_el"
              width="500"
              height="500"></canvas>
    </article>
  </section>
</template>

<script>
import {
  computed,
  onMounted, reactive,
  ref
} from "vue";
import {useStore} from 'vuex';
import Header
  from "@/components/layout/Header";

export default {
  name: 'Roulette',
  components: {Header},
  setup() {
    const store = useStore();
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);
    const roulette_el = ref(null);
    const state = reactive({
      gift: '',
      member: ''
    })

    let startAngle = 0;
    const arc = Math.PI / (members.value.length / 2);
    let spinAngleStart = 10;
    let spinTimeout = null;
    let spinTime = 0;
    let spinTimeTotal = 0;

    let ctx = undefined;

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

    function drawRouletteWheel() {
      if (roulette_el.value.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 50;

        ctx = roulette_el.value.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.font = 'bold 16px Helvetica, Arial';

        for (let i = 0; i < members.value.length; i++) {
          const angle = startAngle + i * arc;
          ctx.fillStyle = getColor(i, members.value.length);

          ctx.beginPath();

          ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
          ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
          ctx.stroke();
          ctx.fill();

          ctx.save();
          ctx.shadowOffsetX = -1;
          ctx.shadowOffsetY = -1;
          ctx.shadowBlur = 0;
          ctx.fillStyle = "white";
          ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
              250 + Math.sin(angle + arc / 2) * textRadius);
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          const text = members.value[i].name;
          ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
      }
    }

    function spin() {
      spinAngleStart = Math.random() * 10 + 10;
      spinTime = 0;
      spinTimeTotal = Math.random() * 3 + 4 * 1000;
      rotateWheel();
    }

    function rotateWheel() {
      spinTime += 30;
      if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
      }
      const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      startAngle += (spinAngle * Math.PI / 180);
      drawRouletteWheel();
      spinTimeout = setTimeout(() => {
        rotateWheel()
      }, 30);
    }

    function stopRotateWheel() {
      clearTimeout(spinTimeout);
      const degrees = startAngle * 180 / Math.PI + 90;
      const arcd = arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      ctx.save();
      ctx.font = 'bold 30px Helvetica, Arial';
      const member = members.value[index].name;

      state.member = member;
      ctx.fillText(member, 250 - ctx.measureText(member).width / 2, 250 + 10);
      ctx.restore();
    }

    function easeOut(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    }


    const startRoulette = () => {
      spin()
    }

    const getRoulette = () => {
      state.gift = gifts.value[0].name


      drawRouletteWheel();
    }

    onMounted(getRoulette)
    return {
      state,
      members,
      gifts,
      roulette_el,
      startRoulette
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/setting.scss';
@import '~@/assets/scss/base/color.scss';

.game-article-body {
  width: 500px;
  margin: 0 auto;
}
</style>
