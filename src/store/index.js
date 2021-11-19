import {createStore} from "vuex";

export default createStore({
    state: {
        member: [
            {no: 1, name: '윤소희'},
            {no: 2, name: '한예은'},
            {no: 3, name: '김단비'},
            {no: 4, name: '권지영'},
            {no: 5, name: '박수현'},
            // {no: 6, name: '정다님'},
            // {no: 7, name: '임정규'},
            // {no: 8, name: '차의현'},
            // {no: 9, name: '최강우'},
            // {no: 10, name: '이경준'},
            // {no: 11, name: '유용덕'},
            // {no: 12, name: '김성원'},
            // {no: 13, name: '양경석'},
        ],
        gift: [
            {
                no: 1,
                name: '커피 ☕',
                count: 1
            },
            // {
            //     no: 2,
            //     name: '점심 🍱',
            //     count: 1
            // }
        ]
    },
    getters: {
        time2(state) {
            return state.counter * 2;
        }
    },
    mutations: {
        addMember(state, name) {
            const num = state.member.length > 0 ? (state.member[state.member.length - 1].no) + 1 : 1
            state.member.push({
                no: num,
                name: name.value
            })
        },
        deleteMember(state, no) {
            const idx = state.member.findIndex((item) => {
                return item.no === no
            })

            if (idx > -1) state.member.splice(idx, 1)
        },
        addGift(state, name) {
            const num = state.gift.length > 0 ? (state.gift[state.gift.length - 1].no) + 1 : 1
            state.gift.push({
                no: num,
                name: name.value,
                count: 1
            })
        },
        deleteGift(state, no) {
            const idx = state.gift.findIndex((item) => {
                return item.no === no
            })

            if (idx > -1) state.gift.splice(idx, 1)
        },
        updateGiftCount(state, gift) {
            state.gift.forEach(e=>{
                if(e.no === gift.no)
                    e.count = e.count + gift.sum
            });
        }
    },
    actions: {
        addMember({commit}, name) {
            if (name) {
                commit("addMember", name)
            }
        },
        deleteMember({commit}, no) {
            if (no) {
                commit("deleteMember", no)
            }
        },
        addGift({commit}, name) {
            if (name) {
                commit("addGift", name)
            }
        },
        deleteGift({commit}, no) {
            if (no) {
                commit("deleteGift", no)
            }
        },
        updateGiftCount({commit}, gift) {
            if (gift) {
                commit("updateGiftCount", gift)
            }
        }
    }
});