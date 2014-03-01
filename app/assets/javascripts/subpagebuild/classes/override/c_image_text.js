//ImageTextBlock
function ImageTextBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='imageAndText'><a class='fancybox' href='#'><img src='http://lorempixel.com/200/100/abstract/'></a><p class='ckeditor'>Lorem ipsum text</p></div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form action='' class='ImageTextForm'>" +
        "<table><tr><td>Align:</td><td>" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</td></tr></table>" +
        "</form>";

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update image + Text block'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).find("a.fancybox").fancybox();
        $("#" + this.settingsDialogId).find("form.ImageTextForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).find(".imageAndText").find("a").css({ marginRight: 15, float: "left" });
        });
        $("#" + this.settingsDialogId).find("form.ImageTextForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).find(".imageAndText").find("a").css({ marginLeft: 15, float: "right" });
        });
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

}//ImageTextBlock

extend(ImageTextBlock,blockAbstractClass);