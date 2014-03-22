/*CONTENT CLEANER - change messy content and save to server by AJAX*/
function Cleaner(messyGenerateContent) {
    this.content = messyGenerateContent;

    this.subpageName = "";

    this.getWindowHash = function(){
        var hash=window.location.hash.toString();
        if(hash == ''){
            hash = $("#nav").find("li").first().find("a").attr("href");
            if(hash == null)
                hash = "";
        }
        return hash;
    };

    this.setSubpageName = function(hash){
        if(hash != null)
            this.subpageName = hash.replace('#!','');
    }
    this.printError = function(error, type){
        $("#saveSubpage").closest(".saveButtonContainer").prepend("<div class='alert alert-" + type + " fade in'>" +
            "<a class='close' data-dismiss='alert' href='#'>x</a>" + error +
            "</div>");
        setTimeout(function(){$("#saveSubpage").closest(".saveButtonContainer").find("a.close").trigger("click")},2500);
    }

    this.updateContentToServer = function(){
        this.setSubpageName(this.getWindowHash());
        var originalButText = $('#saveSubpage').text();
        var cleaner = this;
        $('#saveSubpage').text("Loading ...");
        $.ajax({
            type: "POST",
            url: "/pages/update_page",
            data: {web_id:$("#web-id").text(), page_name: this.subpageName, content: this.content},
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
                if (data.update_result != null){
                    $('#saveSubpage').text(originalButText);

                    if(parseInt(data.update_result) === 1)
                        cleaner.printError("Sucessfully updated","success");
                    else
                        cleaner.printError("We're sorry, content cannot save updated","error");
                }
                else if(data.errors != null){
                    var i;
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
        var subpageCleaner = new Cleaner($("#subpageContent").html());
        subpageCleaner.updateContentToServer();
    });
});