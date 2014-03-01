//ImageBlock
function ImageBlock(id, elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='imageAlign'><a class='fancybox' href='#'><img src='http://lorempixel.com/200/100/abstract/'></a></div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =  "<form action='' class='ImageForm'>" +
        "<table><tr><td>Align:</td><td>" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='centerAlign'><i class='fa fa-align-center'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</td></tr></table>" +
        "</form>";

    this.setAlignHandler = function(){
        var block = this;
        $("#" + this.settingsDialogId).find("form.ImageForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".imageAlign").css("text-align","left");
        });
        $("#" + this.settingsDialogId).find("form.ImageForm").find(".centerAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".imageAlign").css("text-align","center");
        });
        $("#" + this.settingsDialogId).find("form.ImageForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".imageAlign").css("text-align","right");
        });
    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update image'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.initDialogWindowSettings = function(){
        $("#" + this.id).find("a.fancybox").fancybox();
        this.setAlignHandler();
    };

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
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };

}//ImageBlock

extend(ImageBlock,blockAbstractClass);