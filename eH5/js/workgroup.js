/**
 此js依赖以下js

 <script type="text/javascript" src="//cdn.bootcss.com/stomp.js/2.3.3/stomp.js" charset="utf-8"></script>
 */
var WorkGroup = {};

/**
 * 初始化连接方法
 * @param token 用户的token
 * @param role 用户角色
 * @param onConnected 连接成功回调,function onConnected(sos){} ,连接成功后注册需要的回调
 * @param onError 连接成功回调,function onError(err){}
 */
WorkGroup.connect = function (wsUrl, token, role, onConnected, onError) {
    if (WorkGroup.stompClient) {
        WorkGroup.stompClient.disconnect(function () {
            console.log("主动断开连接");
        });
        WorkGroup.stompClient = null;
    }
    wsUrl += "?token=" + token + "&role=" + role;
    console.log("wsUrl = " + wsUrl);
    WorkGroup.token = token;
    WorkGroup.role = role;
    // var sock = new SockJS("/ws?token="+token+"&role="+role);
    // WorkGroup.stompClient = Stomp.over(sock);
    // WorkGroup.stompClient = Stomp.client(wsUrl);
    // 向服务器发起websocket连接并发送CONNECT帧
    // WorkGroup.stompClient.heartbeat.outgoing = 20000;
    // WorkGroup.stompClient.heartbeat.incoming = 0;
    // WorkGroup.stompClient.connect({//连接头
    // }, function (frame) {
    //     console.log("stomp 连接服务器成功");
    //     WorkGroup.stompClient.subscribe('/user/' + WorkGroup.token + '/pong', function (response) {
    //         console.log("收到心跳：" + response.body);
    //     });
    //     WorkGroup.startHeartbeat();
    //     if (onConnected) {
    //         onConnected();
    //     }
    // }, function (error) {
    //     console.log("stomp 连接失败 " + error);
    //     if (onError) {
    //         onError(error);
    //     }
    // });
};

/**
 * 注册全局sos消息接收器，调用此方法前必须连接成功
 * @param callback 有新sos回调,function onSosCallback(sos){}
 */
WorkGroup.registerGlobalSos = function (callback) {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.globalSosSubscribeId = WorkGroup.stompClient.subscribe('/user/' + WorkGroup.token + '/global/sos', function (response) {
        console.log("收到呼救：" + response.body);
        var data = JSON.parse(response.body);
        if (callback) {
            callback(data);
        }
    });
};

/**
 * 取消注册全局sos监听
 */
WorkGroup.unRegisterGlobalSos = function () {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    console.log("取消监听global sos "+WorkGroup.globalSosSubscribeId);
    if (WorkGroup.globalSosSubscribeId) {
        WorkGroup.globalSosSubscribeId.unsubscribe();
        WorkGroup.globalSosSubscribeId = null;
    }
};

/**
 * 注册区域sos消息接收器，调用此方法前必须连接成功
 * @param callback 有新sos回调,function onSosCallback(sos){}
 */
WorkGroup.registerAreaSos = function (callback) {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.areaSosSubscribeId = WorkGroup.stompClient.subscribe('/user/' + WorkGroup.token + '/area/sos', function (response) {
        console.log("收到呼救：" + response.body);
        var data = JSON.parse(response.body);
        if (callback) {
            callback(data);
        }
    });
};

/**
 * 取消注册区域sos监听
 */
WorkGroup.unRegisterAreaSos = function () {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    console.log("取消监听area sos "+WorkGroup.areaSosSubscribeId);
    if (WorkGroup.areaSosSubscribeId) {
        WorkGroup.areaSosSubscribeId.unsubscribe();
        WorkGroup.areaSosSubscribeId = null;
    }
};

/**
 * 注册sos聊天房间消息接收器，调用此方法前必须连接成功
 * @param callback sos房间信息回调,function onChatRoomCallback(chatRoom){}
 */
WorkGroup.registerSosRoom = function (callback) {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.sosRoomSubscribeId = WorkGroup.stompClient.subscribe('/user/' + WorkGroup.token + '/sos/room', function (response) {
        console.log("收到房间：" + response.body);
        var data = JSON.parse(response.body);
        if (callback) {
            callback(data);
        }
    });
};

/**
 * 取消注册房间监听
 */
WorkGroup.unRegisterSosRoom = function () {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    console.log("取消监听sosroom "+WorkGroup.sosRoomSubscribeId);
    if (WorkGroup.sosRoomSubscribeId) {
        WorkGroup.sosRoomSubscribeId.unsubscribe();
        WorkGroup.sosRoomSubscribeId = null;
    }
};

/**
 * 同步消息，调用此方法前必须注册号相关消息接收器，否则可能无法接收到之前接受的呼救信息
 */
WorkGroup.sync = function () {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.stompClient.send("/app/sync", {}, JSON.stringify({}));
};

/**
 * 接收呼救id
 * @param sosId 呼救id
 */
WorkGroup.acceptSos = function (sosId) {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.stompClient.send("/app/sos/accept", {}, JSON.stringify({
        sosId: sosId
    }));
};

/**
 * 改变直播源
 * @param sosId 呼救id
 * @param videoUrl 视频url
 */
WorkGroup.changeLiveSource = function (sosId, videoUrl, videoUser) {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    console.log("改变直播源 "+sosId+" "+videoUrl+" "+videoUser);
    WorkGroup.stompClient.send("/app/sos/change/live", {}, JSON.stringify({
        sosId: sosId,
        videoUrl: videoUrl,
        videoUser: videoUser
    }));
};

/**
 * 开始心跳
 */
WorkGroup.startHeartbeat = function () {
    WorkGroup.stopHeartbeat();
    WorkGroup.heartbeatHandler = setInterval(function () {
        WorkGroup.ping();
        $.get("/api/login/keeplive", function (result) {
            console.log("keeplive");
        });
    }, 20000);
}

/**
 * 开始心跳
 */
WorkGroup.stopHeartbeat = function () {
    if (WorkGroup.heartbeatHandler) {
        clearInterval(WorkGroup.heartbeatHandler);
    }
    WorkGroup.heartbeatHandler = null;
}

/**
 * 心跳
 */
WorkGroup.ping = function () {
    if (!WorkGroup.stompClient) {
        throw '尚未连接到服务端';
    }
    WorkGroup.stompClient.send("/app/ping", {}, JSON.stringify({}));
};

/**
 * 检测是否ie浏览器
 * @returns {boolean}
 */
function checkIE() {
    var bIE = false;
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        bIE = true;
    }
    else if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        bIE = true;
    }
    else {
        bIE = false;
    }

    return bIE;
}