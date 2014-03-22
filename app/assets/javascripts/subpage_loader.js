$(document).ready(function(){

    checkURL();

    initializeNav();

});

var lasturl="";
function initializeNav(){
    $('ul#nav li a').click(function (e){
        checkURL(this.hash);
    });
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
    if(hash != lasturl){
        lasturl=hash;

        if(hash==""){
            $('#subpageContent').html("default_content");
        }
        else{
            setSelectedNav(hash);
            getPage(hash);
        }
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
    $('#subpageContent').prepend("<div id='loading'><i class='fa fa-spinner fa-spin fa-2x'></i></div>");
    $.ajax({
        type: "POST",
        url: "/pages/get_page",
        data: {web_id:$("#web-id").text(), page_name: subpageName},
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
                    //---------------------------------
                });
                $("#subpageContent").fadeIn(600);
            }
            else if(data.errors != null){
                console.log(data.errors);
                //$("#subpageContent").html(data.errors);
            }
        }

    });

}