//AjaxContentBlock
function AjaxContentBlock(id,elClass, subpageContentId) {
    this.id = id;
    this.elClass = elClass;
    this.subpageContentId = subpageContentId;

    this.genBlockCode = "<div class='ajax-block-container'>" +
                            "<div class='ajax-col ajax-content'></div>" +
                            "<div class='ajax-col ajax-content-after'></div>" +
                            "<div class='buttonAlign'><a class='button' href='#'>Button to next content</a></div>" +
                            "<div class='buttonBackAlign'><a class='button' href='#'><i class='fa fa-reply'></i></a></div>" +
                        "</div>";

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Ajax content block options</p>";

    this.settingsCode = "<button class='ajax-settings' ><i class='fa fa-link'></i></button>";


    this.settingsDialogCode =   "<form class='AjaxButtonForm' action=''>" +
        "<table>" +
        "<tr><td>Anchor:</td><td><input type='text' name='anchorValue'></td></tr>" +
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


    this.setSettingsHandler = function(){
        this.setStyleSettingsHandler();
    };

    this.setStyleSettingsHandler = function(){
        var block = this;
        $("#" + this.id).children(".blockControls").find(".ajax-settings").on("click",function(){
            $('#' + block.settingsDialogId).dialog("open");
        });
    };

    this.refreshSortable = function(){
        $("#" + globalSubpageBuild.attr("id") + ", .col, .ajax-col").sortable({
            placeholder: "ui-state-highlight",
            handle: '.moveBlock',
            revert: true,
            connectWith: "#subpageContent, .col, .ajax-col",
            refresh: true,
            receive: function(event, ui){
                if ( transfered === "draggable" && $(this).find(".block") ) {
                    numberOfGenBlock += 1;

                    var id = genIdToNewBlock();
                    var blockObj = generateBlock(dragBlockId, id);

                    $(this).find(".block").removeClass()
                        .addClass("gen_block")
                        .attr("data-type", dragBlockId)
                        .attr("id",id.toString())
                        .html(blockObj.genBlockCode);

                    blockObj.showHideEmptyCode(globalSubpageBuild);
                    blockObj.setBlockHoverHandler();

                    if($("#" + blockObj.id).data("type") === "column_b" || $("#" + blockObj.id).data("type") === "ajax_content_b" ){
                        blockObj.refreshSortable();
                        if($("#" + blockObj.id).data("type") === "ajax_content_b")
                            blockObj.createAjaxContentService();
                    }

                    transfered = 'sortable';
                    dragBlockId = "";
                }
                setInlineCKeditor('.ckeditor');
                removeAllUDragableFromSubpageContent(globalSubpageBuild);
                isContentChange = true;
            },
            update: function( event, ui ) {
                showHideEmptyColumnCode(globalSubpageBuild);
            },
            start: function( event, ui ) {
                startDragEffect();
                //console.log("start sortable");
            },
            stop: function(event, ui){
                stoptDragEffect();
                //console.log("stop sortable");
            }
        });
    };

    this.getSettingsDialogCode = function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Update ajax button style'>"  +
            this.settingsDialogCode +
            "</div>";
    };

    this.setAlignHandler = function(){
        var block = this;
        $("#" + this.settingsDialogId).find("form.AjaxButtonForm").find(".leftAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".ajax-block-container").children(".buttonAlign").css("text-align","left");
            $("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").css("text-align","left");
        });
        $("#" + this.settingsDialogId).find("form.AjaxButtonForm").find(".centerAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".ajax-block-container").children(".buttonAlign").css("text-align","center");
            $("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").css("text-align","center");
        });
        $("#" + this.settingsDialogId).find("form.AjaxButtonForm").find(".rightAlign").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".ajax-block-container").children(".buttonAlign").css("text-align","right");
            $("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").css("text-align","right");
        });
    };

    this.initDialogWindowSettings = function(){
        var block = this;
        $("#" + this.id).find(".buttonAlign").children("a.button").each(function(){
            $("#" + block.settingsDialogId).find("input[name*='" + "anchorValue" + "']").val($(this).text());
        });
        this.setAlignHandler();
        this.setColorPickers();
        $("#" + this.settingsDialogId).find("input[name*='" + "borderRadiusValue" + "']").val($("#" + this.id).find("a").css("border-radius")); //init border radius

        //When create new cols ajax respond set link to ajax content to data-property
        this.setAjaxBlockButtonHandler();
        this.setAjaxBlockButtonBackHandler();
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
                    $("#" + block.id).find(".buttonAlign").children("a.button").text($(this).find("form.AjaxButtonForm").find("input[name*='" + "anchorValue" + "']").val());
                    $("#" + block.id).find(".buttonAlign").children("a.button").css("border-radius",$(this).find("form.AjaxButtonForm").find("input[name*='" + "borderRadiusValue" + "']").val());
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };

    this.deleteBlock = function(){
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).find(this.elClass).each(function(){
            for(var i=0; i < genBlocksList.length; i++){
                if($(this).attr("id") === genBlocksList[i].id.toString())
                    genBlocksList[i].deleteBlock();
            }
        });
        this.deleteAjaxContent();
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
        this.showHideEmptyCode(globalSubpageBuild);
    };

    this.deleteBlockNotRemote = function(){
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).find(this.elClass).each(function(){
            for(var i=0; i < genBlocksList.length; i++){
                if($(this).attr("id") === genBlocksList[i].id.toString())
                    genBlocksList[i].deleteBlock();
            }
        });
        $("#" + this.id).remove();
        $("#" + this.settingsDialogId).remove();
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
        this.showHideEmptyCode(globalSubpageBuild);
    };

    this.setAjaxBlockButtonBackHandler = function(){
        var block = this;
        $("#" + this.id).find(".buttonBackAlign").children(".button").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".ajax-block-container").children(".ajax-content-after").hide();
            $("#" + block.id).children(".ajax-block-container").children(".ajax-content").show();
            $("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").hide();
            $("#" + block.id).children(".ajax-block-container").children(".buttonAlign").show()
            //EFECTS ON BUTTONS
            //$("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").fadeOut(400);
            //$("#" + block.id).children(".ajax-block-container").children(".buttonAlign").delay(400).fadeIn(600)
        });
    };

    this.setAjaxBlockButtonHandler = function(){
        var block = this;
        $("#" + this.id).find(".ajax-block-container").children(".buttonAlign").children(".button").on("click",function(e){
            e.preventDefault();
            $("#" + block.id).children(".ajax-block-container").children(".ajax-content").hide();
            $("#" + block.id).children(".ajax-block-container").children(".ajax-content-after").show();

            $("#" + block.id).children(".ajax-block-container").children(".buttonAlign").hide();
            $("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").show();

            //EFECTS ON BUTTONS
            //$("#" + block.id).children(".ajax-block-container").children(".buttonAlign").fadeOut(400);
            //$("#" + block.id).children(".ajax-block-container").children(".buttonBackAlign").delay(400).fadeIn(600);
            //block.saveContentToAjaxContents();
        });
    };

    this.createAjaxContentService = function(){
        var block = this;
        $.ajax({
            url: "/ajax_contents/create_blank",
            type: 'POST',
            data: {page_id: block.getCurrentPageId()},
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
                if (data.id){
                    $("#" + block.id).attr("data-remote-ajax-content-id",data.id);
                    console.log("Set data-id to ajax content by database");
                }
                else if(data.errors){
                    var i;
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        alert(data.errors[i]);
                    }
                }
            }
        });
    };

    this.deleteAjaxContent = function(){
        var block = this;
        if($("#" + block.id).attr('data-remote-ajax-content-id')){
            var remoteId = $("#" + block.id).data("remote-ajax-content-id");
            $.ajax({
                url: "/ajax_contents/delete",
                type: 'POST',
                data: {ajax_content_id: remoteId},
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
                    if (data.result == 1)
                        console.log("Ajax content successfully deleted.");
                    else if(data.errors){
                        var i;
                        for (i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i]);
                            alert(data.errors[i]);
                        }
                    }
                }
            });
        }
    };

    this.getAjaxBlockContents = function(){
        var block = this;
        var ajaxContentId = $("#" + this.id).data("remote-ajax-content-id");
        if(ajaxContentId){
            $.ajax({
                url: "/ajax_contents/get_contents",
                type: 'POST',
                data: {ajax_content_id: ajaxContentId},
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
                    if(!data.errors){
                        var ajaxContentEl = $("#"+block.id).children(".ajax-block-container").children(".ajax-content");
                        var ajaxContentAfterEl = $("#"+block.id).children(".ajax-block-container").children(".ajax-content-after");
                        ajaxContentEl.html(data.content);
                        ajaxContentAfterEl.html(data.content_after);

                        loadAllBlockInSubcontent(ajaxContentEl);
                        loadAllBlockInSubcontent(ajaxContentAfterEl);

                        block.refreshSortable();
                        //$("#subpageContent").subpagebuild();

                        console.log("Successfull - get ajax contents");
                    }
                    else{
                        if(!parseInt(data.remove_block)){
                            var i;
                            for (i = 0; i < data.errors.length; i++) {
                                console.log(data.errors[i]);
                                alert(data.errors[i]);
                            }
                        } else {
                            block.deleteBlockNotRemote();
                        }
                    }
                }
            });
        }
    };
}//AjaxContentBlock

extend(AjaxContentBlock,blockAbstractClass);