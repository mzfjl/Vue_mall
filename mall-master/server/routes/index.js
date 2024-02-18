var express = require('express')
var router = express.Router()
var connection = require('../db/sql')
var user = require('../db/userSql')
var QcloudSms = require('qcloudsms_js')
let jwt = require('jsonwebtoken')
// 引入支付宝配置文件
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default
//引入axiso
const axios = require('axios')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

//支付状态
router.post('/api/successPayment', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //订单号
  let out_trade_no = req.body.out_trade_no
  let trade_no = req.body.trade_no
  //支付宝配置
  const formData = new AlipayFormData()
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get')
  //支付时信息
  formData.addField('bizContent', {
    out_trade_no,
    trade_no
  })
  //返回promise
  const result = alipaySdk.exec(
    'alipay.trade.query',
    {},
    { formData: formData }
  )
  //后端请求支付宝
  result.then((resData) => {
    axios({
      method: 'GET',
      url: resData
    })
      .then((data) => {
        let responseCode = data.data.alipay_trade_query_response
        if (responseCode.code == '10000') {
          switch (responseCode.trade_status) {
            case 'WAIT_BUYER_PAY':
              res.send({
                data: {
                  code: 0,
                  data: {
                    msg: '支付宝有交易记录，没付款'
                  }
                }
              })
              break

            case 'TRADE_CLOSED':
              res.send({
                data: {
                  code: 1,
                  data: {
                    msg: '交易关闭'
                  }
                }
              })
              break

            case 'TRADE_FINISHED':
              connection.query(
                `select * from user where tel = ${tokenObj.tel}`,
                function (error, results) {
                  //用户id
                  let uId = results[0].id
                  connection.query(
                    `select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`,
                    function (err, result) {
                      let id = result[0].id
                      //订单的状态修改掉2==》3
                      connection.query(
                        `update store_order set order_status = replace(order_status,'2','3') where id = ${id}`,
                        function () {
                          res.send({
                            data: {
                              code: 2,
                              data: {
                                msg: '交易完成'
                              }
                            }
                          })
                        }
                      )
                    }
                  )
                }
              )
              break

            case 'TRADE_SUCCESS':
              connection.query(
                `select * from user where tel = ${tokenObj.tel}`,
                function (error, results) {
                  //用户id
                  let uId = results[0].id
                  connection.query(
                    `select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`,
                    function (err, result) {
                      let id = result[0].id
                      //订单的状态修改掉2==》3
                      connection.query(
                        `update store_order set order_status = replace(order_status,'2','3') where id = ${id}`,
                        function () {
                          res.send({
                            data: {
                              code: 2,
                              data: {
                                msg: '交易完成'
                              }
                            }
                          })
                        }
                      )
                    }
                  )
                }
              )
              break
          }
        } else if (responseCode.code == '40004') {
          res.send({
            data: {
              code: 4,
              msg: '交易不存在'
            }
          })
        }
      })
      .catch((err) => {
        res.send({
          data: {
            code: 500,
            msg: '交易失败',
            err
          }
        })
      })
  })
})

//发起支付
router.post('/api/payment', function (req, res, next) {
  //订单号
  let orderId = req.body.orderId
  //商品总价
  let price = req.body.price
  //购买商品的名称
  let name = req.body.name
  //开始对接支付宝API
  const formData = new AlipayFormData()
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get')
  //支付时信息
  formData.addField('bizContent', {
    outTradeNo: orderId, //订单号
    productCode: 'FAST_INSTANT_TRADE_PAY', //写死的
    totalAmount: price, //价格
    subject: name //商品名称
  })
  //支付成功或者失败跳转的链接
  formData.addField('returnUrl', 'http://localhost:8080/payment')
  //返回promise
  const result = alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData }
  )
  //对接支付宝成功，支付宝方返回的数据
  result.then((resp) => {
    res.send({
      data: {
        code: 200,
        success: true,
        msg: '支付中',
        paymentUrl: resp
      }
    })
  })
})

