//EXTEND - PURE JS INHERITANCE method - add method to class
//Empty subpage content icon
var deleteCode = "<i class='fa fa-times'></i>";
var moveCode =  "<i class='fa fa-arrows'></i>";
var settingsCode = "<i class='fa fa-wrench'></i>";

var emptyIconCode = "<div class='dndIcon' class='text-center'><img alt='Drag element here' src='/assets/drag_drop_icon.png'></div>";
var emptyColumnCode = '<div class="colEmptyIcon">Drag element here</div>';

// variable to know if element is drag & drop or sort
var transfered = 'sortable';

//dragBlockId = gen_block data-type
var dragBlockId = "";
var numberOfGenBlock = 0;
var genPageBgColor;
var genBlocksList = new Array();
var globalOptions;
var globalSubpageBuild;
var idOfLastBlock;
var lastHashCode;

var isContentChange = false; //use to alert when there is a unsaved content


/*Browser detect--------------------------------------------------
 * ---------------------------------------------------------------*/
var _browser = {};

function detectBrowser() {
    var uagent = navigator.userAgent.toLowerCase();
    $("#result").html("User agent string: <b>" + uagent + "</b>");

    _browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);
    _browser.chrome = /webkit/.test(uagent) && /chrome/.test(uagent);
    _browser.safari = /applewebkit/.test(uagent) && /safari/.test(uagent) && !/chrome/.test(uagent);
    _browser.opera = /opera/.test(uagent);
    _browser.msie = /msie/.test(uagent);
    _browser.version = '';

    for (x in _browser)
    {
        if (_browser[x]) {
            _browser.version = uagent.match(new RegExp("(" + x + ")( |/)([0-9]+)"))[3];
            break;
        }
    }

}



detectBrowser();
/*Browser detect--------------------------------------------------
* ---------------------------------------------------------------*/


//GENERATE Block object, depend on blockID parameter of dropped block
function generateBlock(blockType,blockId){
    var blockObj;
    //--------BASIC blocks
    if(blockType === "text_b")
        blockObj = new TextBlock(blockId,globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "title_b")
        blockObj = new TitleBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "image_b"){
        blockObj = new ImageBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
        blockObj.checkImageExist();
    }
    else if(blockType === "image_text_b"){
        blockObj = new ImageTextBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
        blockObj.checkImageExist();
    }
    else if(blockType === "button_b")
        blockObj = new ButtonBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "gallery_b"){
        blockObj = new GalleryBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
        blockObj.checkImagesExist();
    }
    else if(blockType === "map_b")
        blockObj = new MapsBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    //--------STRUCTURE blocks
    else if(blockType === "column_b")
        blockObj = new ColumnBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "divider_b")
        blockObj = new DividerBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    //--------AJAX blocks
    else if(blockType === "ajax_content_b"){
        blockObj = new AjaxContentBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
        blockObj.getAjaxBlockContents();
    }
    //--------MEDIA blocks
    else if(blockType === "pdf_b")
        blockObj = new PdfBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "youtube_b")
        blockObj = new YoutubeBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "social_icons_b")
        blockObj = new SocialIconsBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));
    else if(blockType === "code_b")
        blockObj = new CodeBlock(blockId, globalOptions.gen_block_class, "#" + $(this).attr("id"));

    genBlocksList.push(blockObj);

    return blockObj;
}//generateBlock

