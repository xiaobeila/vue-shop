import * as types from './mutations-types'

const matutaions = {
    //更新用户信息
    [types.NICK_NAME](state, nickName) {
        state.nickName = nickName
    },

    //购物车总数
    [types.CART_COUNT](state, cartCount) {
        state.cartCount = cartCount
    },
}

export default matutaions