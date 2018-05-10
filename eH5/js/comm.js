$(function () {
    fitScreen();    //网页内容适配屏幕宽度
})

//屏幕大小切换
$(window).resize(function(){
    fitScreen();    //网页内容适配屏幕宽度
});

//网页内容适配屏幕宽度
function fitScreen() {
    var s = 100/360;  //屏幕宽度和font-size的比例
    var screenW = $(window).width();
    var htmlF = screenW * s; //算出正确的font-size
    $("html").css("font-size",htmlF+"px");
}



var sosId = 52;
var token = '3afb5a0c88024d17bce70362eb4bfbcf';
var currentLiveUserId = null;
var role = "FRONT_OPERATOR";
var roomId = null;
var wsUrl = 'wss://gz2.qa.super999.cn/ws'
var rtcConfig = {
    sdkAppId:1400084584,
    openid:'FRONT_OPERATOR-5',
    userSig:'eJxFkNFugkAQRf*FV9tmWVi6NukDKgi1FYOrTXjZwDLiloIEtoJt*u9FgunrOTO5M-dHY6-bh7iqZMpjxY061Z40pN0NGLpK1sDjg4K6x5hMMUI3eYa6kafyypFOdGwg9C9lCqWSBznsuWGwZjzYOKHNgvCejDONzHr55uzm-mJZTKJQRnbS7ifgCxcvX*biaGTOhwXQeruElO3j3hLs3ZaOfeyi2dbL-SxZW5dvd1HNAnXOvLZr05xtgtUnFDiJVqwWzfMtLM358GUfqZv9odQk1BylkgVcOcGEUkSn1shjIU5fpeLqUsFQy*8fEAxbNQ__',
    accountType:25487,
    localVideoId:'myVideoView',
    remoteVideoContainerId:'videoContainer',
    closeLocalMedia:true
};

var rtc = null;


$(function () {

});


