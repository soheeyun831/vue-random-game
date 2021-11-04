<template>
  <div>
    <div
        class="game-setting-form-container">
      <ul class="game-setting-form">
        <li class="game-setting-form-item"
            :class="{on : state.state >= 1}">
          <div
              class="game-setting-form-item-title"
              aria-label="1">
            <h5>step 1. 참가인원</h5>
          </div>
          <div
              class="game-setting-form-item-contents">
            <p class="member-total-count">
              총 {{ members.length }}명
            </p>
            <ul class="member-list">
              <li v-for="mem in members"
                  :key="mem.no"
                  class="member-item">
                {{ mem.name }}
                <button
                    @click="deleteMember(mem.no)"
                    class="delete-button">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                    <g fill="none"
                       fill-rule="evenodd">
                      <g transform="translate(-259 -635) translate(50 490) translate(209 145)">
                        <circle
                            cx="10"
                            cy="10"
                            r="10"
                            class="circle"
                        />
                        <path
                            fill="#FFF"
                            d="M4 9.496H16V10.496H4z"
                            transform="rotate(45 10 9.996)"/>
                        <path
                            fill="#FFF"
                            d="M4 9.496H16V10.496H4z"
                            transform="scale(-1 1) rotate(45 0 -14.146)"/>
                      </g>
                    </g>
                  </svg>
                </button>
              </li>
            </ul>
            <AddMember
                v-show="state.state === 1"/>
          </div>
        </li>
        <li class="game-setting-form-item"
            :class="{on : state.state >= 2}">
          <div
              class="game-setting-form-item-title"
              aria-label="2">
            <h5>step 2. 당첨상품</h5>
          </div>
          <div
              class="game-setting-form-item-contents">
            <ul class="gift-list">
              <li v-for="gift in gifts"
                  :key="gift.no"
                  class="gift-item">
                <p class="name">
                  {{ gift.name }}
                </p>
                <div
                    class="count-control">
                  <button
                      @click="updateGiftCount(gift, -1)"
                      class="control-button minus">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20">
                      <g fill="none"
                         fill-rule="evenodd">
                        <g>
                          <circle
                              cx="10"
                              cy="10"
                              r="10"
                              class="circle"
                          />
                          <path
                              fill="#FFF"
                              d="M4 9.496H16V10.496H4z"/>
                        </g>
                      </g>
                    </svg>
                  </button>
                  <span>
                  {{ gift.count }}
                </span>
                  <button
                      @click="updateGiftCount(gift, 1)"
                      class="control-button plus">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20">
                      <g fill="none"
                         fill-rule="evenodd">
                        <g transform="translate(-259 -635) translate(50 490) translate(209 145)">
                          <circle
                              cx="10"
                              cy="10"
                              r="10"
                              class="circle"
                          />
                          <path
                              fill="#FFF"
                              d="M4 9.496H16V10.496H4z"/>
                          <path
                              d="M 10,10 V 4,16 z"
                              stroke="#FFF"
                              fill="none"
                              stroke-width="1"/>
                        </g>
                      </g>
                    </svg>
                  </button>
                </div>
                <button
                    @click="deleteGift(gift.no)"
                    class="delete-button">

                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                    <g fill="none"
                       fill-rule="evenodd">
                      <g transform="translate(-259 -635) translate(50 490) translate(209 145)">
                        <path
                            fill="#FFF"
                            d="M4 9.496H16V10.496H4z"
                            transform="rotate(45 10 9.996)"/>
                        <path
                            fill="#FFF"
                            d="M4 9.496H16V10.496H4z"
                            transform="scale(-1 1) rotate(45 0 -14.146)"/>
                      </g>
                    </g>
                  </svg>
                </button>
              </li>
            </ul>
            <AddGift :gifts="gifts"
                     v-show="state.state === 2"/>
          </div>
        </li>
        <li class="game-setting-form-item"
            :class="{on : state.state >= 3}">
          <div
              class="game-setting-form-item-title"
              aria-label="3">
            <h5>step 3. 이용게임</h5>
          </div>
          <div
              class="game-setting-form-item-contents">

            <ul class="game-list">
              <li class="game-item">
                <button
                    @click="selectGame('ladder')"
                    :class="{on : state.game === 'ladder'}">
                  사다리타기
                </button>
              </li>
              <li class="game-item">
                <button
                    @click="selectGame('roulette')"
                    :class="{on : state.game === 'roulette'}">
                  룰렛돌리기
                </button>
              </li>
            </ul>
          </div>
        </li>
        <li class="control-group">
          <div>
            <button class="prev-button"
                    v-show="state.state"
                    @click="moveState(-1)">
              이전
            </button>
            <button class="next-button"
                    @click="moveState(1)">
              다음
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {computed, reactive} from 'vue';
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
    const state = reactive({
      state: 1,
      game: 'ladder'
    });
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);

    const deleteMember = (no) => {
      store.dispatch("deleteMember", no)
    }
    const deleteGift = (no) => {
      store.dispatch("deleteGift", no)
    }
    const updateGiftCount = (gift, sum) => {
      if ((gift.count + sum) > 0) {
        store.dispatch("updateGiftCount", {
          no: gift.no,
          sum: sum
        })
      } else {
        alert('상품을 삭제하시는 것이 아니라면 상품의 갯수가 0보다 작을 수 없습니다.')
      }

    }

    const moveGamePage = (page_name) => {
      router.push(page_name);
    }
    const selectGame = (type) => {
      state.game = type
    }

    const moveState = (count) => {
      if (count > 0) {
        if (state.state < 3) {
          state.state++
        }
      } else if (state.state > 1) {
        state.state--
      }
    }

    return {
      members,
      gifts,
      state,
      deleteMember,
      deleteGift,
      updateGiftCount,
      selectGame,
      moveGamePage,
      moveState
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/setting.scss';
@import '~@/assets/scss/base/color.scss';

.member-total-count {
  padding: 20px 0 10px;
  color: $grey-02;
  font-size: 14px;
}

.member-list {
  display: flex;
  flex-wrap: wrap;

  .member-item {
    min-width: 84px;
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    margin: 0 8px 8px 0;
    color: $grey-02;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid $grey-05;
    border-radius: 16px;


    &:hover {
      color: $point1;
      border-color: $point1;

      .delete-button {
        svg {
          .circle {
            fill: $light-point;
          }
        }
      }
    }

    .delete-button {
      width: 20px;
      height: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 4px;
      border: transparent;
      background: transparent;
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;

        .circle {
          fill: $grey-04;
        }
      }

      &:hover {
        svg {
          .circle {
            fill: $point1;
          }
        }
      }
    }
  }
}

