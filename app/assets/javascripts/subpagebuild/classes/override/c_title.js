//TitleBlock
function TitleBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;

    this.genBlockCode = "<div class='ckeditor'><h1>Testovaci titulok</h1></div>";

    this.settingsCode = "<button class='h1' >h1</button>" +
        "<button class='h2' >h2</button>" +
        "<button class='h3' >h3</button>";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Title block options</p>";

    //dont create dialog window
    this.createDialogWindow = function(){};

    this.setCurrentOptions = function(){
        var block = this;
        $("#" + block.id).find(".ckeditor").each(function(){
            if($(this).find("h1").length > 0)
                $("#" + block.id).find(".h1").addClass("current");
            else if($(this).find("h2").length > 0)
                $("#" + block.id).find(".h2").addClass("current");
            else if($(this).find("h3").length > 0)
                $("#" + block.id).find(".h3").addClass("current");
        });
    };

    this.setSettingsHandler = function(){
        var block = this;
        this.setCurrentOptions();

        $("#" + this.id).find(".h1").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h1, .h2, .h3").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h1, h2, h3').replaceWith(function() {
                return '<h1>' + $(this).html() + '</h1>';
            });
            $(this).addClass("current");
        });
        $("#" + this.id).find(".h2").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h1, .h2, .h3").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h1, h2, h3').removeClass("current").replaceWith(function() {
                return '<h2>' + $(this).html() + '</h2>';
            });
            $(this).addClass("current");
        });
        $("#" + this.id).find(".h3").on("click",function(){
            $(this).closest(block.elClass).find(".blockControls").find(".h1, .h2, .h3").removeClass("current");
            $(this).closest(block.elClass).find(".ckeditor").find('h1, h2, h3').removeClass("current").replaceWith(function() {
                return '<h3>' + $(this).html() + '</h3>';
            });
            $(this).addClass("current");
        });
    };

}//TitleBlock

extend(TitleBlock,blockAbstractClass);