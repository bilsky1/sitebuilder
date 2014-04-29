//MapsBlock
function MapsBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;

    this.genBlockCode = "<div data-loc='Trnava' data-zoom='12' class='googleMaps'></div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form class='MapForm' action=''>" +
        "<table>" +
        "<tr><td>Height: </td><td><input type='text' name='heightValue'></td></tr>" +
        "<tr><td>Address: </td><td><input type='text' name='addressValue'></td></tr>" +
        "<tr><td>Zoom: </td><td><select>" +
        "<option value='1'>1 (far)</option>" +
        "<option value='2'>2</option>" +
        "<option value='3'>3</option>" +
        "<option value='4'>4</option>" +
        "<option value='5'>5</option>" +
        "<option value='6'>6</option>" +
        "<option value='7'>7</option>" +
        "<option value='8'>8</option>" +
        "<option value='9'>9</option>" +
        "<option value='10'>10</option>" +
        "<option value='11'>11</option>" +
        "<option value='12'>12</option>" +
        "<option value='13'>13</option>" +
        "<option value='14'>14</option>" +
        "<option value='15'>15</option>" +
        "<option value='16'>16</option>" +
        "<option value='17'>17 (close)</option>" +
        "</select></td></tr>" +
        "</table>" +
        "</form> ";

    this.map;
    this.mapOptions;
    this.markers = new Array();
    this.geocoder;

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update map block'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.deleteAllMarkers = function(){
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    };

    this.codeAdressGoogleMapsApi = function(address,zoom) {
        var block = this;
        this.deleteAllMarkers();
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                block.map.setCenter(results[0].geometry.location);
                block.map.setZoom(zoom);
                var marker = new google.maps.Marker({
                    map: block.map,
                    position: results[0].geometry.location
                });
                block.markers.push(marker);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update map options'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.initializeGoogleMap = function(){
        //48.380, 17.587 - GPS of Trnava // for initialization
        var block = this;
        var zoom = parseInt($("#" + block.id).children(".googleMaps").data("zoom"));
        var location = $("#" + block.id).children(".googleMaps").data("loc");
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode( { 'address': location}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                block.mapOptions = {
                    zoom: zoom,
                    center: results[0].geometry.location
                };
                block.map = new google.maps.Map($("#" + block.id).children(".googleMaps")[0],block.mapOptions);
                var marker = new google.maps.Marker({
                    map: block.map,
                    position: results[0].geometry.location
                });
                block.markers.push(marker);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });



        $("#" + this.settingsDialogId).find("form.MapForm").find("input[name*='addressValue']").val(location);
    };

    this.initDialogWindowSettings = function(){
        var map = this.map;
        var height = $("#" + this.id).children(".googleMaps").css("height");
        $("#" + this.settingsDialogId).find("form.MapForm").find("input[name*='heightValue']").val(height);
    };

    //setSettingsHandler - default on click show settings dialog
    this.setSettingsHandler = function(){
        var block = this;
        $("#"+this.id).find('.blockControls:first-child').find('.modifyBlock').on("click",function(e){
            $("#" + block.settingsDialogId).find("form.MapForm").find("select option").removeAttr("selected");
            $("#" + block.settingsDialogId).find("form.MapForm").find("select option[value*='" + block.map.getZoom() +"']").attr("selected","selected");
            $('#' + block.settingsDialogId).dialog("open");
        });
    };//setSettingsHandler

    this.createDialogWindow = function(){
        var block = this;
        $("#" + this.id).append("\n" + this.getSettingsDialogCode());
        this.initDialogWindowSettings();
        this.initializeGoogleMap();
        $('#' + this.settingsDialogId).dialog({
            resizable: false,
            height:"auto",
            width:"suto",
            modal: true,
            autoOpen: false,
            buttons: {
                "Save": function() {
                    var address = $("#" + block.settingsDialogId).find("form.MapForm").find("input[name*='addressValue']").val();
                    var zoom = $("#" + block.settingsDialogId).find("form.MapForm").find("select option:selected").val();
                    block.codeAdressGoogleMapsApi(address,parseInt(zoom));
                    var height = $("#" + block.settingsDialogId).find("form.MapForm").find("input[name*='heightValue']").val();
                    $("#" + block.id).children(".googleMaps").css("height",height);

                    $("#" + block.id).children(".googleMaps").attr("data-loc",address);
                    $("#" + block.id).children(".googleMaps").attr("data-zoom",zoom);

                    $( this ).dialog( "close" );
                    isContentChange = true;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };
}//MapsBlock

extend(MapsBlock,blockAbstractClass);