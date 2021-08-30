import {createStore} from "vuex";

export default createStore({
    state: {
        member: [
            {no: 1, name: '윤소희'},
            {no: 2, name: '조재용'},
            {no: 3, name: '이민해'},
            {no: 4, name: '차의현'},
        ],
        gift: [
            {
                no: 1,
                name: '커피',
                count: 1
            }
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