//TitleBlock
function TitleBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;

    this.genBlockCode = "<div class='ckeditor'><h2>Testovaci titulok</h2></div>";

    this.settingsCode = "<button class='h2' >h2</button>" +
        "<button class='h3' >h3</button>" +
        "<button class='h4' >h4</button>";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Title block options</p>";

    //dont create dialog window
    this.createDialogWindow = function(){};

    this.setCurrentOptions = function(){
        var block = this;
        $("#" + block.id).find(".ckeditor").each(function(){
            if($(this).find("h2").length > 0)
                $("#" + block.id).find(".h2").addClass("current");
            else if($(this).find("h3").length > 0)
                $("#" + block.id).find(".h3").addClass("current");
            else if($(this).find("h4").length > 0)
                $("#" + block.id).find(".h4").addClass("current");
        });
    };

    this.setSettingsHandler = function(){
        var block = this;
        this.setCurrentOptions();

        $("#" + this.id).find(".h2").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h2, .h3, .h4").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h2, h3, h4').replaceWith(function() {
                return '<h2>' + $(this).html() + '</h2>';
            });
            $(this).addClass("current");
            isContentChange = true;
        });
        $("#" + this.id).find(".h3").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h2, .h3, .h4").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h2, h3, h4').removeClass("current").replaceWith(function() {
                return '<h3>' + $(this).html() + '</h3>';
            });
            $(this).addClass("current");
            isContentChange = true;
        });
        $("#" + this.id).find(".h4").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h2, .h3, .h4").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h2, h3, h4').removeClass("current").replaceWith(function() {
                return '<h4>' + $(this).html() + '</h4>';
            });
            $(this).addClass("current");
            isContentChange = true;
        });
    };

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

}//TitleBlock

extend(TitleBlock,blockAbstractClass);