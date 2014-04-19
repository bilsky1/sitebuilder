function printError(to,error,type){
    $(to).prepend("<div class='alert alert-" + type + " fade in'>" +
        "<a class='close' data-dismiss='alert' href='#'>x</a>" + error +
        "</div>");
    setTimeout(function(){$(to).find("a.close").trigger("click")},3500);
}

function printErrorByElement(to,error,type){
    to.prepend("<div class='alert alert-" + type + " fade in'>" +
        "<a class='close' data-dismiss='alert' href='#'>x</a>" + error +
        "</div>");
    setTimeout(function(){$(to).find("a.close").trigger("click")},3500);
}

function createServiceHandler(){
    $('#create-new-service').on("click",function(e){
        e.preventDefault();
        var form = $(this).closest("form");
        var originalButText = $(this).text();
        $(this).text("Loading ...");
        $.ajax({
            type: form.attr("method"),
            url: form.attr("action"),
            data: {web_id:form.find("input[name='web_id']").val(), service_type:form.find("input[name='service_type']").val() , service_value: form.find("#service_value").val()},
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
                        printError("#services-messages","Sucessfully created","success");
                        addServiceSettingsElement(form.find("input[name='web_id']").val(), data.ext_service_id, data.ext_service_type, data.ext_service_value);

                    }
                    else
                        printError("#services-messages", "We're sorry, cannot create new service","error");
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printError("#services-messages",data.errors[i],"error");
                    }
                }
            }

        });
    });
}

function serviceSettingsBlockHandler(){
    $("#sidebar-big").find("#servicesSettings").find("li").unbind("click");
    $("#sidebar-big").find("#servicesSettings").find("li").on("click",".showHideLink",function(){
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            $(this).children("i").removeClass("fa-angle-down");
            $(this).children("i").addClass("fa-angle-up");
        }else{
            $(this).children("i").removeClass("fa-angle-up");
            $(this).children("i").addClass("fa-angle-down");
        }
        $(this).closest("li").find(".showServiceSettings").toggle("fast");

    });
}

function createServiceSettingsHandler(){
    $(".update-service-settings").unbind("submit");
    $(".update-service-settings").submit("click",function(e){
        e.preventDefault();
        var form = $(this);
        $.ajax({
            type: "POST",
            url: "/ext_services/update_ext_service",
            data: form.serialize(),
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
                    printErrorByElement(form.children(".service-settings-messages"),"Successfully updated","success");
                    form.find("input[name='service_value']").val(data.ext_service_value);
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printErrorByElement(form.children(".service-settings-messages"),data.errors[i],"error");
                    }
                }
            }

        });
    });
}

function addServiceSettingsElement(webId, serviceId, serviceType, serviceValue){
    var settingsBlockCode =
        "<li>" +
            "<a class='showHideLink' href='#'>" +
                "<span class='serviceType'>" + serviceType + "</span>" +
                "<i class='fa fa-lg fa-angle-down'></i>" +
            "</a>" +
            "<div class='showServiceSettings'>" +
                "<form class='update-service-settings' action='/ext_services/update_ext_service' method='post'>" +
                    "<div class='service-settings-messages'></div>" +
                    "<div class='clearfix'><input type='hidden' name='web_id' value='" + webId + "'></div>" +
                    "<div class='clearfix'><input type='hidden' name='service_id' value='" + serviceId  + "'></div>" +
                    "<div class='clearfix'><input type='text' name='service_value' value='" + serviceValue  +  "' placeholder='Service value'><i class='tooltip-icon fa fa-info-circle fa-lg' data-placement='left' rel='tooltip' title='' data-original-title='External service value'></i></div>" +
                    "<div class='clearfix'><input type='submit' value='Save' class='btn btn-success pull-left' id='update-service'><a class='btn btn-danger pull-right delete-service'><i class='fa fa-trash-o fa-lg'></i></a></div>" +
                "</form>" +
           "</div>" +
        "</li>";

    $("#servicesSettings").append(settingsBlockCode);
    createServiceSettingsHandler();
    deleteServiceHandler();
    serviceSettingsBlockHandler();
    $(".tooltip-icon").unbind("tooltip");
    $(".tooltip-icon").tooltip();
}

function deleteServiceHandler(){
    $('#servicesSettings').find("li").find(".delete-service").each(function(){
        addDeleteServiceHandler($(this));
    });
}

function addDeleteServiceHandler(elem){
    elem.on("click",function(e){
        e.preventDefault();
        var service_id = elem.closest("li").find("input[name='service_id']").val();
        $.ajax({
            type:"POST",
            url: "/ext_services/delete_ext_service",
            data: {service_id:service_id},
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
                        elem.closest("li").remove();
                    }
                    else
                        printErrorByElement(elem.closest("li").find("form").children(".service-settings-messages"),"We're sorry, cannot delete page","error");
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printErrorByElement(elem.closest("li").find("form").children(".service-settings-messages"),data.errors[i],"error");
                    }
                }
            }

        });
    });
}

$(document).ready(function(){
    createServiceHandler();
    serviceSettingsBlockHandler();
    createServiceSettingsHandler();
    deleteServiceHandler();
});