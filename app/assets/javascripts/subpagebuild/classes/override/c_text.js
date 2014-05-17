//TextBlock
function TextBlock(id, elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.genBlockCode = "<div class='ckeditor'><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit,...</p></div>";

    this.settingsCode = "";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Text block options</p>";

    this.deleteBlock = function(){
        this.deleteCkEditorMessyContent();
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        this.showHideEmptyCode(globalSubpageBuild);
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
    };

    this.deleteCkEditorMessyContent = function  (){
        var inlineWindowIdentifier = $("#" + this.id).find(".ckeditor").attr("aria-describedby");
        $("#" + inlineWindowIdentifier).closest(".cke").remove();
    };

    //getHoverCode - build hover controls code
    this.getHoverCode = function(){
        return "<div class='blockControls'>" +
            "<div class='deleteBlock'>" + this.deleteCode + "</div>" +
            "<div class='moveBlock'>" + this.moveCode + "</div>" +
            "</div>";
    };//getHoverCode

}//TextBlock

extend(TextBlock,blockAbstractClass);