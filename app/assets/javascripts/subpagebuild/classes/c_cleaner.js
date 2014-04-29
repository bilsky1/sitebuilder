/*CONTENT CLEANER - change messy content and save to server by AJAX*/
function Cleaner() {
    this.content = "";

    this.cleanContent = function(content){
        $("body").append("<div id='tmpSubpageContent'></div>");
        var tmpSubpageContentEl = $("#tmpSubpageContent");
        tmpSubpageContentEl.css("display","none");
        tmpSubpageContentEl.html(content);
        this.changeCKEditorCode(tmpSubpageContentEl);
        this.deleteControls(tmpSubpageContentEl);
        this.deleteEmptyContents(tmpSubpageContentEl);
        this.deleteMapsContents(tmpSubpageContentEl);
        this.saveAjaxContentBlocks();
        removeAllUDragableFromSubpageContent(tmpSubpageContentEl);
        content = tmpSubpageContentEl.html();
        tmpSubpageContentEl.remove();
        return content;
    };

    this.saveAjaxContentBlocks = function(){
        var c = this;
        $("#tmpSubpageContent").find(".gen_block[data-type='ajax_content_b']").each(function(){
            c.saveAjaxContent($(this));
        });
    };
    this.saveAjaxContent = function(el){
        var ajaxContentId = el.data("remote-ajax-content-id");

        //remove styles makes by edit GUI
        el.find(".buttonAlign").css("display","");
        el.find(".buttonBackAlign").css("display","");
        el.children(".ajax-block-container").children(".ajax-content").removeAttr("style");
        el.children(".ajax-block-container").children(".ajax-content-after").removeAttr("style");
        removeAllUDragableFromSubpageContent(el.children(".ajax-block-container").children(".ajax-content"));
        removeAllUDragableFromSubpageContent(el.children(".ajax-block-container").children(".ajax-content-after"));

        var content = el.children(".ajax-block-container").children(".ajax-content").html();
        var content_after = el.children(".ajax-block-container").children(".ajax-content-after").html();

        el.children(".ajax-block-container").children(".ajax-content").html("");
        el.children(".ajax-block-container").children(".ajax-content-after").html("");

        console.log("saveAjaxContent Ajax Call");

        $.ajax({
            url: "/ajax_contents/update_contents",
            type: 'POST',
            data: {ajax_content_id: ajaxContentId, content: content ,content_after: content_after },
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
                if(data.result){
                    console.log("AjaxContent: " + ajaxContentId + " was successfully saved");
                }
                else{
                    var i;
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        alert(data.errors[i]);
                    }
                }
            }
        });
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

    this.deleteMapsContents = function(el){
        el.find(".googleMaps").each(function(){
          var height = $(this).css("height");
          $(this).removeAttr("style");
          $(this).css("height",height);
          $(this).html("");
      });
    };

    this.deletePluginsMessyCode = function(){
        this.deleteModalWindows();
        this.changeCKEditorCode($("#subpageContent"));
        $(".cke").remove();
    };

    this.deleteControls = function(el){
        el.find(".imageControls").remove();
        el.find(".blockControls").remove();
    };

    this.deleteEmptyContents = function(el){
        el.find(".emptyImage").remove();
        el.find(".colEmptyIcon").remove();
        el.find("#dndIcon").remove();
    };

    this.changeCKEditorCode = function(el){
        var elem = el.find(".ckeditor");
        if(elem.length){
            removeAllAttr(elem);
            elem.addClass("ckeditor");
        }else{
            console.log("changeCKEditorCode - no ckeditor HTML element")
        }
    };

    this.deleteModalWindows = function(){
        for (var i=0; i < genBlocksList.length; i++){
            $("#" + genBlocksList[i].settingsDialogId).closest(".ui-dialog").remove();
        }
    };

    this.reinitializeBlockList = function(){
        genBlocksList = new Array();
    };

    this.printError = function(error, type){
        $("#saveSubpage").closest(".saveButtonContainer").prepend("<div class='alert alert-" + type + " fade in'>" +
            "<a class='close' data-dismiss='alert' href='#'>x</a>" + error +
            "</div>");
        setTimeout(function(){$("#saveSubpage").closest(".saveButtonContainer").find("a.close").trigger("click")},2500);
    }

    this.updateContentToServer = function(pageName){

        var originalButText = $('#saveSubpage').text();
        var cleaner = this;
        this.content = cleaner.cleanContent($("#subpageContent").html());

        $('#saveSubpage').text("Loading ...");
        $.ajax({
            type: "POST",
            url: "/pages/update_page",
            data: {web_id:$("#web-id").text(), page_id: $("#subpageContent").data("page_id"), content: this.content},
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
                $('#saveSubpage').text("Save subpage");
            },
            success: function(data){
                if (data.update_result != null){
                    $('#saveSubpage').text("Save subpage");

                    if(parseInt(data.update_result) === 1){
                        cleaner.printError("Sucessfully updated","success");
                        isContentChange = false;
                    }
                    else
                        cleaner.printError("We're sorry, content cannot save updated","error");
                }
                else if(data.errors != null){
                    var i;
                    $('#saveSubpage').text("Save subpage");
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        cleaner.printError(data.errors[i],"error");
                    }
                }
            }
        });
    };//updateContentToServer
}
$(document).ready(function(){
    /*BUTTON USE CLEANER CLASS*/
    $("#saveSubpage").on("click",function(e){
        e.preventDefault();
        var subpageCleaner = new Cleaner();
        subpageCleaner.updateContentToServer(subpageCleaner.getWindowHash());
    });
});