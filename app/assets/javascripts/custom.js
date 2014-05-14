/*OUTERHTML simple plugin*/
(function($) {
    $.fn.outerHTML = function() {
        return $(this).clone().wrap('<div></div>').parent().html();
    }
})(jQuery);

/*Pages*/
function printError(to,error,type){
    $(to).prepend("<div class='alert alert-" + type + " fade in'>" +
        "<a class='close' data-dismiss='alert' href='javascript:void(0)'>x</a>" + error +
        "</div>");
    setTimeout(function(){$(to).find(".alert").remove()},3500);
}

function printErrorByElement(to,error,type){
    to.prepend("<div class='alert alert-" + type + " fade in'>" +
        "<a class='close' data-dismiss='alert' href='javascript:void(0)'>x</a>" + error +
        "</div>");
    setTimeout(function(){$(to).find(".alert").remove()},3500);
}

function createPageHandler(){
    $('#create-new-page').on("click",function(e){
        e.preventDefault();
        var form = $(this).closest("form");
        var originalButText = $(this).text();
        $(this).text("Loading ...");
        $.ajax({
            type: form.attr("method"),
            url: form.attr("action"),
            data: {web_id:form.find("input[name='web_id']").val(), name: form.find("input[name='name']").val(), title: form.find("input[name='title']").val()},
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
                if (data.create_result != null){
                    $('#create-new-page').text(originalButText);

                    if(parseInt(data.create_result) === 1){
                        printError("#pages-messages","Sucessfully created","success");
                        $("#nav").append("<li><a data-page-id='" + data.page_id + "' href='#!" + data.page_url_name + "'>" + data.page_name + "</a></li>");
                        $("#pagesList").append("<li data-page-id='" + data.page_id + "' class='alert alert-info'><i class='fa fa-bars sort-page'></i><span class='pageName'>" + data.page_name + "</span><i class='fa fa-trash-o fa-lg delete-page' ></i></li>");
                        initializeNavEdit();
                        addDeletePageHandler($("#pagesList").find("li").last().children("i.delete-page"));
                        addPageSettingsElement(form.find("input[name='web_id']").val(), data.page_id, data.page_title, data.page_name);
                    }
                    else
                        printError("#pages-messages", "We're sorry, cannot create new page","error");
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printError("#pages-messages",data.errors[i],"error");
                    }
                }
            }

        });
    });
}

function addDeletePageHandler(elem){
    elem.unbind("click");
    elem.on("click",function(e){
        e.preventDefault();
        var pageItem = elem.closest("li");
        $.ajax({
            type:"POST",
            url: "/pages/delete_page",
            data: {page_id:pageItem.data("page-id")},
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
                if (data.delete_result != null){
                    if(parseInt(data.delete_result) === 1){
                        pageItem.remove();
                        $("#nav").find("li").find("a").each(function(){
                            if($(this).data("page-id") === pageItem.data("page-id"))
                                $(this).closest("li").remove();
                        });
                        $("#pagesSettings").find("input[name='page_id']").each(function(){
                            if($(this).val() == pageItem.data("page-id"))
                                $(this).closest("li").remove();
                        });
                    }
                    else
                        printError("#pages-messages", "We're sorry, cannot delete page","error");
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printError("#pages-messages",data.errors[i],"error");
                    }
                }
            }

        });
    });
}

function deletePageHandler(){
    $('#pagesList').find("li").find(".delete-page").each(function(){
        addDeletePageHandler($(this));
    });
}

function createJsonForNavigation(){
    var i = 1;
    var jsonArray={web_id: parseInt($("#web-id").text()), pages:[]};
    $("#pagesList").children("li").each(function(){
        jsonArray.pages.push({
            page_id: $(this).data("page-id"),
            page_position: i
        });
        i++;
    });
    return jsonArray;
}

function sortNavigation(){
    var newNavigation = "";
    $("#pagesList").children("li").each(function(){
        var pageListItem = $(this);
        $("#nav").children("li").each(function(){
         if($(this).find("a").data("page-id") === pageListItem.data("page-id")){
             newNavigation += $(this).outerHTML();
         }
        });
    });
    $("#nav").html(newNavigation);
    initializeNavEdit();
}

function createPagesSortable(){
    $( "#pagesList" ).sortable({
        placeholder: "pages-sortable-placeholder",
        handle: '.sort-page',
        update: function (event, ui) {
            //console.log(createJsonForNavigation());
            sortNavigation();
            $.ajax({
                type: "POST",
                url: "/navigations/uprate_navigation",
                data: createJsonForNavigation(),
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
                    if (data.delete_result != null){
                        /*if(parseInt(data.delete_result) === 1){

                        }
                        else
                            printError("#pages-messages", "We're sorry, cannot delete page","error");*/
                    }
                    else if(data.errors != null){
                        var i;
                        console.log(data.errors);
                        for (i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i]);
                            printError("#page-settings-messages",data.errors[i],"error");
                        }
                    }
                }

            });
        }
    });
    $( "#sortable" ).disableSelection();
}

