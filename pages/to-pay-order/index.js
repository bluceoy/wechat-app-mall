//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    mallName:wx.getStorageSync('mallName'),
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,

    goodsJsonStr:""
  },
  onShow : function () {
    this.initShippingAddress();
  },
  onLoad: function (e) {
    var that = this;
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    var goodsJsonStr = "[";
    for (var i =0; i < shopList.length; i++) {
      var carShopBean = shopList[i];
      console.log(carShopBean);
      if (carShopBean.logisticsType > 0) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number

      var goodsJsonStrTmp = '';
      if (i > 0){
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":'+ carShopBean.goodsId +',"number":'+ carShopBean.number +',"propertyChildIds":"'+ carShopBean.propertyChildIds +'","logisticsType":'+ carShopBean.logisticsType +'}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    that.setData({
      goodsList:shopList,
      isNeedLogistics:isNeedLogistics,
      allGoodsPrice:allGoodsPrice,
      goodsJsonStr:goodsJsonStr
    });

    

  },
  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = e.detail.value.remark; // 备注信息
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token:loginToken,
        goodsJsonStr:that.data.goodsJsonStr,
        remark:remark
      }, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        console.log(res.data);
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/default',
      data: {
        token:app.globalData.token
      },
      success: (res) =>{
        console.log(res.data)
        if (res.data.code == 0) {
          that.setData({
            curAddressData:res.data.data
          });
        }
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  }
})