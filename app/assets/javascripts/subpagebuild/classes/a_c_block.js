//Abstract class blockMethods - methods for all blocks
var blockAbstractClass = {
    deleteCode: deleteCode,
    moveCode: moveCode,
    settingsCode: settingsCode,

    //METHODS

    //setBlockHoverHandler - on hover block add controls or delete controls
    setBlockHoverHandler: function(){
        var block = this;
        this.createDialogWindow();
        $('#' + block.id).hover(
            function() {
                $(this).prepend(block.getHoverCode());
                block.setDeleteHandler();
                block.setSettingsHandler();
            }, function() {
                $(this).find(".blockControls").remove();
            }
        );
        /*$('#' + block.id).mouseenter(function(e) {
            if($(this).find(".blockControls")){
                $(this).prepend(block.getHoverCode());
                block.setDeleteHandler();
                block.setSettingsHandler();
            }
        }).mouseleave(function(e) {
                $(this).find(".blockControls").remove();
            });  */
    },//setBlockHoverHandler

    deleteBlockFromArray: function(){
        //genBlocksList.splice(jQuery.inArray(genBlocksList,this),1);
        for(var i = 0; i<genBlocksList.length; i++){
            if(this.id === genBlocksList[i].id)
                genBlocksList.splice(i,1);
        }
    },

    deleteBlock: function(){
        var deleteButtonElement = $("#" + this.id).children(".blockControls").children('.deleteBlock');
        deleteButtonElement.closest(this.elClass).remove();
        $("#" + this.settingsDialogId).remove();
        this.showHideEmptyCode(globalSubpageBuild);
        showHideEmptyColumnCode(globalSubpageBuild);
        this.deleteBlockFromArray();
        isContentChange = true;
    },

    //setDeleteHandler - onclick delete control delete this block
    setDeleteHandler: function(){
        var block = this;
        $("#" + this.id).children(".blockControls").children('.deleteBlock').on("click",function(){
            block.deleteBlock();
        });
    },//setDeleteHandler

    //createDialogWindow - create settings dialog window for change options of block
    createDialogWindow: function(){
        $("#" + this.id).append("\n" + this.getSettingsDialogCode());
        $('#' + this.settingsDialogId).dialog({
            resizable: false,
            height:"auto",
            width:"suto",
            modal: true,
            autoOpen: false,
            buttons: {
                "Save": function() {
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });

    },//createDialogWindow

    //setSettingsHandler - default on click show settings dialog
    setSettingsHandler: function(){
        var settingsDialogId = this.settingsDialogId;
        $("#"+this.id).find('.blockControls:first-child').find('.modifyBlock').on("click",function(e){
            $('#' + settingsDialogId).dialog("open");
        });
    },//setSettingsHandler

    //getHoverCode - build hover controls code
    getHoverCode: function(){
        return "<div class='blockControls'>" +
            "<div class='deleteBlock'>" + this.deleteCode + "</div>" +
            "<div class='moveBlock'>" + this.moveCode + "</div>" +
            "<div class='modifyBlock'>" + this.settingsCode + "</div>" +
            "</div>";
    },//getHoverCode

    //getSettingsDialogCode - build settings dialog code
    getSettingsDialogCode: function() {
        return "<div class='dialog' id='" + this.settingsDialogId + "' title='Block Settings'>"  +
            this.settingsDialogCode +
            "</div>";
    },//getSettingsDialogCode

    //showHideEmptyCode - check if elemToAddCode is empty and add or delete emptyIconCode
    showHideEmptyCode: function (elemToAddCode){
        var block = this;
        if( jQuery.trim(elemToAddCode.html()) === "" || elemToAddCode.html() === emptyIconCode){
            elemToAddCode.append(emptyIconCode);
        } else {
            elemToAddCode.find("#dndIcon").remove();
        }
    }//showHideEmptyCode
}//blockMethods