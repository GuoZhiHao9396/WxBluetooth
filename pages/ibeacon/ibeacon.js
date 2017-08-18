// pages/ibeacon/ibeacon.js
var t = 0;
var interval;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openBluTap();
  },
  /**
   * 打开蓝牙
   */
  openBluTap: function () {
    var page = this;
    // 初始化蓝牙适配器
    wx.openBluetoothAdapter({
      // 成功
      success: function (res) {
        console.log('蓝牙适配器 - 已开启', res);
        page.setData({
          result: '蓝牙适配器 - 已开启'
        })
      },
      // 失败
      fail: function (res) {
        wx.showModal({
          title: '操作提醒',
          content: '蓝牙功能尚未开启',
        })
      }
    })
  },
  /**
   * 关闭蓝牙
   */
  closeBluTap: function () {
    var page = this;
    // 初始化蓝牙适配器
    wx.closeBluetoothAdapter({
      // 成功
      success: function (res) {
        console.log('蓝牙适配器 - 已关闭', res);
        page.setData({
          result: '蓝牙适配器 - 已关闭'
        })
      }
    })
  },
  /**
   * 获取本机蓝牙适配器状态
   */
  localityBluTap: function () {
    var page = this;
    wx.getBluetoothAdapterState({
      // 成功
      success: function (res) {
        console.log('获取本机蓝牙适配器状态 - 成功', res);
        page.setData({
          result: '获取本机蓝牙适配器状态 - 成功'
        })
        // 监听蓝牙适配器状态变化事件
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log('监听蓝牙适配器变化事件', res)
        })
      },
      // 失败
      fail: function (res) {
        console.log('获取本机蓝牙适配器状态 - 失败', res);
      }
    })
  },
  /**
   * 开始搜索蓝牙
   */
  startSearchBluTap: function () {
    var page = this;
    // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success: function (res) {
        console.log('开始搜索周边设备', res);
        page.setData({
          result: '正在搜索周边设备'
        })
        // 监听寻找到新设备的事件
        wx.onBluetoothDeviceFound(function (devices) {
          console.log('发现新设备', devices)
          page.setData({
            result: '发现新设备'
          })
          // 停止蓝牙搜索
          page.stopSearchBluTap();
        })
      }
    })
  },
  /**
   * 停止搜索蓝牙
   */
  stopSearchBluTap: function () {
    var page = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('停止搜索周边设备', res)
      }
    })
  },
  /**
   * 获取所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
   */
  getBluetoothDevicesBluTap: function () {
    var page = this;
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('当前已发现的蓝牙设备有', res);
        for (var i = 0; i < res.devices.length; i++) {
          page.setData({
            result: '当前已发现的蓝牙设备有' + res.devices[i].name
          })
        }
      }
    })
  },
  /////////////////////////////////////////////////////////
  /**
   * 计时方法
   */
  time: function () {
    interval = setInterval(function () {
      t += 1000;
      console.log('已用时' + t);
    }, 1000);
  },
  /**
   * 获取所有已发现的蓝牙设备，查看是否存在，不存在然后进行搜索
   */
  getBluetoothDevices: function () {
    var page = this;
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('当前已发现的蓝牙设备有', res);
        var isExist = false;
        for (var i = 0; i < res.devices.length; i++) {
          if (res.devices[i].deviceId == "00:83:58:0C:3F:2B") {
            isExist = true;
            break;
          }
        }
        //
        if (isExist == false) {
          page.startBluetoothDevicesDiscovery();
        } else {
          // 停止计时
          clearInterval(interval);
          page.setData({
            result: '已进入考勤范围'
          })
        }
      }
    })
  },
  /**
   * 搜索附近的蓝牙
   */
  startBluetoothDevicesDiscovery: function () {
    
    var page = this;
    // 搜索附近的蓝牙
    wx.startBluetoothDevicesDiscovery({
      uuids: ['10:00:10:2A:57:54', 'B46E051B-08BE-D35B-08C7-63790E772E79'],
      success: function (res) {
        console.log('开始搜索周边设备', res);
        // 监听寻找到新设备的事件
        wx.onBluetoothDeviceFound(function (dev) {
          //
          console.log('发现新设备', dev);
          console.log('设备名：', dev.devices[0].name);
          console.log('设备ID：', dev.devices[0].deviceId);
          //
          wx.getBLEDeviceServices({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: dev.devices[0].deviceId,
            success: function (res) {
              console.log('device services:', res.services)
            }
          })

          // 判断是否满足两个条件
          if (dev.devices[0].deviceId == "10:00:10:2A:57:54" || dev.devices[0].deviceId == "B46E051B-08BE-D35B-08C7-63790E772E79") {
            // 停止计时
            clearInterval(interval);
            // 停止蓝牙搜索
            page.stopSearchBluTap();
            //
            page.setData({
              result: '已进入考勤范围'
            })
          }
        })
      }
    })
  },
  /**
   * IBeacon开始搜索
   */
  startBeaconDiscovery: function () {
    var page = this;
    wx.startBeaconDiscovery({
      // ,'e6cb1030-86d8-4e73-85bd-c069528d4d82'
      // || dev.beacons[0].uuid.toLowerCase() == "e6cb1030-86d8-4e73-85bd-c069528d4d82".toLowerCase()
      uuids: ['fda50693-a4e2-4fb1-afcf-c6eb07647825'],
      success(res) {
        console.log(res);
        // 监听 iBeacon 设备的更新事件
        wx.onBeaconUpdate(function (dev) {
          console.log('发现新设备', dev);
          console.log('设备uuid：', dev.beacons[0].uuid);
          // 判断是否满足条件
          if (dev.beacons[0].uuid.toLowerCase() == "fda50693-a4e2-4fb1-afcf-c6eb07647825".toLowerCase()) {
            // 停止计时
            clearInterval(interval);
            // 停止蓝牙搜索
            page.stopBeaconDiscovery();
            //
            page.setData({
              result: '已进入考勤范围'
            })
          }
        })
      }
    })
  },
  /**
   * IBeacon停止搜索
   */
  stopBeaconDiscovery: function () {
    wx.stopBeaconDiscovery({
      success(res) {
        console.log(res);
      }
    })
  },
  /**
   * 获取已搜索到的IBeacon数据
   */
  getBeacons: function () {
    wx.getBeacons({
      success(res) {
        console.log(res);
      }
    })
  },
  /**
   * 定位是否进入考勤范围
   */
  location: function () {
    this.setData({
      retult: '定位中...'
    })
    //
    // this.time();
    // 
    this.getBluetoothDevices();
  },
  iBeaconlocation: function () {
    this.setData({
      retult: '定位中...'
    })
   
    this.startBeaconDiscovery();
  }
})