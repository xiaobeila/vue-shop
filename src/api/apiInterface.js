import fetch from 'common/js/fetch';

/**
 * goods 列表
 * @param {*} param 
 */
export function goodsList(param) {
    return fetch({
        url: '/goods',
        methods: 'get',
        params: param
    })
}

/**
 * addCart 加入购物车
 * @param {*} param 
 */
export function addCart(param) {
    return fetch({
        url: '/goods/addCart',
        method: 'post',
        data: param
    })
}

/**
 * cartsList 获取购物车列表
 */
export function cartsList() {
    return fetch({
        url: '/users/cartList',
        method: 'get'
    })
}

/**
 * cartDel 购物车删除
 */
export function cartDel(param) {
    return fetch({
        url: '/users/cartDel',
        method: 'post',
        data: param
    })
}