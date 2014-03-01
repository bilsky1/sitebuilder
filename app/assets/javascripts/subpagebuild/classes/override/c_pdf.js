//PdfBlock
function PdfBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<p>TODO - pdf</p>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>PDF block options</p>";

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update PDF block'>"  +
            this.settingsDialogCode +
            "</div>";
    };
}//PdfBlock

extend(PdfBlock,blockAbstractClass);