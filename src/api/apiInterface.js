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