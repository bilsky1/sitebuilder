//GalleryBlock
function GalleryBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<a class='fancybox galItem' data-fancybox-group='" + this.id + "' href='#'><img src='http://lorempixel.com/200/100/food/'></a>" +
        "<a class='fancybox galItem' data-fancybox-group='" + this.id + "' href='#'><img src='http://lorempixel.com/200/100/people/'></a>"+
        "<a class='fancybox galItem' data-fancybox-group='" + this.id + "' href='#'><img src='http://lorempixel.com/200/100/abstract/'></a>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Gallery block options</p>";

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update gallery'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.initDialogWindowSettings = function(){
        $("#" + this.id).find("a.fancybox").fancybox();
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

}//GalleryBlock

extend(GalleryBlock,blockAbstractClass);