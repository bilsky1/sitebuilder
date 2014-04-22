//GalleryBlock
function GalleryBlock(id,elClass, subpageContentId) {
    this.getModifySubpageName = function(hash){
        return $("#subpageContent").data("page_id");
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

    this.emptyContent = "<p class='emptyImage'>Upload images via settings</p>";

    this.genBlockCode = "<div class='galleryDiv'>" + this.emptyContent + "</div>";
    this.subpageName = "";
    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =  "<div class='galleryDiv'>" +
        "<form accept-charset='UTF-8' action='/images/add_assets' data-remote='true' enctype='multipart/form-data' class='upload-form' method='post'><div style='margin:0;padding:0;display:inline'><input name='utf8' type='hidden' value='✓'></div>" +
        "<input type='hidden' name='image_form[page_id]' value='" + this.getModifySubpageName() + "'> " +
        "<div class='upload'><span class='label'>Add new image</span><input class='file-input' name='image_form[uploaded_image]' type='file'></div>" +
        "<table>" +
        "<tr></tr><tr></tr>" +
        "<tr><td>Border:</td><td><input type='checkbox' name='borderVal'> </td></tr>" +
        "<tr><td>Border color:</td><td><input type='text' name='borderColorVal' </td></tr>" +
        "<tr><td>Spacing:</td><td>" +
            "<select class='spacing'>" +
                "<option value='none'>None</option>" +
                "<option value='small' >Small</option>" +
                "<option value='medium'>Medium</option>" +
                "<option value='big'>Big</option>" +
            "</select>" +
        "</td></tr>" +
        "</table>" +
        "</form>"+
        "</div>";

    this.setEmptyImageCode = function(){
        var imageContent = jQuery.trim($("#" + this.id).children(".galleryDiv").html());
        if(imageContent === ""){
            $("#" + this.id).children(".galleryDiv").html(this.emptyContent);
        }
    };

    this.setColorPickers = function(){
        var block = this;
        var borderColor = $("#" + block.id).find(".galleryItem").css("border-color");
        if(borderColor == null) borderColor="#FFFFFF";
        $("#" + block.settingsDialogId).find( "input[name*='borderColorVal']").minicolors('settings',{
            defaultValue: hex(borderColor),
            opacity: true,
            change: function(hex, opacity) {

                $("#" + block.id).find(".galleryItem").css("border-color",hex2rgb(hex,opacity));
                //console.log(hex2rgb(hex,opacity));
            }
        });
    };

    this.setBorderOnOff = function(){
        var block=this;
        var tmp = $("#" + block.id).find(".galleryItem").css("border-width");
        var borderStatus;

        if(tmp != null){
            tmp.replace("px","");
            if (tmp === "0")
                borderStatus = false;
            else
                borderStatus = true;
        }else{
            //when add no image is here - then se default to true
            borderStatus = true;
        }

        $("#" + block.settingsDialogId).find("input[name='borderVal']").prop("checked",borderStatus);
        $("#" + block.settingsDialogId).find("input[name='borderVal']").change(function(){
            if($(this).prop("checked"))
                $("#" + block.id).find(".galleryItem").css("border-width","1px");
            else
                $("#" + block.id).find(".galleryItem").css("border-width","0px")

            //console.log($(this).prop("checked"));
        });

    };

    this.setGalItemSpacing =function(){
        var block = this;
        var spacing = $("#" + this.id).find(".galleryItem").css("margin");
        var inputVal;
        if(spacing != null){
            spacing.replace("px","");
            spacing = parseInt(spacing);
            switch (spacing){
                case 0:
                    inputVal = "none";
                    break;
                case 2:
                    inputVal = "small";
                    break;
                case 5:
                    inputVal = "medium";
                    break;
                case 7:
                    inputVal = "big";
                    break;
            }
        }
        else
            inputVal = "none";

        $("#" + block.settingsDialogId).find("select.spacing").find("option").prop("selected",false);
        $("#" + block.settingsDialogId).find("select.spacing").find("option[value='" + inputVal + "']").prop("selected",true);
        $("#" + block.settingsDialogId).find("select.spacing").change(function(){
            var optionSelected = $("option:selected", this);
            var valueSelected = optionSelected.attr("value");
            if(valueSelected === "none")
                $("#" + block.id).find(".galleryItem").css("margin","0");
            else if(valueSelected === "small")
                $("#" + block.id).find(".galleryItem").css("margin","2px");
            else if(valueSelected === "medium")
                $("#" + block.id).find(".galleryItem").css("margin","5px");
            else if(valueSelected === "big")
                $("#" + block.id).find(".galleryItem").css("margin","7px");
        });
    };

    this.setEmptyCode= function(){
        if (jQuery.trim($("#" + this.id).find(".galleryDiv").html()) === ""){
            $("#" + this.id).find(".galleryDiv").html(this.emptyContent);
        }
    };

    this.setAjaxFileUpload = function(){
        var block = this;
        $("#" + block.settingsDialogId).find('.upload-form').find(".file-input").change(function(){
            $('#' + block.id).children(".galleryDiv").append("<i class='tmp-loader' class='fa fa-cog fa-spin fa-lg'></i>");
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

                    $('#' + block.id).children(".galleryDiv").find(".tmp-loader").remove();

                    if(!responseJson.errors){
                        console.log(responseJson.src);
                        $('#' + block.id).children(".galleryDiv").find(".emptyImage").remove();
                        $('#'+block.id).children(".galleryDiv").append("<div class='galleryItem'><a id='link" + responseJson.id + "' data-fancybox-group='gal" + block.id + "' class='fancybox' href='" + responseJson.src  + "'><img id='img" + responseJson.id + "' src='" + responseJson.thumb + "'></a></div>");
                        $("#" + block.id).find(".fancybox").fancybox({
                            'padding'		: 0
                        });
                        block.imageHandler("img" + responseJson.id);

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

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update gallery'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.initDialogWindowSettings = function(){
        $("#" + this.id).find("a.fancybox").fancybox({
            'padding'		: 0
        });
        this.setAjaxFileUpload();
        this.setColorPickers();
        this.setBorderOnOff();
        this.setGalItemSpacing();
        this.setEmptyImageCode();
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

    this.deleteAllImages = function(){
        var block = this;
        $("#" + this.id).find("img").each(function(){
            block.deleteImage($(this).attr("id"));
        });
    };

    this.deleteImage = function(id){
        var block = this;
        if(id != null){
            $.ajax({
            url: "/images/delete_assets",
            type: 'POST',
            data: {id:id.replace("img","")},
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
                        console.log(data.errors[i].success);
                    }
                }
            }
        });
        }
    };

    this.setDeleteImageHandler = function(id){
        var block = this;
        var el;
        if(id==="all")
            el = $("#" + block.id).find("img");
        else
            el = $("#" + id);
        el.closest(".galleryItem").find(".delete").find("i").on("click",function(e){
            e.preventDefault();
            block.deleteImage($(this).closest(".galleryItem").find("a").find("img").attr("id"));
            $(this).closest(".galleryItem").remove();
            $(this).closest(".imageControls").remove();
            block.setEmptyCode();
        });
    };

    this.imageHandler = function(id){
        var block = this;
        var findImg = "img";
        if(id != "all")
            findImg += "#" + id;
        $('#' + block.id).find(findImg).closest(".galleryItem").prepend(block.getImageHoverCode());
        block.setDeleteImageHandler(id);
    };

    this.getImageHoverCode = function(){
        return "<div class='imageControls'>" +
                    "<div class='delete'><i class='fa fa-times'></i></div>" +
               "</div> ";
    }

    this.setBlockHoverHandler = function(){
        var block = this;
        this.createDialogWindow();
        this.imageHandler("all");
        $('#' + block.id).mouseenter(function(e) {
            if($(this).find(".blockControls")){
                $(this).prepend(block.getHoverCode());
                block.setDeleteHandler();
                block.setSettingsHandler();
            }
        }).mouseleave(function(e) {
                $(this).find(".blockControls").remove();
            });
    };//setBlockHoverHandler

    this.deleteBlock = function(){
        this.deleteAllImages();
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        this.showHideEmptyCode(globalSubpageBuild);
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
    };

}//GalleryBlock

extend(GalleryBlock,blockAbstractClass);