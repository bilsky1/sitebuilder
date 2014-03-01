//AjaxContentBlock
function AjaxContentBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<p>TODO - ajax block</p>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Ajax content block options</p>";
    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update AJAX block'>"  +
            this.settingsDialogCode +
            "</div>";
    };
}//AjaxContentBlock

extend(AjaxContentBlock,blockAbstractClass);