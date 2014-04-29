//ButtonBlock
function ButtonBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='buttonAlign'><a class='button' href='#'>Button</a></div>";

    this.settingsCode = "<i class='fa fa-link'></i>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form class='ButtonForm' action=''>" +
        "<table>" +
        "<tr><td>Anchor:</td><td><input type='text' name='anchorValue'></td></tr>" +
        "<tr><td>Link :</td><td><input type='text' name='linkValue'></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td colspan='2'><strong>Styles</strong></td></tr>" +
        "<tr><td>Align :</td><td>" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='centerAlign'><i class='fa fa-align-center'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</td></tr>" +
        "<tr><td>Border radius:</td><td><input name='borderRadiusValue' type='text'></td></tr>" +
        "<tr><td>Text color:</td><td><input name='textColorValue' type='text'></td></tr>" +
        "<tr><td>Background color:</td><td><input name='bgColorValue' type='text'></td></tr>" +
        "</table>";
    "</form> ";

    this.setAlignHandler = function(){
        var block = this;
        $("#" + this.settingsDialogId).find("form.ButtonForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".buttonAlign").css("text-align","left");
        });
        $("#" + this.settingsDialogId).find("form.ButtonForm").find(".centerAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".buttonAlign").css("text-align","center");
        });
        $("#" + this.settingsDialogId).find("form.ButtonForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".buttonAlign").css("text-align","right");
        });
    };

    this.setColorPickers = function(){
        var block = this;
        var textColor = $("#" + block.id).find("a.button").css("color");
        var bgColor = $("#" + block.id).find("a.button").css("background-color");
        $("#" + block.settingsDialogId).find( "input[name*='textColorValue']").minicolors('settings',{
            defaultValue: hex(textColor),
            opacity: true,
            change: function(hex, opacity) {

                $("#" + block.id).find("a.button").css("color",hex2rgb(hex,opacity));
                //console.log(hex2rgb(hex,opacity));
            }
        });
        $("#" + block.settingsDialogId).find( "input[name*='bgColorValue']").minicolors('settings',{
            defaultValue: hex(bgColor),
            opacity: true,
            change: function(hex, opacity) {

                $("#" + block.id).find("a.button").css("background",hex2rgb(hex,opacity));
                //console.log(hex2rgb(hex,opacity));
            }
        });
    };

    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).find(".buttonAlign").children("a.button").each(function(){
            $("#" + block.settingsDialogId).find("input[name*='" + "anchorValue" + "']").val($(this).text());
            $("#" + block.settingsDialogId).find("input[name*='" + "linkValue" + "']").val($(this).attr("href"));
        });
        this.setAlignHandler();
        this.setColorPickers();
        $("#" + this.settingsDialogId).find("input[name*='" + "borderRadiusValue" + "']").val($("#" + this.id).find("a").css("border-radius")); //init border radius

    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update button block'>"  +
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
                    $("#" + block.id).find(".buttonAlign").children("a.button").text($(this).find("form.ButtonForm").find("input[name*='" + "anchorValue" + "']").val());
                    $("#" + block.id).find(".buttonAlign").children("a.button").attr("href",$(this).find("form.ButtonForm").find("input[name*='" + "linkValue" + "']").val());
                    $("#" + block.id).find(".buttonAlign").children("a.button").css("border-radius",$(this).find("form.ButtonForm").find("input[name*='" + "borderRadiusValue" + "']").val());
                    $( this ).dialog( "close" );
                    isContentChange = true;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };
}//ButtonBlock

extend(ButtonBlock,blockAbstractClass);