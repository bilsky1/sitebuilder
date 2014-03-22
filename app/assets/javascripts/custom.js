/*Pages*/
function printError(to,error,type){
    $(to).prepend("<div class='alert alert-" + type + " fade in'>" +
        "<a class='close' data-dismiss='alert' href='#'>x</a>" + error +
        "</div>");
    setTimeout(function(){$(to).find("a.close").trigger("click")},2500);
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
                        $("#nav").append("<li><a data-page-id='" + data.page_id + "' href='#!" + data.page_name + "'>" + data.page_name + "</a></li>");
                        $("#pagesList").append("<li class='alert alert-info'>" + data.page_name + "<i class='fa fa-trash-o fa-lg delete-page' data-page-id='" + data.page_id + "' ></i></li>");
                        initializeNav();
                        addDeletePageHandler($("#pagesList").find("li").last().children("i.delete-page"));
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
    elem.on("click",function(e){
        e.preventDefault();
        var pageItem = elem.closest("li");
        $.ajax({
            type:"POST",
            url: "/pages/delete_page",
            data: {page_id:elem.data("page-id")},
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
                            if($(this).data("page-id") === pageItem.find("i").data("page-id"))
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

$(document).ready(function(){
    createPageHandler();
    deletePageHandler();
});