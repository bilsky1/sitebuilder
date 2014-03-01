(function($){
    $.fn.extend({
        //plugin name - subpagebuild
        subpagebuild: function(options) {
            var defaults = {
                block_container: '#blocks-content',
                full_page_content: '#main-content-inner',
                gen_block_class: '.gen_block'
            };

            globalOptions = $.extend(defaults, options);

            numberOfGenBlock = $(globalOptions.gen_block_class).length;

            genPageBgColor = $(globalOptions.full_page_content).css("background");

            return this.each(function() {
                globalSubpageBuild = $(this);
                CKEDITOR.disableAutoInline = true;
                CKEDITOR.config.removePlugins = 'magicline';
                CKEDITOR.config.allowedContent = true;

                $(globalOptions.block_container + " .blocks li").on("click", "a" ,function(e){
                    e.preventDefault();
                });

                $("#" + globalSubpageBuild.attr("id") + ", .col").sortable({
                    placeholder: "ui-state-highlight",
                    handle: '.moveBlock',
                    revert: true,
                    connectWith: "#subpageContent, .col",
                    refresh: true,
                    receive: function(event, ui){
                        if ( transfered === "draggable" && $(this).find(".block") ) {
                            numberOfGenBlock += 1;

                            var id = genIdToNewBlock();
                            var blockObj = generateBlock(dragBlockId, id);

                            $(this).find(".block").removeClass()
                                .addClass("gen_block")
                                .attr("data-type", dragBlockId)
                                .attr("id",id.toString())
                                .html(blockObj.genBlockCode);

                            blockObj.showHideEmptyCode(globalSubpageBuild,emptyIconCode);
                            blockObj.setBlockHoverHandler(globalSubpageBuild, emptyIconCode);

                            if($("#" + blockObj.id).data("type") === "column_b"){
                                blockObj.refreshSortable();
                            }else if($("#" + blockObj.id).data("type") === "map_b"){
                                blockObj.initializeGoogleMap();
                            }

                            transfered = 'sortable';
                            dragBlockId = "";
                        }
                        setInlineCKeditor('.ckeditor');
                    },
                    update: function( event, ui ) {
                        showHideEmptyColumnCode(globalSubpageBuild);
                    },
                    start: function( event, ui ) {
                        startDragEffect();
                        //console.log("start sortable");
                    },
                    stop: function(event, ui){
                        stoptDragEffect();
                        //console.log("stop sortable");
                    }
                });

                //DRAGABLE ------------jQuery-UI
                $(globalOptions.block_container + " .blocks li .block").draggable({
                    helper: 'clone',
                    appendTo: 'body',
                    cursor: 'move',
                    revert: 'invalid',
                    connectToSortable: '#'+globalSubpageBuild.attr("id") + ', .col',
                    start: function( event, ui ) {
                        transfered = 'draggable',
                        dragBlockId = $(this).attr("id");
                        startDragEffect(globalSubpageBuild);
                        //console.log("start drag");
                    },
                    stop: function(event, ui){
                        stoptDragEffect(globalSubpageBuild);
                        //console.log("stop drag");
                    }
                }); //DRAGABLE

                loadAllBlock(globalSubpageBuild);

            });//return this.each
        }
    });
})(jQuery);