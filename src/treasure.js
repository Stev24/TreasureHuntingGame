import GameObject from "./gameObject.js";

export default class Treasure extends GameObject {
    objectToStick

    constructor(sprite) {
        super(sprite);
    }

    update() {
        if (this.objectToStick) {
            this.position.x = this.objectToStick.position.x + 8;
            this.position.y = this.objectToStick.position.y + 8;
        }
    }

    stickTo(objectToStick) {
        this.objectToStick = objectToStick;
    }
}