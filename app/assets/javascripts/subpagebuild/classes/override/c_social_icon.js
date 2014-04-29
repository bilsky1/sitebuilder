function SocialIconsBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<p class='socialIconsBlock'>" +
        "<a class='fbIcon' href='https://www.facebook.com' target='_blank'><i class='fa fa-facebook-square fa-2x'></i></a>" +
        "<a class='gplusIcon' href='https://plus.google.com' target='_blank'><i class='fa fa-google-plus-square fa-2x'></i></a>" +
        "<a class='twitterIcon' href='https://twitter.com' target='_blank'><i class='fa fa-twitter-square fa-2x'></i></a>" +
        "<a class='pinterestIcon' href='https://www.pinterest.com' target='_blank'><i class='fa fa-pinterest-square fa-2x'></i></a>" +
        "<a class='linkedInIcon' href='https://www.linkedin.com' target='_blank'><i class='fa fa-linkedin-square fa-2x'></i></a>" +
        "<a class='gitHubIcon' href='https://github.com' target='_blank'><i class='fa fa-github-square fa-2x'></i></a>" +
        "<a class='tumblrIcon' href='https://www.tumblr.com' target='_blank'><i class='fa fa-tumblr-square fa-2x'></i></a>" +
        "</p>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<h3>Social Icon Settings</h3>" +
        "<form class='socialIconForm' action=''>" +
        "<div class='socIconDialogRow'><i class='fa fa-facebook-square fa-2x'></i><input type='checkbox' name='fbIcon' checked><input type='text' name='fbValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-google-plus-square fa-2x'></i><input type='checkbox' name='gplusIcon' checked><input type='text' name='gplusValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-twitter-square fa-2x'></i><input type='checkbox' name='twitterIcon' checked><input type='text' name='twitterValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-pinterest-square fa-2x'></i><input type='checkbox' name='pinterestIcon' checked><input type='text' name='pinterestValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-linkedin-square fa-2x'></i><input type='checkbox' name='linkedInIcon' checked><input type='text' name='linkedInValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-github-square fa-2x'></i><input type='checkbox' name='gitHubIcon' checked><input type='text' name='gitHubValue'></div>" +
        "<div class='socIconDialogRow'><i class='fa fa-tumblr-square fa-2x'></i><input type='checkbox' name='tumblrIcon' checked><input type='text' name='tumblrValue'></div>" +
        "<div class='socIconDialogRow'>Color : <input type='text' name='colorHexa' ></div>" +
        "<div class='socIconDialogRow'>Align :" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='centerAlign'><i class='fa fa-align-center'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</div>" +
        "</form> ";

    this.setColorPickers = function(){

        var block = this;
        var color = $("#" + block.id).find(".socialIconsBlock").find("a").css("color");
        $("#" + block.settingsDialogId).find( "input[name*='colorHexa']").minicolors('settings',{
            defaultValue: hex(color),
            opacity: true,
            change: function(hex, opacity) {

                $("#" + block.id).find(".socialIconsBlock").find("a").css("color",hex2rgb(hex,opacity));
                //console.log(hex2rgb(hex,opacity));
            }
        });
    };
    this.setAlignHandler = function(){
        var block = this;
        $("#" + this.settingsDialogId).find("form.socialIconForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".socialIconsBlock").css("text-align","left");
        });
        $("#" + this.settingsDialogId).find("form.socialIconForm").find(".centerAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".socialIconsBlock").css("text-align","center");
        });
        $("#" + this.settingsDialogId).find("form.socialIconForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".socialIconsBlock").css("text-align","right");
        });
    };
    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).children(".socialIconsBlock").find("a").each(function(){
            var checkBoxName = $(this).attr("class");
            var valInputName = checkBoxName.replace("Icon","Value");

            $( "input[name*='" + valInputName + "']").val($(this).attr("href"));
            if($(this).css("display") === "none")
                $("#" + block.settingsDialogId).find( "input[name*='" + checkBoxName + "']").removeAttr("checked");
            else
                $("#" + block.settingsDialogId).find( "input[name*='" + checkBoxName + "']").checked = true;

        });
        this.setColorPickers();
        this.setAlignHandler();

    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update social icon block'>"  +
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
                    $(this).find("form.socialIconForm").find("input[type='checkbox']").each(function(){
                        var hrefClass = "." + $(this).attr("name");
                        var valueName =  $(this).attr("name").replace("Icon","Value");
                        $("#" + block.id).find(hrefClass).attr("href", $("#" + block.settingsDialogId).find( "input[name*='" + valueName + "']").val());
                        if(!$(this).is(':checked'))
                            $("#" + block.id).find(hrefClass).css("display","none");
                        else
                            $("#" + block.id).find(hrefClass).css("display","inline");
                    });
                    $( this ).dialog( "close" );
                    isContentChange = true;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };

}

extend(SocialIconsBlock,blockAbstractClass);