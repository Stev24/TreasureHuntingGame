
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    //hit will determine whether there's a collision
    hit = false;
    //Find the center points of each sprite
    r1.centerX = r1.position.x + r1.width / 2;
    r1.centerY = r1.position.y + r1.height / 2;
    r2.centerX = r2.position.x + r2.width / 2;
    r2.centerY = r2.position.y + r2.height / 2;
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        } else {
            //There's no collision on the y axis
            hit = false;
        }
    } else {
        //There's no collision on the x axis
        hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
};

// to contain the player inside the room
function contain(sprite, container) {
    var  collision = undefined;

    if(sprite.position.x < container.position.x) {
        sprite.position.x = container.position.x;
        collision = "left";
    }

    if(sprite.position.x + sprite.width > container.width) {
        sprite.position.x = container.width - sprite.width;
        collision = "right";
    }

    if(sprite.position.y < container.position.y) {
        sprite.position.y = container.position.y;
        collision = "top";
    }
    // sprite.y + sprite.height - нижний край спрайта
    if(sprite.position.y + sprite.height > container.height) {
        sprite.position.y = container.height - sprite.height;
        collision = "bottom";
    }
    return collision;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = function(event) {
        if(event.keyCode === key.code) {
            if(key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key),false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

let state;

var dungeon,
    explorer,
    treasure,
    door,
    healthBar,
    gameScene,
    gameOverScene,
    message,
    isTreasureTaken = false,
    blobs = [];

function playState() {
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;
    var explorerHit = false;
    var containerOptions = {position: {x: 32, y: 32}, width: 480, height: 480};
    contain(explorer, containerOptions);

    blobs.forEach(function (blob) {
        blob.update();

        // todo: extract to collision detection
        if (hitTestRectangle(explorer, blob)) {
            explorerHit = true;
        }
    });
    if (explorerHit) {
        explorer.alpha = 0.5;

        if (healthBar.outer.width === 0) {
            healthBar.outer.width = 0
        } else {
            healthBar.outer.width -= 1;
        }
    } else {
        explorer.alpha = 1;
    }

    if (door.position.y + door.height === explorer.y && door.position.x === explorer.x) {
        if (isTreasureTaken) {
            state = endState;
            message.text = "You won!";
        } else {
            explorer.y = door.height;
        }

    }

    if (hitTestRectangle(explorer, treasure)) {
        treasure.stickTo(explorer);
        isTreasureTaken = true;
    }

    treasure.update();

    if (healthBar.outer.width === 0) {
        state = endState;
        message.text = "You lose!"
    }
}

function endState() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}

function updateState() {
    state();
}

function initGame (params) {
    state = playState;

    const {gameScene: scene, gameOverScene: gameOver, messageText} = params;
    gameScene = scene;
    gameOverScene = gameOver;
    message = messageText;
}

function initSprites({dungeonSprite, explorerSprite, treasureSprite, doorSprite, blobsSprite}) {
    dungeon = dungeonSprite;
    explorer = explorerSprite;
    treasure = treasureSprite
    door = doorSprite

    explorer.vx = 0;
    explorer.vy = 0;

    blobs = blobsSprite;
}

function healthBarInit(healthBarContainer) {
   healthBar = healthBarContainer;
}

function initControl() {
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = function () {
        explorer.vx = -5;
        explorer.vy = 0;
    };
    left.release = function () {
        if (!right.isDown && explorer.vy === 0) explorer.vx = 0;
    }

    right.press = function () {
        explorer.vx = 5;
        explorer.vy = 0;
    };
    right.release = function () {
        if (!left.isDown && explorer.vy === 0) explorer.vx = 0;
    };

    up.press = function () {
        explorer.vy = -5;
        explorer.vx = 0;
    };
    up.release = function () {
        if (!down.isDown && explorer.vx === 0) explorer.vy = 0;
    };

    down.press = function () {
        explorer.vy = 5;
        explorer.vx = 0;
    };
    down.release = function () {
        if (!up.isDown && explorer.vx === 0) explorer.vy = 0;
    };
}

export {
    randomInt,
    hitTestRectangle,
    contain,
    keyboard,
    updateState,
    initGame,
    initSprites,
    healthBarInit,
    initControl
};