//修改订单状态
router.post('/api/submitOrder', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //订单号
  let orderId = req.body.orderId
  //购物车选中的商品id
  let shopArr = req.body.shopArr
  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      connection.query(
        `select * from store_order where uId = ${uId} and order_id = ${orderId}`,
        function (err, result) {
          //订单的数据库id
          let id = result[0].id
          //修改订单状态 1==>2
          connection.query(
            `update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,
            function (e, r) {
              //购物车数据删除
              shopArr.forEach((v) => {
                connection.query(
                  `delete from goods_cart where id = ${v}`,
                  function () {}
                )
              })
              res.send({
                data: {
                  code: 200,
                  success: true
                }
              })
            }
          )
        }
      )
    }
  )
})

//查询订单
router.post('/api/selectOrder', function (req, res, next) {
  //接收前端给后端的订单号
  let orderId = req.body.orderId
  connection.query(
    `select * from store_order where order_id='${orderId}'`,
    function (err, result) {
      res.send({
        data: {
          success: true,
          code: 200,
          data: result
        }
      })
    }
  )
})

// 生成一个订单
router.post('/api/addOrder', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //前端给后端的数据
  let goodsArr = req.body.arr
  //生成订单号order_id，规则：时间戳 + 6为随机数
  function setTimeDateFmt(s) {
    return s < 10 ? '0' + s : s
  }
  function randomNumber() {
    const now = new Date()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    month = setTimeDateFmt(month)
    day = setTimeDateFmt(day)
    hour = setTimeDateFmt(hour)
    minutes = setTimeDateFmt(minutes)
    seconds = setTimeDateFmt(seconds)
    let orderCode =
      now.getFullYear().toString() +
      month.toString() +
      day +
      hour +
      minutes +
      seconds +
      Math.round(Math.random() * 1000000).toString()
    return orderCode
  }
  /*
    未支付：1
    待支付：2
    支付成功：3
    支付失败：4 | 0
    */
  //商品列表名称
  let goodsName = []
  //订单商品总金额
  let goodsPrice = 0
  //订单商品总数量
  let goodsNum = 0
  //订单号
  let orderId = randomNumber()

  goodsArr.forEach((item) => {
    goodsName.push(item.goods_name)
    goodsPrice += item.goods_price * item.goods_num
    goodsNum += parseInt(item.goods_num)
  })
  //查询当前用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      connection.query(
        `insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values (${uId},'${orderId}','${goodsName}','${goodsPrice}','${goodsNum}','1')`,
        function () {
          connection.query(
            `select * from store_order where uId = ${uId} and order_id='${orderId}'`,
            function (err, result) {
              res.send({
                data: {
                  success: true,
                  code: 200,
                  data: result
                }
              })
            }
          )
        }
      )
    }
  )
})

//删除收货地址
router.post('/api/deleteAddress', function (req, res, next) {
  let id = req.body.id
  connection.query(
    `delete from address where id = ${id}`,
    function (error, results) {
      res.send({
        data: {
          code: 200,
          success: true,
          msg: '删除成功'
        }
      })
    }
  )
})

//修改收货地址
router.post('/api/updateAddress', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //拿到前端给后端传入的数据
  let body = req.body
  let [
    id,
    name,
    tel,
    province,
    city,
    county,
    addressDetail,
    isDefault,
    areaCode
  ] = [
    body.id,
    body.name,
    body.tel,
    body.province,
    body.city,
    body.county,
    body.addressDetail,
    body.isDefault,
    body.areaCode
  ]
  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      //对应查询到0 或者 1 有没有默认收货地址
      console.log(isDefault)
      connection.query(
        `select * from address where uId = ${uId} and isDefault = ${isDefault}`,
        function (err, result) {
          if (result.length > 0) {
            let addressId = result[0].id
            connection.query(
              `update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`,
              function (e, r) {
                let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`
                connection.query(
                  updateSql,
                  [
                    uId,
                    name,
                    tel,
                    province,
                    city,
                    county,
                    addressDetail,
                    isDefault,
                    areaCode
                  ],
                  function (errors, datas) {
                    res.send({
                      data: {
                        code: 200,
                        success: true,
                        msg: '修改成功'
                      }
                    })
                  }
                )
              }
            )
          } else {
            let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`
            connection.query(
              updateSql,
              [
                uId,
                name,
                tel,
                province,
                city,
                county,
                addressDetail,
                isDefault,
                areaCode
              ],
              function (errors, datas) {
                res.send({
                  data: {
                    code: 200,
                    success: true,
                    msg: '修改成功'
                  }
                })
              }
            )
          }
        }
      )
    }
  )
})

//查询收货地址
router.post('/api/selectAddress', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)

  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      connection.query(
        `select * from address where uId = ${uId}`,
        function (err, result) {
          res.send({
            data: {
              code: 200,
              success: true,
              msg: '查询成功',
              data: result
            }
          })
        }
      )
    }
  )
})

//新增收货地址
router.post('/api/addAddress', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //拿到前端给后端传入的数据
  let body = req.body
  let [name, tel, province, city, county, addressDetail, isDefault, areaCode] =
    [
      body.name,
      body.tel,
      body.province,
      body.city,
      body.county,
      body.addressDetail,
      body.isDefault,
      body.areaCode
    ]

  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      //增加一条收货地址
      if (isDefault != 1) {
        connection.query(
          `insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,
          function (err, result) {
            res.send({
              data: {
                code: 200,
                success: true,
                msg: '收货地址添加成功'
              }
            })
          }
        )
      } else {
        connection.query(
          `select * from address where uId = ${uId} and isDefault = ${isDefault}`,
          function (err, result) {
            if (result.length > 0) {
              let addressId = result[0].id
              connection.query(
                `update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`,
                function () {
                  connection.query(
                    `insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,
                    function (e, r) {
                      res.send({
                        data: {
                          code: 200,
                          success: true,
                          msg: '收货地址添加成功'
                        }
                      })
                    }
                  )
                }
              )
            } else {
              connection.query(
                `insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,
                function (err, result) {
                  res.send({
                    data: {
                      code: 200,
                      success: true,
                      msg: '收货地址添加成功'
                    }
                  })
                }
              )
            }
          }
        )
      }
    }
  )
})

