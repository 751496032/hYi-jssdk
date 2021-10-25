[toc]

# hYi-sdk使用文档

## 步骤一：引入JS文件

在需要调用JS接口的页面引入如下JS文件`https://cdn.jsdelivr.net/gh/751496032/hYi-sdk@版本号/hYi-sdk.js`

版本记录查看：https://github.com/751496032/hYi-jssdk/releases

```
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/751496032/hYi-sdk@1.0.4/hYi-sdk.js"></script>
    或者 默认使用最新版本
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/751496032/hYi-sdk/hYi-sdk.js"></script>
```

## 步骤二：配置全局参数

通过调用`config()`函数配置全局参数，是可选的，如下：

```
// 内部封装了js调用native的逻辑
 window.config({debug:true})

```
- debug: 当为true时，js层面会输出参数与函数回调等信息，app层需要将异常信息通过alert显示出来，默认是false

目前暂时只有debug参数，后续会增加

## 接口说明

在js中统一调用`takeNativeActionWithCallback`函数，内部封装了js调用native的逻辑，最多可以传入三个参数，依次是调用native方法命令、参数、回调方法对象。

> js调用native接口的对象名称是hYi，调用方式是`hYi.takeNativeAction(JSON.stringify(request))` 

方法回调通用参数如下：

- success：接口调用成功时执行的回调函数。
- fail：接口调用失败时执行的回调函数。
- complete：接口调用完成时执行的回调函数，无论成功或失败都会执行。


使用如下：

```
takeNativeActionWithCallback("login", // native方法命令
                {  // 传给native的参数，是一个对象,
                    targetClassName: "com.xxx"
                },
                {  // 回调方法，native执行后，需要把结果通知js
                    success: function (res) { 
                        // 业务正常
                        console.log("success res: " + JSON.stringify(res))
                    },
                    fail: function (res) {
                        // 业务异常
                        console.log("fail res: " + JSON.stringify(res))
                    },
                    complete: function () {
                        console.log("complete res ")

                    }
                })
                
 // 或者
 // 这种是将回调函数与待传给native的参数混合放在一个对象中，与微信公众号api是类似的，建议使用
 takeNativeActionWithCallback("login",
                {
                    targetClassName: "com.xxx222",
                    success: function (res) {
                        console.log("success res: " + JSON.stringify(res))
                    },
                    fail: function (res) {
                        console.log("fail res: " + JSON.stringify(res))
                    },
                    complete: function () {
                        console.log("complete res ")

                    }
                })
```

如果不需要回调的情况，可不传回调函数。

## 测试

可以与<https://github.com/751496032/MultiProcessWebView> 配合测试，是一个Android WebView独立进程的项目。



