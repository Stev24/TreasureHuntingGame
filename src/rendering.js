
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(512, 512);

var Sprite = PIXI.Sprite;
var Container = PIXI.Container;
var Text = PIXI.Text;

function loadResources (spriteSheetPath, onReady) {

    PIXI.Assets.load(spriteSheetPath).then(onReady);
}

function createText (message, style) {
    return new Text(
        message,
        style,
    );
}

function createSprite (spriteImage) {
    return Sprite.from(spriteImage);
}

function createContainer () {
    return new Container();
}

function createRectangle (color, arrayOfSize) {
    var x = new PIXI.Graphics();
    x.beginFill(color);
    x.drawRect.apply(x, arrayOfSize);
    x.endFill();
    return x;
}


export {
    stage,
    renderer,
    createSprite,
    createContainer,
    createText,
    loadResources,
    createRectangle
};