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