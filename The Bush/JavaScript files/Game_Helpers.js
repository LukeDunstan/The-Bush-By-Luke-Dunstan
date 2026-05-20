
// define in-game items and where their images are located
var items = {
    "axe": { "src": "../Images/old-rust-dirty-dark-gray-ax-with-brown-wooden-handle-isolated-with-clipping-path-in-format-png.png" },
    "phone": { "src": "../Images/phone.png" },
    "car-battery": { "src": "needed" },
};

var backLocations = {
    "Car" : "../Locations/Clearing.html",
    "Outside-Hut" : "../Locations/Clearing.html",
    "Inside-Hut" : "../Locations/Outside Hut.html",
    "Behind-Desk" : "../Locations/Inide Hut.html",
}

function init() {
    InitCommonElements();
    // InitCommonEventListeners();
    checkSlots();
    initDragDrop();
}

//initialise common html elements
function InitCommonElements(){
    $("#backdrop").append(
        "<div class='inventory ui ui1'> \
            <div class='inventory-slot' id='slot1'> </div> \
            <div class='inventory-slot' id='slot2'> </div> \
            <div class='inventory-slot' id='slot3'> </div> \
            <div class='inventory-slot' id='slot4'> </div> \
        </div> \
        <div class='dialogue ui ui2'> \
            <h2 class=speaker-heading></h2> \
            <p class='continue'> Click to continue </p> \
            <p class='dialogue-text'></p> \
        </div> \
        <figure class='ui ui1' id='back-button-fig'> <img class='clickable' id='back-button' \
                src='../Images/power-button.png'> </figure>"
    );

    $(".dialogue").hide();
}

//initialise event listeners that are common between scenes
function InitCommonEventListeners(){
    var title = $(document).title;
    var location = backLocations.Car;
    if(location == null) {
        $("#back-button").hide();
    } else{
        $("#back-button").on("click", function () {window.location.href = location})
    }
    
}


// initialise drag and drop functionality for items and inventory
function initDragDrop() {
    $(".item").draggable({
        // helper: "original",
        revert: function () {
            console.log(this[0].id)
            if (this.parent()[0].className.includes("inventory-slot")) {
                this.addClass("in-inventory");
                localStorage.setItem(this.parent()[0].id + "-item", this[0].id);
            }
            return true;
        },

        start: function (e, ui) {
            $("#" + e.currentTarget.id).removeClass("in-inventory");
            var target = $("#" + e.currentTarget.id).parent().attr("class");
            // console.log($("#" + e.currentTarget.id).parent);
            if (target != undefined && target.includes("inventory-slot")) {
                localStorage.removeItem($("#" + e.currentTarget.id).parent().attr("id") + "-item");
            }
        }
    })

    $(".inventory-slot").droppable({
        accept: ".item",
        drop: function (e, ui) {
            // console.log(e.target.id)
            ui.draggable.appendTo($(e.target))
            ui.draggable.addClass("in-inventory");
            // localStorage.setItem(e.target.id + "-item", ui.draggable[0].id);
            // console.log(ui.draggable[0].id)

        }
    })
    console.log('dragdrop initialised')
}

//check slots for item data
function checkSlots() {
    var foundItems = [];
    var localItem;
    for (var i = 1; i <= 4; i++) {
        localItem = localStorage.getItem("slot" + i + "-item");
        if (localItem != "undefined" && localItem != null && !foundItems.includes(localItem)) {
            foundItems.push(localItem);
            $("#" + localItem).remove();
            $("#slot" + i).append("<img class='item in-inventory' id= " + localItem + " src= " + items[localItem].src + ">");
        } else if (foundItems.includes(localItem)) {
            localStorage.removeItem("slot" + i + "-item");
        }

    }
}

function SearchSlots(itemToSearchFor) {
    var itemsInInventory
    for (var i = 1; i <= 4; i++) {
        localItem = localStorage.getItem("slot" + i + "-item");
        if (localItem != "undefined" && localItem != null && localItem == itemToSearchFor) {
            return true
        }
    }
    return false


}

function insertDialogue(dialogueString, speakerName, href) {
    $(".ui1").hide();
    $(".dialogue").show();
    $(".speaker-heading").text(speakerName);
    $(".dialogue-text").text(dialogueString);
    $(".dialogue").on(
        "click", function () {
            $(".dialogue").hide();
            if (href != null) {
                window.location.href = href;
            } else {
                $(".ui1").show();
            }
        }
    )
}