function createPageSettingsHandler(){
    $(".update-page-settings").unbind("submit");
    $(".update-page-settings").submit("click",function(e){
        e.preventDefault();
        var form = $(this);
        $.ajax({
            type: "POST",
            url: "/pages/update_page_settings",
            data: form.serialize() ,
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
                if (data.update_settings_result != null){
                    printErrorByElement(form.children(".page-settings-messages"),"Successfully updated","success");
                    var pageId = form.find("input[name='page_id']").val();
                    form.find("input[name='name']").val(data.page_name);

                    $("#nav").children("li").find("a[data-page-id='" + pageId + "']").text(data.page_name);
                    $("#nav").children("li").find("a[data-page-id='" + pageId + "']").attr("href", "#!" + data.page_url_name);
                    $("#pagesList").children("li[data-page-id='" + pageId + "']").children(".pageName").text(data.page_name);
                    form.closest("li").children(".showHideLink").children(".pageName").text(data.page_name);
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printErrorByElement(form.children(".page-settings-messages"),data.errors[i],"error");
                    }
                }
            }

        });
    });
}

function addPageSettingsElement(webId, pageId, pageTitle, pageName){
    var settingsBlockCode =
        "<li>" +
            "<a class='showHideLink' href='javascript:void(0)'>" +
        "<span class='pageName'>" + pageName + "</span>" +
        "<i class='fa fa-angle-down fa-lg'></i>" +
    "</a>" +
        "<div class='showPageSettings'>" +
        "<form class='update-page-settings' action='/pages/update_page_settings' method='post'>" +
            "<div class='page-settings-messages'></div>"+
            "<div class='clearfix'><input type='hidden' name='web_id' value='" + webId +  "'></div>" +
                "<div class='clearfix'><input type='hidden' name='page_id' value='" + pageId + "'></div>" +
                    "<div class='clearfix'><input type='text' name='name' value='" + pageName + "' placeholder='Page name'><i class='tooltip-icon fa fa-info-circle fa-lg' data-placement='left' title='' data-original-title='Page name'></i></div>" +
                        "<div class='clearfix'><input type='text' name='title' value='" + pageTitle + "' placeholder='" + pageTitle + "'><i class='tooltip-icon fa fa-info-circle fa-lg' data-placement='left'title='' data-original-title='Page title'></i></div>" +
                            "<div class='clearfix'><input type='text' name='meta_keywords' value='' placeholder='Keywords'><i class='tooltip-icon fa fa-info-circle fa-lg' data-placement='left' title='' data-original-title='Keywords'></i></div>" +
                                "<div class='clearfix'><input type='text' name='meta_description' value='' placeholder='Description'><i class='tooltip-icon fa fa-info-circle fa-lg' data-placement='left' title='' data-original-title='Description'></i></div>" +
                                    "<div class='clearfix'><input type='submit' value='Save' class='btn btn-success'></div>" +
                                    "</form>" +
                                "</div>" +
                            "</li>";

    $("#pagesSettings").append(settingsBlockCode);
    createPageSettingsHandler();
    pageSettingsBlockHandler();
    $(".tooltip-icon").unbind("tooltip");
    $(".tooltip-icon").tooltip();
}

function pageSettingsBlockHandler(){
    $("#sidebar-big").find("#pagesSettings").find("li").children(".showHideLink").unbind("click");
    $("#sidebar-big").find("#pagesSettings").find("li").children(".showHideLink").on("click",function(){
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            $(this).children("i").removeClass("fa-angle-down");
            $(this).children("i").addClass("fa-angle-up");
        }else{
            $(this).children("i").removeClass("fa-angle-up");
            $(this).children("i").addClass("fa-angle-down");
        }
        $(this).closest("li").find(".showPageSettings").toggle("fast");

    });
}

function webStyleSettingsUpdate(){
    $("#web-style-settings-update").submit(function(e){
        e.preventDefault();
        var form = $(this);
        $(this).ajaxSubmit({
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
                    console.log("Internal Server Error [500]." + jqXHR.responseText);
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
                responseJson = jQuery.parseJSON(XMLHttpRequest.responseText);
                if(!responseJson.errors){
                    console.log(responseJson.src);
                    printErrorByElement(form.children(".errors"),"Successfully updated.","success");
                }else{
                    var i;
                    for (i = 0; i < responseJson.errors.length; i++) {
                        console.log(responseJson.errors[i]);
                        printErrorByElement(form.children(".errors"),responseJson.errors[i],"error");
                    }
                }
            }
        });
    });
}

$(document).ready(function(){
    createPageHandler();
    deletePageHandler();
    createPagesSortable();
    createPageSettingsHandler();
    webStyleSettingsUpdate();
    pageSettingsBlockHandler();
});