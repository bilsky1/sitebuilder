//ImageTextBlock
function ImageTextBlock(id,elClass, subpageContentId) {
    this.getModifySubpageName = function(hash){
        if(hash != null)
            return hash.replace('#!','');
        else
            return "";
    }

    this.getWindowHash = function(){
        var hash=window.location.hash.toString();
        if(hash == ''){
            hash = $("#nav").find("li").first().find("a").attr("href");
            if(hash == null)
                hash = "";
        }
        return hash;
    };

    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.emptyContent = "<p class='emptyImage'>Upload image via settings</p>";

    this.genBlockCode = "<div class='imageAndText'><div class='imageContainer'>" + this.emptyContent + "</div><p class='ckeditor'>Lorem ipsum text</p></div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<div class='ImageTextDiv'>" +
        "<table><tr><td>Align:</td><td>" +
        "<button class='leftAlign'><i class='fa fa-align-left'></i></button>" +
        "<button class='rightAlign'><i class='fa fa-align-right'></i></button>" +
        "</td></tr></table>" +
        "<form accept-charset='UTF-8' action='/images/create_assets' data-remote='true' enctype='multipart/form-data' class='upload-form' method='post'><div style='margin:0;padding:0;display:inline'><input name='utf8' type='hidden' value='✓'></div>" +
        "<input type='hidden' name='image_form[id]' value='" + $("#" + this.id).find("img").attr("id") +"'> " +
        "<input type='hidden' name='image_form[page_name]' value='" + this.getModifySubpageName(this.getWindowHash()) + "'> " +
        "<div class='upload'><span class='label'>Upload image</span><input class='file-input' name='image_form[uploaded_image]' type='file'></div>" +
        "</form>"+
        "</div>";

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update image + Text block'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.deleteImage = function(){
        var block = this;
        if($('#'+block.id).children(".imageAndText").children(".imageContainer").find("img").attr("id") != null){
            $.ajax({
            url: "/images/delete_assets",
            type: 'POST',
            data: {id:$('#'+block.id).children(".imageAndText").children(".imageContainer").find("img").attr("id").replace("img","")},
            dataType: 'json',
            error: function (jqXHR, exception) {
                if (jqXHR.status === 0) {
                    alert('Not connect.\n Verify Network.');
                    console.log(jqXHR.responseText);
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                    console.log(jqXHR.responseText);
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                    console.log(jqXHR.responseText);
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                    console.log(jqXHR.responseText);
                }
            },
            success: function(data){
                if (data.success)
                    console.log(data.success);
                else if(data.errors){
                    var i;
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                    }
                }
            }
        });
        }
    };

    this.deleteBlock = function(){
        this.deleteImage();
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        this.showHideEmptyCode(globalSubpageBuild);
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();

    };

    this.setAjaxFileUpload = function(){
        var block = this;
        $("#" + block.settingsDialogId).find('.upload-form').find(".file-input").change(function(){
            $('#' + block.id).children(".imageAlign").html("<i id='tmp-loader' class='fa fa-cog fa-spin fa-lg'></i>");
            //for test error make a error in image_uploader.rb
            $(this).closest('form').ajaxSubmit({
                beforeSubmit: function(a,f,o) {
                    o.dataType = 'json';
                },
                error: function(jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        alert('Not connect.\n Verify Network.');
                        console.log("Not connect. Verify Network.");
                    } else if (jqXHR.status == 404) {
                        alert('Requested page not found. [404]');
                        console.log("Requested page not found. [404]");
                    } else if (jqXHR.status == 500) {
                        alert('Internal Server Error [500].');
                        console.log("Internal Server Error [500].");
                    } else if (exception === 'parsererror') {
                        alert('Requested JSON parse failed.');
                        console.log("Requested JSON parse failed.");
                    } else if (exception === 'timeout') {
                        alert('Time out error.');
                        console.log("Time out error.");
                    } else if (exception === 'abort') {
                        alert('Ajax request aborted.');
                        console.log("Ajax request aborted.");
                    } else {
                        alert('Uncaught Error.\n' + jqXHR.responseText);
                        console.log("Uncaught Error.\n" + jqXHR.responseText);
                    }
                },
                complete: function(XMLHttpRequest, textStatus) {
                    console.log(XMLHttpRequest.responseText);
                    responseJson = jQuery.parseJSON(XMLHttpRequest.responseText);
                    if(!responseJson.errors){
                        console.log(responseJson.src);
                        //$('#' + this.id).children(".imageAlign").find("i#tmp-loader").remove();
                        $('#'+block.id).children(".imageAndText").children(".imageContainer").html("<a class='fancybox' href='" + responseJson.src  + "'><img id='img" + responseJson.id + "' src='" + responseJson.thumb + "'></a>");
                        $("#" + block.id).find("a.fancybox").fancybox();
                        $("#" + block.settingsDialogId).find("input[name='image_form[id]']").val(responseJson.id);

                    }else{
                        var i;
                        var errorMessage = "";
                        for (i = 0; i < responseJson.errors.length; i++) {
                            console.log(responseJson.errors[i]);
                            errorMessage += responseJson.errors[i];
                            if(i != responseJson.errors.length-1)
                                errorMessage += "\n";
                        }
                        alert(errorMessage);
                        console.log(errorMessage);
                    }
                }
            });
        });
    };
    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).find("a.fancybox").fancybox();
        $("#" + this.settingsDialogId).find(".ImageTextDiv").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).find(".imageAndText").find(".imageContainer").css({ marginRight: 15, float: "left" });
        });
        $("#" + this.settingsDialogId).find(".ImageTextDiv").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).find(".imageAndText").find(".imageContainer").css({ marginLeft: 15, float: "right" });
        });
        this.setAjaxFileUpload();
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
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };

}//ImageTextBlock

extend(ImageTextBlock,blockAbstractClass);