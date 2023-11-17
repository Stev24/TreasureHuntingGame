
export default class GameObject {
    #position
    sprite
    height
    width
    vy = 0;
    vx = 0;

    constructor(sprite) {
        this.sprite = sprite;
        this.#position = sprite.position;
        this.height = sprite.height;
        this.width = sprite.width;
    }

    get position() {
        return this.#position;
    }

    update() {}
}