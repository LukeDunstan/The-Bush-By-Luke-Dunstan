
var items = { 
    "axe": {"src" : "../Images/old-rust-dirty-dark-gray-ax-with-brown-wooden-handle-isolated-with-clipping-path-in-format-png.png"},
    "mobile" : {"src" : "../Images/mobile.png"},
};
// initialise drag and drop functionality for items and inventory
function initDragDrop() {
    $(".item").draggable({
        helper: "original",
        revert: function(){
            if (this.parent() == $(".inventory-slot")){
                this.addClass("in-inventory");
            }
            return true;
        },
        
        start: function (e, ui) {
            $("#" + e.currentTarget.id).removeClass("in-inventory")
            console.log(e.currentTarget)
            if ($("#" + e.currentTarget.id).parent().attr("class").includes("inventory-slot")){
                localStorage.removeItem($("#" + e.currentTarget.id).parent().attr("id") + "-item");
            }
        }
    })

    $(".inventory-slot").droppable({
        accept: ".item",
        drop: function (e, ui) {
            console.log(e.target.id)
            ui.draggable.appendTo($(e.target))
            ui.draggable.addClass("in-inventory");
            localStorage.setItem(e.target.id + "-item", ui.draggable[0].id);
            console.log(ui.draggable[0].id)

        }
    })
    console.log('dragdrop initialised')
}

//check slots for item data
function checkSlots(){
    for (var i=1; i<=4; i++){
        var localItem = localStorage.getItem("slot" + i + "-item")
        console.log(localItem)
    if (localItem != "undefined" && localItem != null) {
        $("#slot" + i).append("<img class='item in-inventory' id= " + localItem + " src= " + items[localItem].src + ">" );
    }
}
}