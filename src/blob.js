import {contain} from "./game.js";
import GameObject from "./gameObject.js";

// todo: move this to the game state
var containerOptions = {position: {x: 32, y: 32}, width: 480, height: 480};
export default class Blob extends GameObject {

    constructor(sprite) {
        super(sprite);
    }

    update() {
        this.position.y += this.vy;
        var blobHitsWall = contain(this, containerOptions);
        if (blobHitsWall === "top" || blobHitsWall === "bottom") {
            this.vy *= -1; // change direction
        }
    }
}