//修改购物车数量
router.post('/api/updateNum', function (req, res, next) {
  let id = req.body.id
  let changeNum = req.body.num

  connection.query(
    `select * from goods_cart where id = ${id}`,
    function (error, results) {
      //原来的数量
      let num = results[0].goods_num
      connection.query(
        `update goods_cart set goods_num = replace(goods_num,${num},${changeNum}) where id = ${id}`,
        function (err, result) {
          res.send({
            data: {
              code: 200,
              success: true
            }
          })
        }
      )
    }
  )
})

//删除购物车数据
router.post('/api/deleteCart', function (req, res, next) {
  let arrId = req.body.arrId

  for (let i = 0; i < arrId.length; i++) {
    connection.query(
      `delete from goods_cart where id = ${arrId[i]}`,
      function (error, results) {
        res.send({
          data: {
            code: 200,
            success: true,
            msg: '删除成功'
          }
        })
      }
    )
  }
})

//查询购物车数据
router.post('/api/selectCart', function (req, res, next) {
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)
  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      //查询购物车
      connection.query(
        `select * from goods_cart where uId = ${uId}`,
        function (err, result) {
          res.send({
            data: {
              code: 200,
              success: true,
              data: result
            }
          })
        }
      )
    }
  )
})

//添加购物车数据
router.post('/api/addCart', function (req, res, next) {
  //后端接收前端的参数
  let goodsId = req.body.goodsId
  //token
  let token = req.headers.token
  let tokenObj = jwt.decode(token)

  // console.log(tokenObj.tel)

  //查询用户
  connection.query(
    `select * from user where tel = ${tokenObj.tel}`,
    function (error, results) {
      //用户id
      let uId = results[0].id
      //查询商品
      connection.query(
        `select * from goods_list where id=${goodsId}`,
        function (err, result) {
          let goodsName = result[0].name
          let goodsPrice = result[0].price
          let goodsImgUrl = result[0].imgUrl
          //查询当前用户在之前是否添加过本商品
          connection.query(
            `select * from goods_cart where uId=${uId} and goods_id=${goodsId}`,
            function (e, r) {
              //用户之前是否添加过该商品到购物车
              if (r.length > 0) {
                let num = r[0].goods_num
                connection.query(
                  `update goods_cart set goods_num = replace(goods_num,${num},${
                    parseInt(num) + 1
                  }) where id = ${r[0].id}`,
                  function (e, datas) {
                    res.send({
                      data: {
                        code: 200,
                        success: true,
                        msg: '添加成功'
                      }
                    })
                  }
                )
              } else {
                //没有
                connection.query(
                  `insert into goods_cart (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`,
                  function () {
                    res.send({
                      data: {
                        code: 200,
                        success: true,
                        msg: '添加成功'
                      }
                    })
                  }
                )
              }
            }
          )
        }
      )
    }
  )
})

