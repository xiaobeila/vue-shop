import * as types from './mutations-types'

const matutaions = {
    //更新用户信息
    [types.nickName](state, nickName) {
        state.nickName = nickName
    },
}

export default matutaions