import {updateState, initGame, initSprites, healthBarInit, initControl, randomInt} from "./game.js";
import {
    stage,
    renderer,
    loadResources,
    createContainer,
    createText,
    createSprite,
    createRectangle
} from "./rendering.js";
import Blob from "./blob.js";
import Treasure from "./treasure.js";
import Door from "./Door.js";

var root = document.getElementById('root');
root.appendChild(renderer.view);

loadResources('./img/atlas/treasureHunter.json',setup);

function setup() {
    const gameScene = createContainer();
    stage.addChild(gameScene);

    const gameOverScene = createContainer();
    stage.addChild(gameOverScene);

    const messageText = createText("The End!",
        {fontFamily: "Futura", fontSize: "64px", fill: "white"});
    messageText.x = 120;
    messageText.y = stage.height / 2 - 32;

    gameOverScene.addChild(messageText);
    gameOverScene.visible = false;

    initGame({gameScene, gameOverScene, messageText});

    const dungeonSprite = createSprite('dungeon.png');
    gameScene.addChild(dungeonSprite);

    const explorerSprite = createSprite('explorer.png')
    gameScene.addChild(explorerSprite);
    explorerSprite.position.set(68, stage.height / 2 - explorerSprite.height / 2);

    const treasure = new Treasure(createSprite('treasure.png'));
    treasure.position.set(stage.width - treasure.width - 48, stage.height / 2 - treasure.height / 2);
    gameScene.addChild(treasure.sprite);

    const door = new Door(createSprite('door.png'));
    door.position.set(32, 0);
    gameScene.addChild(door.sprite);

    var blobsNumber = 6,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1,
        blobsSprite = [];

    for (var i = 0; i < blobsNumber; i++) {
        // var blob = createSprite('blob.png')
        const blob = new Blob(createSprite('blob.png'));

        blob.position.set(
            spacing * i + xOffset,
            randomInt(0, stage.height - blob.height)
        );
        blob.vy = speed * direction;
        direction *= -1;

        blobsSprite.push(blob);
        gameScene.addChild(blob.sprite);
    }

    initSprites({dungeonSprite, explorerSprite, treasureSprite: treasure, doorSprite: door, blobsSprite})

    const healthBarContainer = createContainer();
    healthBarContainer.position.set(stage.width - 170, 3);
    gameScene.addChild(healthBarContainer);

    const size = [0, 0, 128, 8];

    const innerBar = createRectangle(0x000000, size);
    healthBarContainer.addChild(innerBar);

    const outerBar = createRectangle(0xFF3300, size);
    healthBarContainer.addChild(outerBar);
    healthBarContainer.outer = outerBar;

    healthBarInit(healthBarContainer);

    initControl();

    onFrame();
}


function onFrame() {
    requestAnimationFrame(onFrame);
    updateState();
    renderer.render(stage);
}


