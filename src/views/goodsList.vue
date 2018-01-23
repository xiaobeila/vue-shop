<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
          <span>商品列表</span>
      </nav-bread>

      <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
              <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
                  <dd v-for="(item,index) in priceFilter" v-bind:key="item.id">
                    <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="item in goodsList" v-bind:key="item.productId">
                    <div class="pic">
                        <a href="#"><img v-lazy="'static/'+item.productImage" v-bind:alt="item.productName"></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice | currency('￥')}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m" @click="onAddCart(item.productId)">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
                  <p slot="message">请先登录,否则无法加入到购物车中!</p>
                  <div slot="btnGroup">
                    <a href="JavaScript:void(0);" class="btn btn--m" @click="closeModal">关闭</a>
                  </div>
                </modal>
                <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
                 <p slot="message">
                    <svg class="icon-status-ok">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                    </svg>
                    <span>加入购物车成功!</span>
                  </p>
                  <div slot="btnGroup">
                    <a href="JavaScript:void(0);" @click="mdShowCart=false" class="btn btn--m">继续购物</a>
                    <router-link to="/cart" class="btn btn--m btn--red">查看购物车</router-link>
                  </div>
                </modal>
                <div class="view-more-normal"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from "components/NavHeader";
import NavFooter from "components/NavFooter";
import NavBread from "components/NavBread";
import Modal from "components/Modal";
import { goodsList, addCart } from "api/apiInterface";

export default {
  data() {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 4,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false,
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.loading = true;
      goodsList(param).then(response => {
        var res = response.data;
        //loading加载
        setTimeout(() => {
          this.loading = false;
        }, 3000);
        if (res.status == "200") {
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list);
            if (res.result.count < 4) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = [];
        }
      });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
    },
    onAddCart(productId) {
      addCart({ productId: productId }).then(response => {
        var res = response.data;
        if (res.status == 200) {
          this.mdShowCart = true;
        } else {
          this.mdShow = true;
        }
      });
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  }
};
</script>
<style>

</style>
