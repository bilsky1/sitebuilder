function CodeBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='embeddedCode'>Your code</div>";

    this.settingsCode = "<i class='fa fa-code'></i>";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form class='CodeForm' action=''>" +
        "<div>" +
        "Add your code:<br><textarea name='codeValue' cols='10' rows='10'></textarea>" +
        "</div>";
    "</form> ";

    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).children("div.embeddedCode").each(function(){
            $("#" + block.settingsDialogId).find("textarea[name*='" + "codeValue" + "']").text($(this).html());
        });
    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update embedded code block'>"  +
            this.settingsDialogCode +
            "</div>";
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
                    $("#" + block.id).children(".embeddedCode").html($(this).find("form.CodeForm").find("textarea[name*='" + "codeValue" + "']").val());
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };
}

extend(CodeBlock,blockAbstractClass);