//修改密码
router.post('/api/recovery', function (req, res, next) {
  let params = {
    userTel: req.body.phone,
    userPwd: req.body.pwd
  }

  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    //某一条记录数id
    let id = results[0].id
    let pwd = results[0].pwd
    connection.query(
      `update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,
      function (err, result) {
        res.send({
          code: 200,
          data: {
            success: true,
            msg: '修改成功'
          }
        })
      }
    )
  })
})

//查询用户是否存在
router.post('/api/selectUser', function (req, res, next) {
  let params = {
    userTel: req.body.phone
  }
  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true
        }
      })
    } else {
      res.send({
        code: 0,
        data: {
          success: false,
          msg: '此用户不存在'
        }
      })
    }
  })
})

//注册
router.post('/api/register', function (req, res, next) {
  let params = {
    userTel: req.body.phone,
    userPwd: req.body.pwd
  }
  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    if (error) throw error
    //用户存在
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '用户已存在',
          data: results[0]
        }
      })
    } else {
      //不存在，新增一条数据
      connection.query(user.insertData(params), function (err, result) {
        connection.query(user.queryUserTel(params), function (e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '注册成功',
              data: r[0]
            }
          })
        })
      })
    }
  })
})

//增加一个用户
router.post('/api/addUser', function (req, res, next) {
  // 获取前端传过来的手机号
  let params = {
    userTel: req.body.phone
  }
  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    if (error) throw error
    //用户存在
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '登录成功',
          data: results[0]
        }
      })
    } else {
      //不存在，新增一条数据
      connection.query(user.insertData(params), function (err, result) {
        connection.query(user.queryUserTel(params), function (e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: r[0]
            }
          })
        })
      })
    }
  })
})

//发送短信验证码
router.post('/api/code', function (req, res, next) {
  // 接受前端传来的手机号
  let tel = req.body.phone

  // 短信应用SDK AppID
  var appid = 1400187558 // SDK AppID是1400开头

  // 短信应用SDK AppKey
  var appkey = 'dc9dc3391896235ddc2325685047edc7'

  // 需要发送短信的手机号码
  var phoneNumbers = [tel]

  // 短信模板ID，需要在短信应用中申请
  var templateId = 285590 // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

  // 签名
  var smsSign = '三人行慕课' // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey)

  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, ress, resData) {
    if (err) {
      console.log('err: ', err)
    } else {
      res.send({
        code: 200,
        data: {
          success: true,
          data: ress.req.body.params[0]
        }
      })
    }
  }

  var ssender = qcloudsms.SmsSingleSender()
  //params 就是往手机上，发送的短信验证码
  var params = [Math.floor(Math.random() * (9999 - 1000)) + 1000]
  ssender.sendWithParam(
    86,
    phoneNumbers[0],
    templateId,
    params,
    smsSign,
    '',
    '',
    callback
  ) // 签名参数不能为空串
})

// 登录验证
router.post('/api/login', function (req, res, next) {
  //后端要接收前端传递过来的值
  let params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd
  }
  //查询用户手机号是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    //手机号存在
    if (results.length > 0) {
      connection.query(user.queryUserPwd(params), function (err, result) {
        if (result.length > 0) {
          //手机号和密码都对
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: result[0]
            }
          })
        } else {
          //密码不对
          res.send({
            code: 302,
            data: {
              success: false,
              msg: '密码不正确'
            }
          })
        }
      })
    } else {
      //不存在
      res.send({
        code: 301,
        data: {
          success: false,
          msg: '手机号不存在'
        }
      })
    }
  })
})

//查询商品id的数据
router.get('/api/goods/id', function (req, res, next) {
  let id = req.query.id
  connection.query(
    'select * from goods_list where id=' + id + '',
    function (error, results) {
      if (error) throw error
      res.json({
        code: 0,
        data: results[0]
      })
    }
  )
})

//分类的接口
router.get('/api/goods/list', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      {
        //一级
        id: 0,
        name: '推荐',
        data: [
          {
            //二级
            id: 0,
            name: '推荐',
            list: [
              //三级
              {
                id: 0,
                name: '铁观音',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '功夫茶具',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '茶具电器',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '紫砂壶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 6,
                name: '武夷岩茶',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        //一级
        id: 1,
        name: '绿茶',
        data: [
          {
            //二级
            id: 0,
            name: '绿茶',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '碧螺春',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '安吉白茶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '六安瓜片',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        //一级
        id: 2,
        name: '乌龙',
        data: [
          {
            //二级
            id: 0,
            name: '乌龙',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '碧螺春',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '安吉白茶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '六安瓜片',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        //一级
        id: 3,
        name: '红茶',
        data: [
          {
            //二级
            id: 0,
            name: '红茶',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '碧螺春',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '安吉白茶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '六安瓜片',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        //一级
        id: 4,
        name: '白茶',
        data: [
          {
            //二级
            id: 0,
            name: '白茶',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '碧螺春',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '安吉白茶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '六安瓜片',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        //一级
        id: 5,
        name: '普洱',
        data: [
          {
            //二级
            id: 0,
            name: '普洱',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 1,
                name: '碧螺春',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 4,
                name: '安吉白茶',
                imgUrl: './img/list/list1.jpeg'
              },
              {
                id: 5,
                name: '六安瓜片',
                imgUrl: './img/list/list1.jpeg'
              }
            ]
          }
        ]
      }
    ]
  })
})

//查询商品数据接口
router.get('/api/goods/shopList', function (req, res, next) {
  //前端给后端的数据
  let [searchName, orderName] = Object.keys(req.query)
  let [name, order] = Object.values(req.query)
  connection.query(
    'select * from goods_list where name like "%' +
      name +
      '%" order by ' +
      orderName +
      ' ' +
      order +
      '',
    function (error, results) {
      res.send({
        code: 0,
        data: results
      })
    }
  )
})

//IOS列表的数据
router.get('/api/index_list/2/data/1', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      {
        id: 1,
        type: 'adList',
        data: [
          {
            id: 1,
            imgUrl: './img/alike/tgy.jpeg'
          },
          {
            id: 2,
            imgUrl: './img/alike/tgy.jpeg'
          }
        ]
      },
      {
        id: 2,
        type: 'likeList',
        data: [
          {
            id: 1,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          },
          {
            id: 2,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          },
          {
            id: 3,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          }
        ]
      }
    ]
  })
})

//前端列表的数据
router.get('/api/index_list/1/data/1', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      {
        id: 1,
        type: 'adList',
        data: [
          {
            id: 1,
            imgUrl: './img/alike/dhp.jpeg'
          },
          {
            id: 2,
            imgUrl: './img/alike/dhp.jpeg'
          }
        ]
      },
      {
        id: 2,
        type: 'likeList',
        data: [
          {
            id: 1,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          },
          {
            id: 2,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          },
          {
            id: 3,
            imgUrl: './img/like/like.jpeg',
            name: '建盏茶具套装 红色芝麻毫 12件套',
            price: 299
          }
        ]
      }
    ]
  })
})

//首页推荐的数据
router.get('/api/index_list/0/data/1', function (req, res, next) {
  res.send({
    code: 0,
    data: {
      topBar: [
        { id: 0, label: '推荐' },
        { id: 1, label: '前端' },
        { id: 2, label: 'IOS' },
        { id: 3, label: '设计' },
        { id: 4, label: '产品' },
        { id: 5, label: '茶具' },
        { id: 6, label: '人工智能' }
      ],
      data: [
        //这是swiper
        {
          id: 0,
          type: 'swiperList',
          data: [
            { id: 0, imgUrl: './img/swiper/swiper1.png' },
            { id: 1, imgUrl: './img/swiper/swiper2.png' },
            { id: 3, imgUrl: './img/swiper/swiper3.png' }
          ]
        },
        //这是icons
        {
          id: 1,
          type: 'iconsList',
          data: [
            {
              id: 1,
              title: '限时特价',
              imgUrl: './img/icons/icons1.png'
            },
            {
              id: 2,
              title: '家用电器',
              imgUrl: './img/icons/icons2.png'
            },
            {
              id: 3,
              title: '福利',
              imgUrl: './img/icons/icons3.png'
            },
            {
              id: 4,
              title: '服饰美妆',
              imgUrl: './img/icons/icons4.png'
            }
          ]
        },
        //爆款推荐
        {
          id: 3,
          type: 'recommendList',
          data: [
            {
              id: 1,
              name: '龙井1號铁罐250g',
              content: '鲜爽甘醇 口粮首选',
              price: '68',
              imgUrl: './img/recommend/recommend.jpeg'
            },
            {
              id: 2,
              name: '龙井1號铁罐250g',
              content: '鲜爽甘醇 口粮首选',
              price: '68',
              imgUrl: './img/recommend/recommend.jpeg'
            }
          ]
        },
        //猜你喜欢
        {
          id: 4,
          type: 'likeList',
          data: [
            {
              id: 1,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 2,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 3,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 4,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 5,
              imgUrl: './img/like/like2.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 6,
              imgUrl: './img/like/like3.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 7,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 8,
              imgUrl: './img/like/like2.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 9,
              imgUrl: './img/like/like3.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            },
            {
              id: 10,
              imgUrl: './img/like/like.jpeg',
              name: '建盏茶具套装 红色芝麻毫 12件套',
              price: 299
            }
          ]
        }
      ]
    }
  })
})

module.exports = router
