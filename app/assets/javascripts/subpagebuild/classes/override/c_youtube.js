//YoutubeBlock
function YoutubeBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='youtubeVideo'>" +
        "<iframe src='//www.youtube.com/embed/hhKXsLFKYqc' frameborder='0' allowfullscreen></iframe>" +
        "</div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form class='YoutubeForm' action=''>" +
        "<table>" +
        "<tr><td>Height:</td><td><input type='text' name='heightValue'></td></tr>" +
        "<tr><td>Video ID:</td><td><input type='text' name='videoIdValue'></td></tr>" +
        "</table>";
    "</form> ";

    this.videoID ="";
    //getSettingsDialogCode - build settings dialog code
    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update youtube block'>"  +
            this.settingsDialogCode +
            "</div>";
    };//getSettingsDialogCode

    this.getvideoIdFromUrl = function(url){
        var videoID = "";
        for (var i = 1; i <= url.length; i++){
            if(url.slice(-i).substr(0,1) !== "/"){
                videoID = url.slice(-i);
            } else{
                break;
            }
        }
        return videoID;
    }

    this.initDialogWindowSettings = function(){
        var height = $("#" + this.id).children(".youtubeVideo").children("iframe").css("height");
        this.videoID = this.getvideoIdFromUrl($("#" + this.id).children(".youtubeVideo").children("iframe").attr("src"));

        $("#" + this.settingsDialogId).find("form.YoutubeForm").find("input[name*='heightValue']").val(height);
        $("#" + this.settingsDialogId).find("form.YoutubeForm").find("input[name*='videoIdValue']").val(this.videoID);
    };

    //setSettingsHandler - default on click show settings dialog
    this.setSettingsHandler = function(){
        var block = this;
        $("#"+this.id).find('.blockControls:first-child').find('.modifyBlock').on("click",function(e){
            block.videoID = block.getvideoIdFromUrl($("#" + block.id).children(".youtubeVideo").children("iframe").attr("src"));
            $("#" + block.settingsDialogId).find("form.YoutubeForm").find("input[name*='videoIdValue']").val(block.videoID);
            $('#' + block.settingsDialogId).dialog("open");
        });
    };//setSettingsHandler

    this.createDialogWindow = function(){
        var block = this;
        $("#" + this.id).append("\n" + this.getSettingsDialogCode());
        this.initDialogWindowSettings();
        $('#' + this.settingsDialogId).dialog({
            resizable: false,
            height:"auto",
            width:"suto",
            modal: true,
            autoOpen: false,
            buttons: {
                "Save": function() {
                    var height = $("#" + block.settingsDialogId).find("form.YoutubeForm").find("input[name*='heightValue']").val();
                    $("#" + block.id).children(".youtubeVideo").children("iframe").css("height",height);
                    var newVideoID = $("#" + block.settingsDialogId).find("form.YoutubeForm").find("input[name*='videoIdValue']").val();
                    var newSrc = $("#" + block.id).children(".youtubeVideo").children("iframe").attr("src").replace(block.videoID,newVideoID);
                    $("#" + block.id).children(".youtubeVideo").children("iframe").attr("src",newSrc);
                    $( this ).dialog( "close" );
                    isContentChange = true;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };
}//YoutubeBlock

extend(YoutubeBlock,blockAbstractClass);