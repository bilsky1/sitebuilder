$(document).ready(function(){
    $("#web_published_at").datetimepicker({
        language: 'en'
    });
    $("#web-domain-settings").unbind("submit");
    $("#web-domain-settings").submit("click",function(e){
        e.preventDefault();
        var form = $(this);
        $.ajax({
            type: "POST",
            url: form.attr("action"),
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
                if (data.result == 1){
                    printErrorByElement(form.children("#web-domain-settings-messages"),"Successfully updated","success");
                    $("#sidebar-view").attr("href",data.publish_url);
                }
                else if(data.errors != null){
                    var i;
                    console.log(data.errors);
                    for (i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i]);
                        printErrorByElement(form.children("#web-domain-settings-messages"),data.errors[i],"error");
                    }
                }
            }

        });
    });
});