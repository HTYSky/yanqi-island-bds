// if (UnminedCustomMarkers && UnminedCustomMarkers.isEnabled && UnminedCustomMarkers.markers) {
//     UnminedMapProperties.markers = UnminedMapProperties.markers.concat(UnminedCustomMarkers.markers);
// }
// if (UnminedPlayers && UnminedPlayers.length > 0) {
//     UnminedMapProperties.markers = UnminedMapProperties.markers.concat(unmined.createPlayerMarkers(UnminedPlayers));
// }

// 引入自定义标记图层配置
if (UnminedCustomMarkerLayers?.isEnabled && UnminedCustomMarkerLayers?.customMarkerLayers){
    UnminedMapProperties.customMarkerLayers = UnminedCustomMarkerLayers?.customMarkerLayers;
}

// 获取playerMarker、webchat配置
$.ajaxSettings.async = false;
$.ajax({
    url: `/api/conf`,
    type: "GET",
    success: function (data) {
        // openlayers options()
        UnminedMapProperties =  {...UnminedMapProperties, ...data["openlayers"]["options"]};

        // 网站标题
        if (data?.webserver?.mapTitle  != 'default'){
            document.title = data?.webserver?.mapTitle;
        }else{
            document.title = UnminedMapProperties.worldName + " - " + document.title;
        }

        // 网页聊天
        UnminedMapProperties.webChat = data["webChat"];

        // 玩家标记
        UnminedMapProperties.playerMarker = data["openlayers"]["playerMarker"];
    }
});

// 获取自定义标记配置
$.get("/api/getCustomMarkerLayers",(data,status)=>{
    if (data?.length != 0){
        UnminedMapProperties.customMarkerLayers = UnminedMapProperties.customMarkerLayers.concat(data?.customMarkerLayers ?? []);
    }
});

$.ajaxSettings.async = true;