## mall-master

# 一、路径上的配置

vue.config.js 配置了@代表 src 目录

    代码：

    const path = require('path')

    module.exports = defineConfig({
    	transpileDependencies: true,
    	lintOnSave: false,
    	chainWebpack: (config) => {
    	config.resolve.alias
    		.set('@', path.resolve(**dirname, 'src'))
    		.set('assets', path.resolve(**dirname, 'src/assets'))
    		.set('components', path.resolve(**dirname, 'src/components'))
    		.set('common', path.resolve(**dirname, 'src/common'))
    		.set('views', path.resolve(\_\_dirname, 'src/views'))
    	}
    })

# 二、定义 tabbar

    跳转this.$router.xxx

    判断：如果是当前路由切换，就不跳转(return)

    	  $router和$route 的区别：

    	$router 对象：这是一个全局对象，用于管理整个应用的路由信息。你可以使用它来获取当前路由、导航到新的路由、重定向到新的路由，以及注册路由守卫等。
    	$route对象：这是一个包含当前路由信息的对象，它包含了当前路由的各个参数，如path、params、query等。这个对象只在当前路由的组件内部有效。

# 三、目录分配

    views 		==> 页面
    components  ==> 页面中的组件（模块）

# 四、头部 topbar 切换插件

    1、下载插件
    npm install ly-tab -S
    npm install vue-awesome-swiper -s
    2、引入插件
    import LyTab from 'ly-tab'
    Vue.use(LyTab)

# 五、swiper 插件

    1、下载插件
    npm install vue-awesome-swiper -s
    2、引入插件
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import 'swiper/dist/css/swiper.css'

# 六、better-scroll 插件 滚动

    1、下载插件
    	npm install better-scroll -S
    2、引入插件
    	import BScroll from 'better-scroll'
    	注意事项：子元素高度要比父元素高度高，必须添加在mounted中

# 七、vue 中的 ref ： 获取 dom

    	设置：<div ref='aaa'></div>
    	获取：this.$refs.aaa

# 八、当 dom 更新完在加载?

    this.$nextTick(()=>{

    })

# 九、Mint UI 插件

    1、下载插件
    		npm install mint-ui -S
    2、引入插件
    	import MintUI from 'mint-ui'
    	import 'mint-ui/lib/style.css'
    	Vue.use(MintUI)

# 十、axios 二次封装

    对 axios 进行二次封装，提升方便性和维护性

# 十一、引入 sass

    1.安装下载

    	npm install node-sass -S
    	npm install sass-loader -S

    2.使用

    	<style scoped lang='scss'></style>

# 十二、better-scroll 默认取消 click 事件

    	解决：
    			new BScroll('.list-l', {
        click: true
      })

# 十三、better-scroll 默认取消 scroll 事件

    	probeType默认为0（一般用2|3）
    		1. probeType 为 0，在任何时候都不派发 scroll 事件，
    		2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    		3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    		4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画

# 十四、路由传值

    	显式：
    		this.$router.push({
        path: '/detail',
        query: {
          id: id
        }
      })
    	隐式：
    		this.$router.push({
        name: 'Detail',
        params: {
          id: id
        }
      })

# 十五、keep-alive 是 vue 的一个内置组件

    	作用：缓存组件，避免重新渲染
    	优势：提升性能
    		只要用到keep-alive，组件就会被缓存，下次切换时，不会重新渲染，而是直接从缓存中拿数据，这样就避免了重新渲染，提升性能。会再多2个生命周期：activated 和 deactivated
    		使用：可以在路由配置中使用 meta 字段来控制是否缓存特定的页面。

# 十六、接入短信验证码 SDk 腾讯云

    	后端下载 npm install qcloudsms_js

# 十七、vant

    	下载：npm install vant -S
    		引用：
    			import Vant from 'vant'
    			import 'vant/lib/index.css'
    			Vue.use(Vant)

# 十八、token(令牌)

    				token：是一个令牌，用来验证用户身份，后端生成的，并且token是唯一的，而且只能被使用一次，所以要保存在本地
    			作用(场景):验证用户
    				使用流程：
    					 1. 用户登录：用户通过提供用户名和密码来登录。服务器验证这些凭据，如果凭据有效，服务器将生成一个Token。

    						2. 发送 Token：服务器将生成的 Token 发送回用户。这个 Token 通常在 HTTP 响应的头部或者体中发送。

    					3. 存储 Token：用户收到 Token 后，将其存储在本地，比如在 Cookie 或者 LocalStorage 中。

    					4. 使用 Token：之后，每当用户向服务器发送请求时，都会在请求的头部中包含这个 Token。服务器会验证这个 Token，如果 Token 有效，服务器就知道这个请求是由哪个用户发送的，并且可以根据用户的权限来处理这个请求。

    					5. 刷新 Token：Token 通常有一个过期时间。当 Token 过期后，用户需要重新登录来获取新的 Token。有些系统也提供了刷新 Token 的机制，可以在不需要用户重新登录的情况下获取新的 Token
    	下载：npm install jsonwebtoken -S
    		引入：require('jsonwebtoken')
    			生成token：jwt.sign(用户信息, 秘钥, 有效期)
    				解析token：jwt.decode(token)

# 十九、订单 ==》 支付

    		生成订单
    		待支付
    		支付失败
    		支付成功

    			一、点击去结算
    					1.1 生成一个订单「要发送一个请求」 生成订单是后端做的事情，记录值为：1
    							后端会给前端返回一个订单号
    					1.2 跳转到【提交订单】页面
    							***生成一个订单：1 【未支付】{后端做的}
    			二、点击提交订单
    					2.1 发送一个请求 把订单号传递给后端，后端要进行 订单状态的改变「待支付:2」
    							***如果返回了数据，就下一步
    					2.2 再发送一个请求「要去支付」 ***后端会返回一个url 这个url就是进入支付的页面
    			三、支付成功 或者 支付失败
    					后端支付完成会跳转一个页面
    			四、进入页面
    					前端在这个页面中，再去请求一次，拿到后端给前端的数据
    					数据（订单支付成功了还是订单支付失败）

    			订单状态： 未支付：1 待支付：2 支付成功：3 支付失败：4 | 0

# 二十、对接支付宝沙箱(进行支付)nodejs

    	api链接：https://github.com/alipay/alipay-sdk-nodejs-all
    	api链接：https://www.yuque.com/chenqiu/alipay-node-sdk/config-sdk
    		***测试支付，一定要用无痕浏览

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
