function Loader() {

    this.initAll = function(){
        this.initGaleries();
        this.initGoogleMaps();
        this.initAjaxContents($(".gen_block[data-type='ajax_content_b']"))
    };

    this.initGoogleMaps = function(){
        var geocoder = new google.maps.Geocoder();
        $(".googleMaps").each(function(){
            var mapEl = $(this);
            var zoom = parseInt($(this).data("zoom"));
            var location = $(this).data("loc");
            var markers = new Array();
            geocoder.geocode( { 'address': location}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var mapOptions = {
                        zoom: zoom,
                        center: results[0].geometry.location
                    };
                    var map = new google.maps.Map(mapEl[0],mapOptions);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    markers.push(marker);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    };

    this.initGaleries = function(){
        $(".fancybox").fancybox({
            'padding'		: 0
        });
    };

    /*----------------AJAX CONTENT LOADING & HANDLERS SET
    * ------------------------------------------------------------------------------*/
    this.initAjaxContents = function(ajaxBlocks){
        var loader = this;
        ajaxBlocks.each(function(){
            loader.getAjaxContent($(this));
            loader.setAjaxContentButtonHandler($(this));
            loader.setAjaxContentBackButtonHandler($(this));
        });
    }

    this.setAjaxContentButtonHandler = function(blockEl){
        var loader = this;
        blockEl.children(".ajax-block-container").children(".buttonAlign").children(".button").on("click",function(){
            loader.getAjaxContentAfter(blockEl);
        });
    };

    this.setAjaxContentBackButtonHandler = function(blockEl){
        var loader = this;
        blockEl.children(".ajax-block-container").children(".buttonBackAlign").children(".button").on("click",function(){
            loader.getAjaxContent(blockEl);
        });
    };

    this.getAjaxContent = function(blockEl){
        var ajaxContentId = blockEl.data("remote-id");
        var loader = this;
        $.ajax({
            url: "/ajax_contents/get_content",
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
                    //$("#subpageContent").subpagebuild();
                    blockEl.children(".ajax-block-container").children(".ajax-content-after").hide();
                    blockEl.children(".ajax-block-container").children(".ajax-content").show();
                    blockEl.children(".ajax-block-container").children(".ajax-content").html(data.content);
                    blockEl.children(".ajax-block-container").children(".buttonBackAlign").css("display","none");
                    blockEl.children(".ajax-block-container").children(".buttonAlign").css("display","block");

                    var ajaxBlocksInsideAjaxBlock = blockEl.children(".ajax-block-container").children(".ajax-content").find(".gen_block[data-type='ajax_content_b']");
                    if(ajaxBlocksInsideAjaxBlock.length > 0)
                        loader.initAjaxContents(blockEl.children(".ajax-block-container").children(".ajax-content").find(".gen_block[data-type='ajax_content_b']"));

                    console.log("Loader - get ajax content");
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
    };

    this.getAjaxContentAfter = function(blockEl){
        var loader = this;
        var ajaxContentId = blockEl.data("remote-id");
        $.ajax({
            url: "/ajax_contents/get_content_after",
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
                    //$("#subpageContent").subpagebuild();
                    blockEl.children(".ajax-block-container").children(".ajax-content").hide();
                    blockEl.children(".ajax-block-container").children(".ajax-content-after").show();
                    blockEl.children(".ajax-block-container").children(".ajax-content-after").html(data.content_after);
                    blockEl.children(".ajax-block-container").children(".buttonAlign").css("display","none");
                    blockEl.children(".ajax-block-container").children(".buttonBackAlign").css("display","block");

                    loader.initAjaxContents(blockEl.children(".ajax-block-container").children(".ajax-content-after").find(".gen_block[data-type='ajax_content_b']"));

                    console.log("Loader - get ajax content after");
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
    };


    //SEO OPTIONS
    this.setPageSeoOptions = function (new_title,new_keywords,new_description, web_name){
      this.changeTitle(new_title, web_name);
      this.changeMetaKeywords(new_keywords);
      this.changeMetaDescription(new_description);
    };

    this.changeTitle = function (new_title, web_name){
        document.title = web_name + " | " + new_title;
    };
    this.changeMetaKeywords = function (new_keywords){
        $('meta[name=keywords]').attr('keywords', new_keywords);
    };
    this.changeMetaDescription = function (new_description){
        $('meta[name=description]').attr('description', new_description);
    };


}