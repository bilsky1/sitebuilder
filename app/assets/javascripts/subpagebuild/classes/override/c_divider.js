//DividerBlock
function DividerBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='dividerBlock'></div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<form action='' class='dividerForm'><table>" +
        "<tr><td>Width:</td><td><input type='text' name='widthValue'></td><td>(% recomended)</td></tr>" +
        "<tr><td>Height:</td><td><input type='text' name='heightValue'></td></tr>" +
        "<tr><td>Color:</td><td><input type='text' name='colorHexa'></td></tr>" +
        "<tr><td>Align:</td><td>" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='centerAlign'><i class='fa fa-align-center'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</td></tr>" +
        "</table>" +
        "</form>";

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update divider block'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.setAlignHandler = function(){
        var block = this;
        $("#" + this.settingsDialogId).find("form.dividerForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".dividerBlock").css("margin","10px 0");
            $("#" + block.id).children(".dividerBlock").css("float","left");
        });
        $("#" + this.settingsDialogId).find("form.dividerForm").find(".centerAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".dividerBlock").css("float","none");
            $("#" + block.id).children(".dividerBlock").css("margin","10px auto");
        });
        $("#" + this.settingsDialogId).find("form.dividerForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".dividerBlock").css("margin","10px 0");
            $("#" + block.id).children(".dividerBlock").css("float","right");
        });
    };
    this.setColorPickers = function(){
        var block = this;
        var color = $("#" + block.id).find(".dividerBlock").css("background-color");
        $("#" + block.settingsDialogId).find( "input[name*='colorHexa']").minicolors('settings',{
            defaultValue: hex(color),
            opacity: true,
            change: function(hex, opacity) {

                $("#" + block.id).find(".dividerBlock").css("background",hex2rgb(hex,opacity));
                //console.log(hex2rgb(hex,opacity));
            }
        });
    };
    this.initDialogWindowSettings = function(){
        this.setColorPickers();
        this.setAlignHandler();
        var height = $("#" + this.id).children(".dividerBlock").css("height");
        //var width = $("#" + this.id).children(".dividerBlock").css("width");
        if($("#" + this.id).width() > 0 && $("#" + this.id).children(".dividerBlock").width() > 0)
            var width = Math.round((100*$("#" + this.id).children(".dividerBlock").width())/$("#" + this.id).width()) + "%";
        else
            var width = $("#" + this.id).children(".dividerBlock").css("width");
        //var color = $("#" + this.id).children(".dividerBlock").css("background-color");
        $("#" + this.settingsDialogId).find("form.dividerForm").find("input[name*='heightValue']").val(height);
        $("#" + this.settingsDialogId).find("form.dividerForm").find("input[name*='widthValue']").val(width);
        //$("#" + this.settingsDialogId).find("form.dividerForm").find("input[name*='colorHexa']").val(color);
    };
    //createDialogWindow - create settings dialog window for change options of block
    this.createDialogWindow = function(){
        $("#" + this.id).append("\n" + this.getSettingsDialogCode());
        this.initDialogWindowSettings();
        var block = this;
        $('#' + this.settingsDialogId).dialog({
            resizable: false,
            height:"auto",
            width:"suto",
            modal: true,
            autoOpen: false,
            buttons: {
                "Save": function() {

                    var height = $("#" + block.settingsDialogId).find("form.dividerForm").find("input[name*='heightValue']").val();
                    $("#" + block.id).children(".dividerBlock").css("height",height);

                    var width = $("#" + block.settingsDialogId).find("form.dividerForm").find("input[name*='widthValue']").val();
                    $("#" + block.id).children(".dividerBlock").css("width",width);

                    $( this ).dialog( "close" );
                    isContentChange = true;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    };//createDialogWindow
}//DividerBlock

extend(DividerBlock,blockAbstractClass);