//TextBlock
function TextBlock(id, elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.genBlockCode = "<div class='ckeditor'><p>Testovaci text</p></div>";

    //this.settingsCode = "";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Text block options</p>";
}//TextBlock

extend(TextBlock,blockAbstractClass);