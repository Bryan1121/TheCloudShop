import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {

    //  1 获取本地存储中的数据 
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
    
      scrollTop: 0
    })

  }
})