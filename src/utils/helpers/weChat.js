if(navigator.userAgent.indexOf("wxwork")>0){
	Qywx_Jsapi_Config = configData.wxwork;
	console.log("Qywx_Jsapi_Config:" + JSON.stringify(Qywx_Jsapi_Config));
	//alert(JSON.stringify(Qywx_Jsapi_Config))
	wx.config({
		beta:true,
		debug:false, 
		appId:Qywx_Jsapi_Config.corpid,                 //"ww57e3818dd9d1b2e3",//Qywx_Jsapi_Config.corpId,
		timestamp:Qywx_Jsapi_Config.timestamp,          //1589612184,//Qywx_Jsapi_Config.timeStamp,
		nonceStr:Qywx_Jsapi_Config.nonceStr,            //"524j5xkSnOs590RT",//Qywx_Jsapi_Config.nonceStr,
		signature:Qywx_Jsapi_Config.signature_wx,
		jsApiList: [			
			'startRecord',
			'stopRecord',
			'onVoiceRecordEnd',
			'onVoicePlayEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',        
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'scanQRCode',
			'invoke',
			'selectEnterpriseContact',
			'openEnterpriseChat',
			'openUserProfile',
			'shareAppMessage',
			'updateEnterpriseChat',
			'openExistedChatWithMsg'
		],
		success:function(res) {
			alert("注入应用成功:"+JSON.stringify(res));
		},
		fail:function(res) {			
			if(res.errMsg.indexOf("function not exist") > -1){
				alert("版本过低请升级")
			}else{
				alert("注入应用失败:"+JSON.stringify(res))
			}
		}
	});	
	wx.ready(function() {
		//代开发使用下面的注入
		if(Qywx_Jsapi_Config.build == "代开发"){
			wx.agentConfig({
				corpid: Qywx_Jsapi_Config.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
				agentid: Qywx_Jsapi_Config.agentid, // 必填，企业微信的应用id （e.g. 1000247）
				timestamp: Qywx_Jsapi_Config.timestamp, // 必填，生成签名的时间戳
				nonceStr: Qywx_Jsapi_Config.nonceStr, // 必填，生成签名的随机串
				signature: Qywx_Jsapi_Config.signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
				jsApiList: ['selectExternalContact','getContext','getCurExternalChat','sendChatMessage','shareAppMessage','openEnterpriseChat','updateEnterpriseChat','openExistedChatWithMsg','setShareAttr','getContext','getShareInfo','startRecord','stopRecord','onVoiceRecordEnd','onVoicePlayEnd','playVoice','pauseVoice','stopVoice',	'uploadVoice','downloadVoice','chooseImage','previewImage',	'uploadImage','downloadImage','scanQRCode','invoke','selectEnterpriseContact'],//必填，传入需要使用的接口名称
				success: function(res) {
					// 回调
					//alert("代开发注入应用成功")
				},
				fail: function(res) {
					if(res.errMsg.indexOf("function not exist") > -1){
						alert("代开发注入应用失败:版本过低请升级")
					}else{
						alert("代开发注入应用失败:"+JSON.stringify(res))
					}
				}
			});
		}else{
			//agentConfig注入
			wx.agentConfig({
				corpid: Qywx_Jsapi_Config.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
				agentid: Qywx_Jsapi_Config.agentid, // 必填，企业微信的应用id （e.g. 1000247）
				timestamp:Qywx_Jsapi_Config.timestamp , // 必填，生成签名的时间戳
				nonceStr: Qywx_Jsapi_Config.nonceStr, // 必填，生成签名的随机串
				signature: Qywx_Jsapi_Config.signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
				//jsApiList: ['selectExternalContact','getContext','getCurExternalChat','sendChatMessage','shareAppMessage','getCurExternalContact','openEnterpriseChat','openUserProfile','selectEnterpriseContact','invoke','scanQRCode','downloadImage','uploadImage','previewImage','chooseImage','downloadVoice','uploadVoice','stopVoice','pauseVoice','playVoice','onVoicePlayEnd','onVoiceRecordEnd','stopRecord','startRecord'], //必填  getCurExternalChat
				jsApiList: ['selectExternalContact','getContext','getCurExternalChat','sendChatMessage','shareAppMessage','openEnterpriseChat','updateEnterpriseChat','openExistedChatWithMsg','setShareAttr','getContext','getShareInfo'], //必填  getCurExternalChat
				success: function(res) {
					alert("企业微信注入应用成功")
				},
				fail: function(res) {
					if(res.errMsg.indexOf("function not exist") > -1){
						alert("企业微信注入应用失败:版本过低请升级")
					}else{
						alert("企业微信注入应用失败:" + JSON.stringify(res))
					}
				}
			});
		}
	});
	wx.error(function(err) {
		alert("企业微信注入应用错误:" + JSON.stringify(err));
	});	
		
}