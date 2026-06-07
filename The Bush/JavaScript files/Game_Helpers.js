
// define in-game items and where their images are located
var items = {
    "axe": { "src": "../Images/old-rust-dirty-dark-gray-ax-with-brown-wooden-handle-isolated-with-clipping-path-in-format-png.png" },
    "phone": { "src": "../Images/phone.png" },
    "car-battery": { "src": "../Images/car-battery.png" },
};

var backLocations = {
    "Car" : "../Locations/Clearing.html",
    "Outside-Hut" : "../Locations/Clearing.html",
    "Inside-Hut" : "../Locations/Outside Hut.html",
    "Behind-Desk" : "../Locations/Inide Hut.html",
}

var fontInterval;
var lastLocation;
function init() {
    lastLocation = localStorage.getItem("currentLocation")
    if (lastLocation != null){
        localStorage.setItem("lastLocation", lastLocation)
    }
    localStorage.setItem("currentLocation", window.location.href);
    clearInterval(fontInterval)
    InitCommonElements();
    // InitCommonEventListeners();
    checkSlots();
    initDragDrop();
    fontInterval = setInterval(FontSizeControl, 100);
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
                src='../Images/Back.png'> </figure>"
    );

    $(".dialogue").hide();
}

function InitDialogueBox() {
    $("#backdrop").append(
        "<div class='dialogue ui ui2'> \
            <h2 class=speaker-heading></h2> \
            <p class='continue'> Click to continue </p> \
            <p class='dialogue-text'></p> \
        </div> \
        <figure class='ui ui1' id='back-button-fig'> <img class='clickable' id='back-button' \
                src='../Images/Back.png'> </figure>"
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
        console.log(localItem)
        if (localItem != "undefined" && localItem != null && localItem != "null" && !foundItems.includes(localItem)) {
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

function RemoveFromInventory(ItemToRemove){
    var itemsInInventory
    for (var i = 1; i <= 4; i++) {
        localItem = localStorage.getItem("slot" + i + "-item");
        if (localItem != "undefined" && localItem != null && localItem == ItemToRemove) {
            $("#" + ItemToRemove).remove();
            localStorage.setItem("slot" + i + "-item", null);
            return true
        }
    }
    return null
}

function CheckIfTrueInStorage(ItemToCheck){
    var checkItem = localStorage.getItem(ItemToCheck);
    if (checkItem != null && checkItem == true){
        return true;
    } else {
        return false;
    }
}

function insertDialogue(dialogueString, speakerName, href) {
    $(".ui1").hide();
    $(".dialogue").show();
    $(".speaker-heading").text(speakerName);
    $(".dialogue-text").text(dialogueString);
    $(".dialogue").one(
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

function insertNarration(dialogueString, href) {
    $(".ui1").hide();
    $(".speaker-heading").hide();
    $(".dialogue").show();
    $(".dialogue-text").text(dialogueString);
    $(".dialogue").one(
        "click", function () {
            $(".speaker-heading").show();
            $(".dialogue").hide();
            if (href != null) {
                window.location.href = href;
            } else {
                $(".ui1").show();

            }
        }
    )
}

//A function to control the font size based on the size of the #backdrop element
function FontSizeControl(){
        if (Number($("#backdrop").css("width").substring(0, $("#backdrop").css("width").length-2)) < 800) {
            $("p").css("font-size", "x-small");
            $("h2").css("font-size", "small");
        } else {
            $("p").css("font-size", "small");
            $("h2").css("font-size", "medium");
        }
}