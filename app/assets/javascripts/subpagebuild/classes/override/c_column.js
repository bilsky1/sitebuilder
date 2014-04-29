//ColumnBlock
function ColumnBlock(id,elClass) {
    this.id = id;
    this.elClass = elClass;
    this.maxWidthOfColumn = 100;

    //dont create dialog window
    this.createDialogWindow = function(){};

    this.setCurrentOptions = function(){
        this.numOfColumn = $("#" + this.id).find(".columns").first().children(".col").length;

        var block = this;
        $("#" + this.id).find("button").each(function(){
            var col = $(this).attr("class").replace("col","");
            if( block.numOfColumn === parseInt(col))
                $(this).addClass("current");
            else
                $(this).removeClass("current");
        });
    };

    this.refreshSortable = function(){
        $("#" + globalSubpageBuild.attr("id") + ", .col, .ajax-col").sortable({
            placeholder: "ui-state-highlight",
            handle: '.moveBlock',
            revert: true,
            connectWith: "#subpageContent, .col, .ajax-col",
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

                    blockObj.showHideEmptyCode(globalSubpageBuild);
                    blockObj.setBlockHoverHandler();

                    if($("#" + blockObj.id).data("type") === "column_b" || $("#" + blockObj.id).data("type") === "ajax_content_b"){
                        blockObj.refreshSortable();
                        if($("#" + blockObj.id).data("type") === "ajax_content_b")
                            blockObj.createAjaxContentService();
                    }

                    transfered = 'sortable';
                    dragBlockId = "";
                }
                setInlineCKeditor('.ckeditor');
                removeAllUDragableFromSubpageContent(globalSubpageBuild);
                isContentChange = true;
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
    };

    this.deleteColumn = function(columnEl){
        columnEl.find(this.elClass).each(function(){
            for(var i=0; i < genBlocksList.length; i++){
                if($(this).attr("id") === genBlocksList[i].id.toString())
                    genBlocksList[i].deleteBlock();
            }
        });
        columnEl.remove();
    };

    this.removeWidthAttr = function(){
        $("#" + this.id).find(".columns").first().children(".col").removeAttr("style");
    };

    this.setCols = function(n){
        var block = this;
        if((n-block.numOfColumn) > 0){
            for( var i=0; i < n; i++ ){
                if( i < block.numOfColumn ){
                    $("#" + this.id).find(".columns").first().children(".col").removeClass("span_1_of_" + block.numOfColumn)
                        .addClass("span_1_of_" + n);
                } else{
                    $("#" + this.id).find(".columns").first().append("<div class='col span_1_of_" + n + "'></div>");
                }
            }
        } else {
            var i = 0;
            $("#" + this.id).find(".columns").first().children(".col").each(function(){
                if( i < n ){
                    $(this).removeClass("span_1_of_" + block.numOfColumn);
                    $(this).addClass("span_1_of_" + n);
                } else{
                    block.deleteColumn($(this));
                }
                i++;
            });
        }
        this.numOfColumn = n;
        this.refreshSortable();
        this.removeWidthAttr();
        this.removeResizeSeparators();
        this.setResizeSeparators();
        showHideEmptyColumnCode($("#" + block.id));
        isContentChange = true;

    };

    this.setSettingsHandler = function(){
        this.setCurrentOptions();
        var block = this;
        $("#"+this.id).children(".blockControls").on("click",".2col",function(){
            $(this).closest('.blockControls').find("button").removeClass("current");
            $(this).addClass("current");
            block.setCols(2);
        });
        $("#"+this.id).children(".blockControls").on("click",".3col",function(){
            $(this).closest('.blockControls').find("button").removeClass("current");
            $(this).addClass("current");
            block.setCols(3);
        });
        $("#"+this.id).children(".blockControls").on("click",".4col",function(){
            $(this).closest('.blockControls').find("button").removeClass("current");
            $(this).addClass("current");
            block.setCols(4);
        });
        $("#"+this.id).children(".blockControls").first().on("click",".5col",function(){
            $(this).closest('.blockControls').find("button").removeClass("current");
            $(this).addClass("current");
            block.setCols(5);
        });

    };

    this.setOneDragableResize = function(el,from,to,parrentWidth,sepIndex){
        var cols = $("#" + this.id).find(".columns").first().children(".col");
        var separators = $("#" + this.id).find(".columns").first().children(".columnSep");
        var block = this;
        el.draggable({
            axis: 'x',
            start: function(event, ui) {
                leftBeforeStart = cols.filter(function(index){
                    return index === ui.helper.data("pos");
                }).width();
                leftAfterStart = cols.filter(function(index){
                    return index === ui.helper.data("pos") + 1;
                }).width();
            },
            drag: function(event, ui) {
                cols.filter(function(index){
                    return index === ui.helper.data("pos");
                }).css( "width", (100*(leftBeforeStart + (ui.position.left-ui.originalPosition.left))/parrentWidth) + "%" );

                cols.filter(function(index){
                    return index === ui.helper.data("pos") + 1;
                }).css( "width", (100*(leftAfterStart - (ui.position.left-ui.originalPosition.left))/parrentWidth) - 0.1 + "%" );   //-0.1 bug fixing of column size 3
            },
            stop: function(event, ui) {
                if(sepIndex == 0){
                    if(block.numOfColumn > 2){
                        var nextCcol = cols.filter(function(index){return index===1;});
                        var stopNextLeft = parseInt(nextCcol.offset().left) + block.maxWidthOfColumn;
                        nextCcol = cols.filter(function(index){return index===2;});
                        var stopNextRight = parseInt(nextCcol.offset().left) + parseInt(nextCcol.width()) - block.maxWidthOfColumn;
                        separators.filter(function(index){ return index === 1 }).draggable({containment: [stopNextLeft,0,stopNextRight,0]} );
                    }
                }
                else if(sepIndex == 1){
                    if(block.numOfColumn > 3){
                        var nextCol = cols.filter(function(index){return index===2;});
                        var stopNextLeft = parseInt(nextCol.offset().left) + block.maxWidthOfColumn;
                        nextCol = cols.filter(function(index){return index===3;});
                        var stopNextRight = parseInt(nextCol.offset().left) + parseInt(nextCol.width()) - block.maxWidthOfColumn;
                        separators.filter(function(index){ return index === 2 }).draggable({containment: [stopNextLeft,0,stopNextRight,0]} );
                    }

                    var prevCol = cols.filter(function(index){return index===0;});
                    var prevLeft = parseInt(prevCol.offset().left) + block.maxWidthOfColumn;
                    prevCol = cols.filter(function(index){return index===1;});
                    var prevRight = parseInt(prevCol.offset().left) + parseInt(prevCol.width())- block.maxWidthOfColumn;
                    separators.filter(function(index){ return index === 0 }).draggable({containment: [prevLeft,0,prevRight,0]} );


                }
                else if(sepIndex == 2){
                    if(block.numOfColumn > 4){
                        var nextCol = cols.filter(function(index){return index===3;});
                        var stopNextLeft = parseInt(nextCol.offset().left) + block.maxWidthOfColumn;
                        nextCol = cols.filter(function(index){return index===4;});
                        var stopNextRight = parseInt(nextCol.offset().left) + parseInt(nextCol.width()) - block.maxWidthOfColumn ;
                        separators.filter(function(index){ return index === 3 }).draggable({containment: [stopNextLeft,0,stopNextRight,0]} );
                    }

                    var prevCol = cols.filter(function(index){return index===1;});
                    var prevLeft = parseInt(prevCol.offset().left) + block.maxWidthOfColumn;
                    prevCol = cols.filter(function(index){return index===2;});
                    var prevRight = parseInt(prevCol.offset().left) + parseInt(prevCol.width()) - block.maxWidthOfColumn;
                    separators.filter(function(index){ return index === 1 }).draggable({containment: [prevLeft,0,prevRight,0]} );

                }
                else if(sepIndex == 3){
                    var prevCol = cols.filter(function(index){return index===2;});
                    var prevLeft = parseInt(prevCol.offset().left) + block.maxWidthOfColumn;
                    var prevCol = cols.filter(function(index){return index===3;});
                    var prevRight = parseInt(prevCol.offset().left) + parseInt(prevCol.width()) - block.maxWidthOfColumn;
                    separators.filter(function(index){ return index === 2 }).draggable({containment: [prevLeft,0,prevRight,0]} );
                }
            },
            containment: [from,0,to,0]
        });
    };

    this.setResizeDragable = function(){
        var cols = $("#" + this.id).find(".columns").first().children(".col");
        var separators = $("#" + this.id).find(".columns").first().children(".columnSep");
        var parrentWidth = $("#" + this.id).find(".columns").first().width();

        for(var i = 0; i < this.numOfColumn; i++){
            if(i < this.numOfColumn-1){
                var col = cols.filter(function(index){return index===i;});
                var from = parseInt( col.offset().left ) + this.maxWidthOfColumn;

                col = cols.filter(function(index){return index===i+1;});
                var to = parseInt( col.offset().left ) + parseInt(col.width()) - this.maxWidthOfColumn;
                this.setOneDragableResize(separators.filter(function(index){return index===i}), from, to, parrentWidth, i);
            }
        }
    };

    this.setResizeSeparators = function(){
        var block = this;
        var cols = $("#" + this.id).find(".columns").first().children(".col");
        var len = cols.length;
        var left = 0;
        cols .each(function(index,element){
            if (index != len - 1) {
                left += (100*$(this).width()/$(this).closest(".columns").width()) + 2.5 ;    //(100*width/parentWidth)  + margin column
                var separator = $(block.separatorCode).css("left",left + "%").attr("data-pos",index.toString());
                $(this).closest(".columns").append(separator);
                block.setResizeDragable();
            }
        });
    };

    this.removeResizeSeparators = function(){
        $("#" + this.id).find(".columns").first().children(".columnSep").remove();
    };

    //setBlockHoverHandler - on hover block add controls or delete controls
    this.setBlockHoverHandler = function(){
        var block = this;
        this.createDialogWindow();
        $('#' + block.id).mouseenter(function(e) {
            if($(this).find(".blockControls")){
                $(this).prepend(block.getHoverCode());
                block.setDeleteHandler();
                block.setSettingsHandler();
                block.setResizeSeparators();
            }
        }).mouseleave(function(e) {
                $(this).find(".blockControls").remove();
                block.removeResizeSeparators();
            });
    };//setBlockHoverHandler

    this.deleteBlock = function(){
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).find(this.elClass).each(function(){
            for(var i=0; i < genBlocksList.length; i++){
                if($(this).attr("id") === genBlocksList[i].id.toString())
                    genBlocksList[i].deleteBlock();
            }
        });
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        this.showHideEmptyCode(globalSubpageBuild);
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
    };

    this.settingsCode = "<button class='2col' >2</button>" +
        "<button class='3col' >3</button>" +
        "<button class='4col' >4</button>" +
        "<button class='5col' >5</button>";

    this.separatorCode = "<div class='columnSep'></div>"

    this.numOfColumn = $("#" + this.id).find(".col").length;
    this.genBlockCode = '<div class="columns group">' +
        '<div class="col span_1_of_3"></div>' +
        '<div class="col span_1_of_3"></div>' +
        '<div class="col span_1_of_3"></div>' +
        '</div>';

    this.settingsDialogId = "settings-confirm" + this.id;
    this.settingsDialogCode =   "<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'>" +
        "</span>Column block options</p>";
}//ColumnBlock

extend(ColumnBlock,blockAbstractClass);