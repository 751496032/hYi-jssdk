    /**
     * @author HZWei
     * @date 2021/10/9
     * @desc
     */
        // 全局常量
    let constants = {};
    (function (constants) {
        function createConstant(name, val) {
            return Object.defineProperty(constants, name, {
                value: val,
                writable: false,
                enumerable: true
            })
        }

        constants.CALLBACK_SUCCESS = createConstant("CALLBACK_SUCCESS", "success")
        constants.CALLBACK_FAIL = createConstant("CALLBACK_FAIL", "fail")
        constants.CALLBACK_COMPLETE = createConstant("CALLBACK_COMPLETE", "complete")
        constants.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
        constants.isAndroid = /(Android)/i.test(navigator.userAgent)
    })(constants)
    window.constants = constants




    config = function (configs) {
        window.constants.debug = configs["debug"]
        // 执行native对应的方法
        try {
            if (window.constants.isAndroid){
                printLog("android device config")
                window.hYi.config(JSON.stringify(configs))
            }else if (window.constants.isIOS){
                printLog("ios device config")
                window.webkit.messageHandlers.config.postMessage(JSON.stringify(configs));
            }else {
                throw Error('config()函数不支持pc设备')
            }
        }catch (e) {
            printLog(e.message)
        }


    }

    /**
     * {"success_nativetojs_callback_1633687772081_8322":{callback:fun success()}}
     */
    let allCallbacks = {};
    nativetoJsCallback = function (callbackKey, response) {
        if (allCallbacks.hasOwnProperty(callbackKey)) {
            let callbackObj = allCallbacks[callbackKey]
            if (callbackObj !== undefined) {
                if (callbackObj.callback !== undefined) {
                    callbackObj.callback(response)
                    unregisterCallback(callbackKey)
                }
            }
        }
    }

    takeNativeActionWithCallback = function (commandName, params, callbacks) {
        let suffix = "nativetojs_callback_" + (new Date()).getTime() + "_" + Math.floor(Math.random() * 10000);
        let param = {} // 为了模仿微信api，重新组装参数
        let callbackNameKeys = []
        if (callbacks !== undefined) {
            for (let name in callbacks) {
                registerCallback(name, suffix, callbackNameKeys, callbacks[name])
            }
            param = params
        } else if (hasCallbackMethod(params)) {
            // 模仿微信公众号api
            for (let name in params) {
                if (name === constants.CALLBACK_SUCCESS ||
                    name === constants.CALLBACK_FAIL ||
                    name === constants.CALLBACK_COMPLETE) {
                    registerCallback(name, suffix, callbackNameKeys, params[name])
                } else {
                    param[name] = params[name]
                }
            }
        } else {
            param = params
        }
        if (window.constants.debug) {
            printLog("allCallbacks：" + JSON.stringify(allCallbacks))
        }

        let request = {}
        request.name = commandName
        request.param = param
        request.param.callbackNameKeys = callbackNameKeys;
        /**
         * {"name":"login","param":{"targetClassName":"com.xxx","callbackNameKeys":["success_nativetojs_callback_1633683965180_6434","fail_nativetojs_callback_1633683965180_6434","complete_nativetojs_callback_1633683965180_6434"]}}
         */
        if (window.constants.debug) {
            printLog("request：" + JSON.stringify(request))
        }
        // 执行native对应的方法

        try {
            if (window.constants.isAndroid){
                printLog("android device "+commandName)
                window.hYi.takeNativeAction(JSON.stringify(request))
            }else if (window.constants.isIOS){
                printLog("ios device "+ commandName)
                window.webkit.messageHandlers.takeNativeAction.postMessage(JSON.stringify(request));
            }else {
                printLog("pc device")
                throw Error('takeNativeActionWithCallback()函数不支持pc设备')
            }
        }catch (e){
            for (let index in callbackNameKeys) {
                unregisterCallback(callbackNameKeys[index])
            }
            console.error(e.message)
            alert(e.message)
        }

    }


    printLog = function(message){
        console.log(message)
        // if (constants.debug){
        //     printLog(message)
        // }
    }


    registerCallback = function (name, suffix, callbackNameKeys, callback) {
        let callbackNameKey = name + "_" + suffix
        callbackNameKeys.push(callbackNameKey)
        allCallbacks[callbackNameKey] = {callback: callback}
    }

    unregisterCallback = function (callbackNameKey) {
        delete allCallbacks[callbackNameKey] // 移除，防止内存泄漏
    }

    hasCallbackMethod = function (params) {
        if (params === undefined) return false
        return params.hasOwnProperty(constants.CALLBACK_SUCCESS) ||
            params.hasOwnProperty(constants.CALLBACK_FAIL) ||
            params.hasOwnProperty(constants.CALLBACK_COMPLETE);
    }