.gift-list {
  display: flex;
  flex-wrap: wrap;

  .gift-item {
    display: flex;
    justify-content: space-between;
    margin: 0 10px 8px 0;
    overflow: hidden;
    color: $grey-02;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid $grey-05;
    border-radius: 16px;


    .name {
      padding: 4px 12px 4px 8px;
    }

    .count-control {
      display: flex;

      > * {
        margin-right: 4px;
      }

      > span {
        margin-right: 8px;
        line-height: 30px;
      }

      .control-button {
        width: 20px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        border: transparent;
        background: transparent;
        cursor: pointer;

        svg {
          width: 16px;
          height: 16px;

          .circle {
            fill: $grey-04;
          }
        }

        &:hover {
          svg {
            .circle {
              fill: $point1;
            }
          }
        }
      }
    }

    &:hover {
      color: $point1;
      border-color: $point1;

      .delete-button {
        background: $light-point;
      }

      .control-button {
        svg {
          .circle {
            fill: $light-point;
          }
        }
      }
    }

    .delete-button {
      width: 32px;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 4px;
      text-align: center;
      border: transparent;
      background: $grey-04;
      cursor: pointer;

      &:hover {
        background: $point1;
      }
    }
  }
}

.game-list {
  display: flex;

  .game-item {
    button {
      height: 44px;
      padding: 0 20px;
      margin-left: 4px;
      color: $point1;
      border: 1px solid $point1;
      border-radius: 6px;
      background: $white;
      cursor: pointer;
      transition: all 300ms;

      &.on {
        color: $white;
        background: $point1;
        transition: all 300ms;
      }
    }
  }
}
</style>