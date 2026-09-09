
//initialise sounds
var Sounds = {
    lowIntensityMusic: "../Sounds/BackTrack.wav",
    highIntensityMusic: "../Sounds/higher intensity backtrack.mp3",
    carDoor: "../Sounds/Car Door.wav",
    chop: "../Sounds/Chop.mp3",
    cody: "../Sounds/codyFound.wav",
    doorCreak: "../Sounds/door creak.wav",
    doorRattle: "../Sounds/door rattle.wav",
    fall: "../Sounds/fall.wav",
    gunCock: "../Sounds/gun cock.wav",
    gunshot: "../Sounds/gunshot.wav",
    headSlice: "../Sounds/head slice.wav",
    lockerDoor: "../Sounds/locker door.mp3",
    paperRustle: "../Sounds/paper rustle.wav",
    stickBreak: "../Sounds/stick break.mp3",
    lowBattery: "../Sounds/low-battery.mp3",
    phoneTone: "../Sounds/phoneTone.mp3",
    pullAway: "../Sounds/pull-away.mp3",
    carStart: "../Sounds/car-start-up.mp3"
}

//portrait images
var portraits = {
    Josef: "../Images/josef.png",
    Ranger: "../Images/Ranger.png",
    Killer: "../Images/killer.png",
    Cody: "../Images/cody.png",
    undefined: "../Images/undefined.png"
}

// define in-game items and where their images are located
var items = {
    "axe": { "src": "../Images/axe.png" },
    "phone": { "src": "../Images/phone.png" },
    "car-battery": { "src": "../Images/car-battery.png" },
};


var backLocations = {
    "Car": "../Locations/Clearing.html",
    "Outside-Hut": "../Locations/Clearing.html",
    "Inside-Hut": "../Locations/Outside Hut.html",
    "Behind-Desk": "../Locations/Inide Hut.html",
}

var fontInterval;
var lastLocation;
function init() {
    lastLocation = localStorage.getItem("currentLocation");
    localStorage.setItem("currentLocation", window.location.href);
    clearInterval(fontInterval)
    InitCommonElements();
    initMusic();
    checkSlots();
    initDragDrop();
    fontInterval = setInterval(FontSizeControl, 100);
}

//initialise common html elements
function InitCommonElements() {
    $("#backdrop").append(
        "<div class='inventory ui ui1'> \
            <div class='inventory-slot' id='slot1'> </div> \
            <div class='inventory-slot' id='slot2'> </div> \
            <div class='inventory-slot' id='slot3'> </div> \
            <div class='inventory-slot' id='slot4'> </div> \
        </div> \
        <div class='dialogue ui ui2'> \
            <figure id= 'portrait'> <img class='portrait-img' src='undefined' > </figure>\
            <h2 class=speaker-heading></h2> \
            <p class='continue'> Click to continue </p> \
            <p class='dialogue-text'></p> \
        </div> \
        <figure class='ui ui1' id='back-button-fig'> <img class='clickable' id='back-button' \
                src='../Images/Back.png'> </figure>"
    );

    $(".dialogue").hide();
}

function CheckIfFirstTime() {
    if (localStorage.getItem("firstTimeAt" + window.location.href)) {
        return false;
    } else {
        localStorage.setItem("firstTimeAt" + window.location.href, true);
        return true;
    }
}

function InitDialogueBox() {
    initMusic();
    $("#backdrop").append(
        "<div class='dialogue ui ui2'> \
        <figure id= 'portrait'> <img class='portrait-img' src='undefined' ></figure>\
            <h2 class=speaker-heading></h2> \
            <p class='continue'> Click to continue </p> \
            <p class='dialogue-text'></p> \
        </div>"
    );

    $(".dialogue").hide();
}

//initialise event listeners that are common between scenes
function InitCommonEventListeners() {
    var title = $(document).title;
    var location = backLocations.Car;
    if (location == null) {
        $("#back-button").hide();
    } else {
        $("#back-button").on("click", function () { window.location.href = location })
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
            if (target != undefined && target.includes("inventory-slot")) {
                localStorage.removeItem($("#" + e.currentTarget.id).parent().attr("id") + "-item");
            }
        }
    })

    $(".inventory-slot").droppable({
        accept: ".item",
        drop: function (e, ui) {
            ui.draggable.appendTo($(e.target))
            ui.draggable.addClass("in-inventory");

        }
    })
    console.log('dragdrop initialised')
}

//setup background music of scene based on game events
function initMusic() {
    if (localStorage.getItem("killerComing")) {
        var music = new Audio(Sounds.highIntensityMusic);
    } else {
        var music = new Audio(Sounds.lowIntensityMusic);
    }

    music.play();
    music.loop = true;
    music.volume = 0.25;
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

//search inventory for item
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

// remove item from inventory
function RemoveFromInventory(ItemToRemove) {
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

function CheckIfTrueInStorage(ItemToCheck) {
    var checkItem = localStorage.getItem(ItemToCheck);
    if (checkItem != null && checkItem == true) {
        return true;
    } else {
        return false;
    }
}

//insert a line of dialogue for a given text, speaker, and location to transition to after click
function insertDialogue(dialogueString, speakerName, href) {
    $(".ui1").hide();
    $(".dialogue").show();
    console.log(portraits[speakerName])
    $(".portrait-img").attr("src", portraits[speakerName])
    $(".portrait-img").show();

    if (portraits[speakerName] == undefined) {
        $(".portrait-img").hide();
    }
    $(".speaker-heading").text(speakerName);
    $(".dialogue-text").text(dialogueString);
    $(".dialogue").one(
        "click", function () {
            $(".dialogue").hide();
            $(".portrait-img").hide();
            if (href != null && href != undefined) {
                window.location.href = href;
            } else {
                $(".ui1").show();
            }
        }
    )
}

//Idea taken from unity method Time.deltaTime to synchronise timestep across browsers 
// as I was having trouble when switching between firefox and safari on my PC and macbook respectively.
var lastTime;
var deltaTime;
function GetTimeBetweenIntervals() {
    deltaTime = (Date.now() / 1000) - lastTime;
    lastTime = Date.now() / 1000;
    if (deltaTime < 1 && deltaTime > 0) {
        return deltaTime;
    } else {
        return 0;
    }
    console.log("dateNow: " + Date.now())
}

//insert a line of narration for a given text, and location to transition to after click
function insertNarration(dialogueString, href) {
    $(".ui1").hide();
    $(".speaker-heading").hide();
    $(".portrait-img").hide();
    $(".dialogue").show();
    $(".dialogue-text").text(dialogueString);
    $(".dialogue").one(
        "click", function () {
            $(".speaker-heading").show();
            $(".portrait-img").show();
            $(".dialogue").hide();
            if (href != null && href != undefined && href != "undefined") {
                window.location.href = href;
            } else {
                $(".ui1").show();

            }
        }
    )
}

//A function to control the font size based on the size of the #backdrop element
function FontSizeControl() {
    if (Number($("#backdrop").css("width").substring(0, $("#backdrop").css("width").length - 2)) < 800) {
        $("p").css("font-size", "x-small");
        $("h2").css("font-size", "small");
    } else {
        $("p").css("font-size", "small");
        $("h2").css("font-size", "medium");
    }
}