// function initWebsocket() {
//     WorkGroup.connect(wsUrl,token,role,function () {
//         updateStatus("websocket链接成功");
//         WorkGroup.registerGlobalSos(onNewSosCome);
//         WorkGroup.registerSosRoom(onSosRoomCome);
//         WorkGroup.sync();
//     },function () {
//         alert("链接失败，请刷新页面");
//     });
// }
//
//
// function onNewSosCome(sos) {
//     console.log("收到sos呼救");
//     console.log(JSON.stringify(sos));
//     updateStatus("收到呼救信息");
//     if(sosId == sos.id)
//     {
//         WorkGroup.unRegisterGlobalSos();
//         WorkGroup.acceptSos(sosId);
//     }
// }
//
//
// var hasJoin = false;
// function onSosRoomCome(chatRoom) {
//     updateStatus("收到房间信息");
//     console.log(JSON.stringify(chatRoom));
//     if(chatRoom.sosId == sosId && !hasJoin){
//         WorkGroup.unRegisterSosRoom();
//         roomId = chatRoom.id;
//         currentLiveUserId = chatRoom.videoUser;
//         hasJoin = true;
//         initRTC();
//     }
// }
//
// function initRTC() {
//
//     updateStatus("正在初始化视频参数...");
//
//     rtc = new WebRTCAPI({
//         "openid": rtcConfig.openid,
//         "preconn": 0,
//         "sdkAppId":  rtcConfig.sdkAppId,
//         "accountType":  rtcConfig.accountType,
//         "userSig": rtcConfig.userSig,
//         "closeLocalMedia": false
//     },function () {
//         updateStatus("初始化成功");
//         joinRoom();
//
//     },function () {
//         updateStatus("初始化失败");
//     });
//
// }
//
//
// function sendText() {
//     var msg = $("#msgInput").val();
//     RTCRoom.sendRoomTextMsg({
//         data:{
//             msg:msg
//         }
//     });
// }
//
//
// function updateRemoteViews(pusher) {
//
//     if( !pusher || !pusher.stream){
//         console.log("没有推流地址");
//         return;
//     }
//
//     var videoContainer = $("#videoContainer");
//
//     var userId = pusher.openId;//视频流所属用户的openId（ identifier ）
//     var stream = pusher.stream;//视频流 Stream，可能为 null( 每一个用户进来 不管是否推流，都会触发这个回调)
//     var videoId = pusher.videoId;//视频流Stream的唯一id ,由 tinyid + "_" + 由随机字符串 组成
//     var videoType = pusher.videoType; //0 : NONE , 1:AUDIO 音频, 2：主路 MAIN 7：辅路 AID
//
//
//     var frameId = "player_frame_"+userId;
//     var videoFrame = $("#"+frameId);
//
//     if(videoFrame.length <= 0){
//         videoFrame = $("#videoFrameTeplate").clone();
//         videoFrame.attr("id",frameId);
//         videoFrame.removeClass("d-none");
//         videoFrame.find(".card-header").text(userId);
//
//         if(currentLiveUserId == userId){
//             //主屏
//             videoFrame.find(".btn-change-live").text("主屏幕");
//         }
//         videoFrame.find(".btn-change-live").data("video-user",userId);
// //                videoFrame.find(".btn-change-live").attr("data-video-url",stream);
//         videoFrame.find(".btn-mute").data("video-user",userId);
// //                videoFrame.find(".btn-mute").attr("data-video-url",stream);
//
//         videoContainer.append(videoFrame);
//     }
//
//
//     var video = videoFrame.find(".video").get(0);
//     video.srcObject = pusher.stream;
// }
//
//
// function removeRemoteViews(pusher) {
//     var userId = pusher.openId;//视频流所属用户的openId（ identifier ）
//     var stream = pusher.stream;//视频流 Stream，可能为 null( 每一个用户进来 不管是否推流，都会触发这个回调)
//     var videoId = pusher.videoId;//视频流Stream的唯一id ,由 tinyid + "_" + 由随机字符串 组成
//     var videoType = pusher.videoType; //0 : NONE , 1:AUDIO 音频, 2：主路 MAIN 7：辅路 AID
//     var frameId = "player_frame_"+userId;
//     $("#"+frameId).remove();
// }
//
//
//
// function joinRoom() {
//     updateStatus("准备加入房间");
//     // 创建或进入房间
//
//     console.log("设置rtc监听");
//     //本地流 新增
//     rtc.on("onLocalStreamAdd", function(data){
//         console.log("本地视频添加成功 "+JSON.stringify(data));
//         if( data && data.stream){
//             document.getElementById("localVideoMedia").srcObject = data.stream;
//             var btns = $("#localVideoMedia").next();
//             btns.find(".btn-change-live").data("video-user",rtcConfig.openid);
//             btns.find(".btn-mute").data("video-user",rtcConfig.openid);
//
//             if(currentLiveUserId == rtcConfig.openid){
//                 //主屏
//                 btns.find(".btn-change-live").text("主屏幕");
//             }
//         }
//     });
//
//     //远端流 新增/更新
//     rtc.on("onRemoteStreamUpdate", function(data){
//         console.log("远端视频更新");
//         console.log("onRemoteStreamUpdate "+JSON.stringify(data));
//         updateRemoteViews(data);
//     });
//
//     //远端流 新增/更新
//     rtc.on("onRemoteStreamRemove", function(data){
//         console.log("远端视频删除");
//         console.log("onRemoteStreamRemove "+JSON.stringify(data));
//         removeRemoteViews(data);
//     });
//
//     //远端流关闭
//     rtc.on("onWebSocketClose", function(){
//         console.log("直播房间websocket断开");
//     });
//
//     console.log("设置rtc监听完成");
//
//     rtc.createRoom({
//         roomid:roomId,
//         role:"user"
//     },function () {
//         updateStatus("加入房间成功");
// //                rtc.startRTC();
//
//     },function () {
//         updateStatus("加入房间失败");
//     });
// }
//
// function onChangeLive(widget) {
// //            var videoUrl = $(widget).data("video-url");
//     var videoUser = $(widget).data("video-user");
//     WorkGroup.changeLiveSource(sosId,null,videoUser);
//     currentLiveUserId = videoUser;
//     $(".btn-change-live").text("设为主屏");
//     $(widget).text("主屏幕");
// }
//
//
// function onMute(widget) {
//     var video = $(widget).parent().prev().get(0);
//     var fas = $(widget).find(".fas");
//     if(video)
//     {
//         var mute = video.muted;
//         if(mute == null){
//             mute = false;
//         }
//
//         mute = !mute;
//         video.muted = mute;
//
//         if(mute){
//             fas.removeClass("fa-volume-up");
//             fas.addClass("fa-volume-off");
//         }else{
//             fas.removeClass("fa-volume-off");
//             fas.addClass("fa-volume-up");
//         }
//     }
// }
//
// function exitRoom() {
//     RTCRoom.exitRoom({
//         success:function () {
//             console.log("退出房间成功");
//         },
//         fail:function () {
//             console.log("退出房间失败");
//         }
//     });
// }
//
// function updateStatus(msg) {
//     $("#status").append("<div>"+msg+"</div>");
// }


