$(document).ready(function(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
    });

    checkURL();

    initializeNavEdit();

});

function initializeNavEdit(){
    $(window).unbind();
    $(window).bind('popstate', function(e) {
        e.preventDefault();
        var activeHref = $("#nav").find("li.active").children("a").attr("href");
        if(activeHref != location.hash){
            if (!isContentChange){
                checkURL(location.hash);
            }else{
                var activePageName = getActivePageName();
                if(activePageName){
                    unsavedContentModal();
                    setUnsavedContentModalButtonsHandlers(activePageName);
                }else{
                    checkURL(location.hash);
                }
            }
        }
    });
    if (navigator.userAgent.search("Opera") >= 0) {
        $('ul#nav li a').unbind("click");
        $('ul#nav li a').click(function (){
            history.pushState({}, '', $(this).attr("href"));
            $(window).trigger('popstate');
        });
    }
}
function getSubpageHash(hash){
    if(!hash){
        hash=window.location.hash.toString();
        if(hash == ''){
            hash = $("#nav").find("li").first().find("a").attr("href");
            if(hash == null)
                hash = "";
        }
    }
    return hash;
}

function checkURL(hash){
    hash = getSubpageHash(hash);

    if(hash==""){
        $('#subpageContent').html("");
    }
    else{
        setSelectedNav(hash);
        getPage(hash);
    }
}

function setSelectedNav(url){
    $('ul#nav li a').each(function() {
        if( $( this ).attr('href') == url ){
            $( this).closest("li").addClass("active");
            $( this).addClass("current");
        }
        else{
            $( this).closest("li").removeClass("active");
            $( this ).removeClass("current");
        }
    });
}

function getPage(subpageName){
    subpageName = subpageName.replace('#!','');
    /*Delete modal windows*/
    var cleaner = new Cleaner();
    cleaner.deletePluginsMessyCode();
    cleaner.reinitializeBlockList();

    $('#subpageContent').prepend("<div id='loading'><i class='fa fa-spinner fa-spin fa-2x'></i></div>");
    $.ajax({
        type: "POST",
        url: "/pages/get_page",
        data: {web_id:$("#web-id").text(), page_url_name: subpageName},
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
            if (data.page_content != null){
                $("#subpageContent").fadeOut(600, function (){
                    $("#subpageContent").find("#loading").remove();
                    genBlocksList = new Array(); //TODO - lost unsaved changes
                    //edit interface sucess method
                    $("#subpageContent").html(data.page_content);
                    $("#subpageContent").subpagebuild(); //reinitialize content builder
                    changeTitle(data.title, data.web_name);
                    //---------------------------------
                });
                $("#subpageContent").fadeIn(600);
                $("#subpageContent").data("page_id",data.page_id);
            }
            else if(data.errors != null){
                console.log(data.errors);
                //$("#subpageContent").html(data.errors);
            }
        }

    });
}

//-------------------------------------------------------------------
//---------------UNSAVED CONTENT ALERT----------------------------------
//-------------------------------------------------------------------
function unsavedContentModal(){
    var options = {
        "keyboard" : true
    }
    $('#unsavedContentModal').modal(options);
    /*$('#unsavedContentModal').on('hidden', function(){
        window.location.hash = "#!page1";
    });*/
}
function setUnsavedContentModalButtonsHandlers(pageName){
    /*$("#deleteUnsavedContent").on("click",function(){
        var subpageCleaner = new Cleaner();
        subpageCleaner.deleteContentAndGetSaved(pageName);
        $(this).unbind('click');
        $("#saveUnsavedContent").unbind('click');
    });*/
    $("#saveUnsavedContent").unbind("click");
    $("#saveUnsavedContent").on("click",function(){
        var subpageCleaner = new Cleaner();
        subpageCleaner.updateContentToServer(pageName);
        $('#unsavedContentModal').modal('hide');
        $(this).unbind('click');
        //$("#deleteUnsavedContent").unbind('click');
    });
    $('#unsavedContentModal').unbind("keydown");
    $('#unsavedContentModal').keydown(function(event){
        if(event.keyCode==13){
            $('#saveUnsavedContent').trigger('click');
        }
    });
}

function getActivePageName(){
    var activePageEl = $('ul#nav li.active a');
    if (activePageEl.length > 0){
        return activePageEl.attr("href").replace("#!","");
    }else{
        return false;
    }
}

function changeTitle(new_title,web_name){
    document.title = "WBSBuilder | Edit | " + web_name + " | " + new_title;;
};