//set up inline editor for elements with class (Argument className)
function setInlineCKeditor(className){
    $(className).each(function(){
        var name;
        for(name in CKEDITOR.instances) {
            var instance = CKEDITOR.instances[name];
            if(this && this == instance.element.$) {
                return;
            }
        }
        $(this).attr('contenteditable', true);

        CKEDITOR.inline( this, {
            uiColor: '#C2C2C2',
            toolbar: [
                ['Bold','Italic','Underline', "-" ,'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
                ['TextColor','BGColor','Font','FontSize'],
                [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                [ 'Link', 'Unlink' ],
                ['Undo','Redo']

            ],
            on :
            {
                change :function( ev )
                {
                    isContentChange = true;
                }
            }
        });
    });
}//setInlineCKeditor

function setInlineCKeditorByEl(className,el){
    el.find(className).each(function(){
        var name;
        for(name in CKEDITOR.instances) {
            var instance = CKEDITOR.instances[name];
            if(this && this == instance.element.$) {
                return;
            }
        }
        $(this).attr('contenteditable', true);

        CKEDITOR.inline( this, {
            uiColor: '#C2C2C2',
            toolbar: [
                ['Bold','Italic','Underline', "-" ,'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
                ['TextColor','BGColor','Font','FontSize'],
                [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                [ 'Link', 'Unlink' ],
                ['Undo','Redo']

            ],
            on :
            {
                change :function( ev )
                {
                    isContentChange = true;
                }
            }
        });
    });
}

//startDragEffect - set style when block is drag or sort
function startDragEffect(){
    $(".ui-draggable-dragging").css({
        background: "#2e8bd9",
        border: "1px solid #155489"
    });
    var color = bgColorForDragEffect(genPageBgColor,"0.6");
    $(globalOptions.full_page_content).css("background",color);
    globalSubpageBuild.css({
        background: genPageBgColor,
        borderRadius: "5px",
        border: "1px dashed black"
    });
}//startDragEffect

//stoptDragEffect - delete style when block is drag or sort
function stoptDragEffect(){
    $(globalOptions.full_page_content).css("background",genPageBgColor);
    globalSubpageBuild.css({
        background: "none",
        borderRadius: "0px",
        border: "none"
    });
}//stoptDragEffect

//DRAG & DROP icon on empty subpage content
function dragAndDropIcon(element){
    if(jQuery.trim(element.html()) === "" || element.html() === emptyIconCode || genBlocksList.length == 0){
        if(!(element.find(".dndIcon").length >= 1))
            element.append(emptyIconCode);
    } else {
        element.find(".dndIcon").remove();
    }
} //DRAG & DROP icon

function showHideEmptyColumnCode(element){
    element.find(".col, .ajax-col").each(function(){
        if( jQuery.trim($(this).html()) === ""){
            $(this).append(emptyColumnCode);
        }
        else if($(this).html() === emptyColumnCode){}
        else {
            $(this).find(".colEmptyIcon").remove();
        }
    });
}

function loadAllBlock(obj){
    obj.find(globalOptions.gen_block_class).each(function(){
        var blockObj = generateBlock($(this).data("type"),parseInt($(this).attr("id")));
        blockObj.setBlockHoverHandler();
    });
    dragAndDropIcon(obj);
    showHideEmptyColumnCode(globalSubpageBuild);
    setInlineCKeditor('.ckeditor');
    idOfLastBlock = getIdOfLastBlock();
}

function loadAllBlockInSubcontent(subcontentEl){
    subcontentEl.find(globalOptions.gen_block_class).each(function(){
        var blockObj = generateBlock($(this).data("type"),parseInt($(this).attr("id")));
        blockObj.setBlockHoverHandler();
    });
    dragAndDropIcon($("#subpageContent"));
    showHideEmptyColumnCode(globalSubpageBuild);
    setInlineCKeditorByEl('.ckeditor',subcontentEl);
    idOfLastBlock = getIdOfLastBlock();
}

function genIdToNewBlock(){
    var lastId = 0;
    for(var i=0; i < genBlocksList.length; i++){
        if(parseInt(genBlocksList[i].id) > lastId){
            lastId = parseInt(genBlocksList[i].id);
        }
    }
    return lastId+1;
}

function getIdOfLastBlock(){
    var lastId = 0;
    for(var i=0; i < genBlocksList.length; i++){
        if(parseInt(genBlocksList[i].id) > lastId){
            lastId = parseInt(genBlocksList[i].id);
        }
    }
    return lastId;
}

function extend(obj, blockAbstractClass){
    for (var i in blockAbstractClass) {
        obj.prototype[i] = blockAbstractClass[i]
    }
}//extend

/*Convert rgba color to hexa color*/
function hex( c ) {
    var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
    return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
}

/*Convert hex color to rgb color*/
function hex2rgb(hex,opacity) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var oldHex = hex;
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgba("+ parseInt(result[1], 16) + ","+ parseInt(result[2], 16) + ","+  parseInt(result[3], 16) +"," + opacity + ")" : oldHex;
}
function bgColorForDragEffect(color,opacity){
    var dragColor = "#646464";
    if(color.indexOf("rgba") >= 0){
        dragColor = color.substring(0,color.lastIndexOf(",")+1) + opacity + color.substring(color.lastIndexOf(")"));
    } else if(color.indexOf("rgb") >= 0){
        dragColor = color.replace("rgb","rgba").replace(")", "," + opacity + ")");
    }else if(color.indexOf("#") >= 0){
        dragColor = hex2rgb(color,opacity);
    }
    return dragColor;
}
function removeAllAttr(el){
    el.each(function() {
        var attributes = this.attributes;
        var i = attributes.length;
        while( i-- ){
            this.removeAttributeNode(attributes[i]);
        }
    })
}

function removeAllUDragableFromSubpageContent(el){
    el.find(".ui-draggable").remove();
    el.find(".ui-state-highlight").remove();
}