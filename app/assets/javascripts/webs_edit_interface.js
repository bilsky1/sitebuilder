$(document).ready(function() {
    /*-------------------------------------------------------------------------
     * --------------Defaults for hide/ show sidebar by window width------------
     * -------------------------------------------------------------------------*/
    var close_sidebar = {
        marginLeft: 0 //for main-content-inner
    };
    var close_small_sidebar = {
        width: 0,
        border: "none"
    };
    var close_big_sidebar = {
        width: 0,
        border: "none",
        display: "none"
    };

    var open_sidebar= {
        marginLeft:310
    }
    var open_small_sidebar = {
        width: 60,
        borderRight: "1px solid #313131"
    }
    var open_big_sidebar = {
        width: 250,
        borderRight: "1px solid #c2c2c2",
        display: "block"
    }



    //-----------------------------------------------------------------
    //-----------WINDOW WIDTH start----------------------------------
    //-----------------------------------------------------------------
    showHideSidebar();
    $(window).resize(function(){
        showHideSidebar();
    });
    function showHideSidebar(){
        if($(window).width() < 790){
            $("#sidebar-big").css(close_big_sidebar);
            $("#sidebar-small").css(close_small_sidebar);
            $("#main-content-inner").css(close_sidebar);
        }
        else{
            $("#sidebar-big").css(open_big_sidebar);
            $("#sidebar-small").css(open_small_sidebar);
            $("#main-content-inner").css(open_sidebar);
        }
    }
    //-----------------------------------------------------------------
    //-----------WINDOW WIDTH end----------------------------------
    //-----------------------------------------------------------------

    //-----------------------------------------------------------------
    //-----------SIDEBAR-TOGGLE start----------------------------------
    //-----------------------------------------------------------------
    $('#sidebar-toggle').tooltip();
    $('#sidebar-toggle').on("click",function(event){
        event.preventDefault();
        if($("#main-content-inner").css('marginLeft') != '0px'){
            $("#sidebar-big").css("border",close_big_sidebar.border);
            $("#sidebar-small").css("border",close_small_sidebar.border);
            $("#sidebar-big").animate({
                    width: close_big_sidebar.width
                }, 500,
                function(){
                    $("#sidebar-small").animate({
                        width: close_small_sidebar.width
                    }, 500);
                });
            $("#main-content-inner").animate({
                marginLeft: close_sidebar.marginLeft
            }, 1000,
            function(){
                $("#sidebar-big").css("display",close_big_sidebar.display);
            });
        }
        else{
            $("#sidebar-small").animate({
                    width: open_small_sidebar.width
                }, 500,
                function(){
                    $("#sidebar-big").animate({
                            width: open_big_sidebar.width
                        }, 500,
                        function(){
                            $("#sidebar-big").css("border-right",open_big_sidebar.borderRight);
                            $("#sidebar-small").css("border-right",open_small_sidebar.borderRight);
                        });
                });
            $("#main-content-inner").animate({
                marginLeft: open_sidebar.marginLeft
            }, 1000);
            $("#sidebar-big").css("display",open_big_sidebar.display);
        }
        $("#sidebar-content").toggleClass('expand');
    });
    //-------------------------------------------------------------
    //-----------SIDEBAR-TOGGLE end--------------------------------
    //-------------------------------------------------------------

    //-------------------------------------------------------------------
    //-----------SIDEBAR-NAVIGATION start--------------------------------
    //-------------------------------------------------------------------

    /*Active manu*/
    $("#sidebar-small .sidebar-menu li").on("click", "a",function(){
        $("#sidebar-small .sidebar-menu li").children("a").each(function () {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });

    /*Change content of sidebar-big*/
    /*view*/
    onClickSidebarById("#sidebar-view","#view-content");

    /*blocks*/
    onClickSidebarById("#sidebar-blocks","#blocks-content");

    /*pages*/
    onClickSidebarById("#sidebar-pages","#pages-content");

    /*settings*/
    onClickSidebarById("#sidebar-settings","#settings-content");

    /*publish*/
    onClickSidebarById("#sidebar-publish","#publish-content");

    function onClickSidebarById(idOfSidebarButton,idofShowContent){
        $(idOfSidebarButton).click(function(){
            $("#sidebar-big").children().each(function(){
                $(".sidebar-big-content").hide();
            });
            $(idofShowContent).animate({width: 'show'},500);
        });
    }

    //-------------------------------------------------------------------
    //-----------DEVICE-VIEW-CONTROL end----------------------------------
    //-------------------------------------------------------------------
    showHideDeviceControls();
    $(window).on("resize",function(){
        showHideDeviceControls();
    });
    $("#device-view-control").on("click","a",function(event){
        event.preventDefault();
        $(this).parent().children("a").each(function(){
            $(this).removeClass("active");
        });
        $(this).addClass("active");
        if($(this).attr("id") != "desktop")
            $("#main-content-inner").animate({width: $(this).data("contentWidth")},500);
        else
            $("#main-content-inner").css("width","auto");
    });

    /*show or hide device controls by window width */
    function showHideDeviceControls(){
        $w = $(window);
        $("#device-view-control a, #device-view-control a.active").each(function(){
            var contentWidth = $(this).data("contentWidth").match(/\d+/);
            var sidebarWidth = parseInt($("#main-content-inner").css('marginLeft').match(/\d+/));
            if(($w.width() < parseInt(contentWidth)+sidebarWidth) && $(this).attr('id') != "desktop"){      //margin of sidebar content
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    }

    //-------------------------------------------------------------------
    //-----------DEVICE-VIEW-CONTROL end----------------------------------
    //-------------------------------------------------------------------

});