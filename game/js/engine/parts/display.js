/*
Author: Kaan Eraslan
License: see, LICENSE

Display object method for sprites
 */
class DisplayObject {
    /*Base class for making displayable objects called sprites*/
    constructor() {
        // sprite position and size
        this.x = 0;
        this.y = 0;
        this.z = 0; // optional for 3d
        this.width = 0;
        this.height = 0;
        this.depth = 0; // optional for 3d

        // rotation, alpha visible and scale properties
        this.rotation = 0; // degrees
        this.alpha = 1; // alpha value for blending
        this.isVisible = true; // object visible or not
        this.scaleX = 1.0; // scale in X axis
        this.scaleY = 1.0; // scale in Y axis
        this.scaleZ = 1.0; // scale in Z axis optional for 3D

        // sprite's rotation axis
        this.pivotX = 0.5;
        this.pivotY = 0.5;
        this.pivotZ = 0.5; // optional for 3D

        // velocity for movement
        this.vx = 0.0; // velocity in x axis
        this.vy = 0.0; // velocity in y axis
        this.vz = 0.0; // velocity in z axis

        // layer of the object
        this._layer = 0; //

        // children if the sprite is parent and contains
        // children
        this.children = [];

        // point to sprite parent
        this.parent = undefined;

        // we want to display a shadow for the sprite or not
        this.isShadow = false;
        this.shadowColor = {
            "r": 100,
            "g": 100,
            "b": 100,
            "a": 0.5
        };
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 3;
        this.shadowOffsetZ = 3;
        this.shadowBlur = 3;

        // do we want the object to blend 
        this.blendMode = undefined;

        // for advanced features

        // Image states and animation
        this.frames = [];
        this.isLoop = true;
        this._currentFrame = 0;
        this.isPlaying = false;

        // can we drag the sprite
        this.draggable = false;

        // object circular or not
        this.isCircular = false;

        // is object interactive
        this.isInteractive = false;
    }
    /* Essential methods for working with all kinds of sprites */
    // global position
    gAxisPos(axisName) {
        if (this.parent) {
            return this[axisName] + this.parent[axisName];
        } else {
            return this[axisName];
        }
    }
    get gx() {
        return this.gAxisPos("x");
    }
    get gy() {
        return this.gAxisPos("y");
    }
    get gz() {
        return this.gAxisPos("z");
    }
    // local position
    get position2D() {
        return {
            "x": this.x,
            "y": this.y
        };
    }
    get position3D() {
        let pos = this.position2D;
        pos["z"] = this.z;
        return pos;
    }
    get position() {
        // should be change for 3d games
        return this.position2D;
    }
    // size of the object
    get size2D() {
        return {
            width: this.width,
            height: this.height
        };
    }
    get size3D() {
        let size = this.size2D;
        size["depth"] = this.depth;
        return size
    }
    get currentSize() {
        return this.size2D; // change for 3d
    }
    // get bounds of the object
    get localBounds2D() {
        let pos = this.position2D;
        let size = this.size2D;
        return { ...pos,
            ...size
        }; // using spread properties
    }
    get localBounds3D() {
        let pos = this.position3D;
        let size = this.size3D;
        return { ...pos,
            ...size
        };
    }
    get localBounds() {
        return this.localBounds2D;
    }
    get globalBounds2D() {}
    get globalBounds3D() {}
    get globalBounds() {}

    // get layer of the object
    get layer() {
        return this._layer;
    }
    set layer(val) {
        // assing a layer value to object
        this._layer = val;
        // sort parent with respect to layers
        if (this.parent) {
            this.parent.children.sort((a, b) => a.layer - b.layer);
        }
    }
    // add children to this sprite
    addChild(sprite) {
        // if sprite has an associated parent
        if (sprite.parent) {
            // remove sprite from its parent
            sprite.parent.removeChild(sprite);
        }
        sprite.parent = this;
        this.children.push(sprite);
    }
    removeChild(sprite) {
        // remove child from sprite
        // if the parent is indeed this sprite
        if (sprite.parent === this) {
            this.children.splice(this.children.indexOf(sprite), 1);
        } else {
            // the argument is not the child of current sprite
            // so we shall throw an error
            throw new Error(sprite + " is not child of " + this);
        }
    }
    // some useful points about this sprite
    halfSize(axName) {
        var aval;
        if (axName === "x") {
            aval = this.width;
        } else if (axName === "y") {
            aval = this.height;
        } else if (axName === "z") {
            aval = this.depth;
        } else {
            throw new Error(
                "Axis name: " + axName + "is unknown. Please use either x, y z"
            );
        }
        return aval / 2;
    }
    get halfWidth() {
        return this.halfSize("x");
    }
    get halfHeight() {
        return this.halfSize("y");
    }
    get halfDepth() {
        return this.halfSize("z");
    }
    centerAxis(axName) {
        return this[axName] + this.halfSize(axName);
    }
    get centerX() {
        return centerAxis("x");
    }
    get centerY() {
        return centerAxis("y");
    }
    get centerZ() {
        return centerAxis("z");
    }

}
