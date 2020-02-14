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
        this.isDraggable = false;

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
    get globalPosition2D() {
        return {
            "x": this.gx,
            "y": this.gy
        };
    }
    get globalPosition3D() {
        return {
            "x": this.gx,
            "y": this.gy,
            "z": this.gz
        };
    }
    get globalPosition() {
        return this.globalPosition2D;
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
    setPosition2D(x, y) {
        this.x = x;
        this.y = y;
    }
    setPosition3D(x, y, z) {
        this.setPosition2D(x, y);
        this.z = z;
    }
    setPosition(x, y) {
        this.setPosition2D(x, y);
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
    // get global size
    get globalSize2D() {
        let size = this.size2D;
        size["width"] = this.gx + size["width"];
        size["height"] = this.gy + size["height"];
        return size;
    }
    get globalSize3D() {
        let size = this.size3D;
        size["width"] = this.gx + size["width"];
        size["height"] = this.gy + size["height"];
        size["depth"] = this.gz + size["depth"];
        return size;
    }
    get globalSize() {
        return this.globalSize2D;
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
    get globalBounds2D() {
        let pos = this.globalPosition2D;
        let size = this.globalSize2D;
        return { ...pos,
            ...size
        };
    }
    get globalBounds3D() {
        let pos = this.globalPosition3D;
        let size = this.globalSize3D;
        return { ...pos,
            ...size
        };
    }
    get globalBounds() {
        return this.globalBounds2D;
    }

    // get layer of the object
    get layer() {
        return this._layer;
    }
    setLayer(val) {
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
    // convenience functions
    get isEmpty() {
        // is sprite empty
        if (this.children.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    // put method inside outside or around sprite
    putCenter2D(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at center
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
    }
    putCenter3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        // put asprite at center
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
        asprite.z = this.z + this.halfDepth - asprite.halfDepth + zOffset;
    }
    putCenter(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at center
        putCenter2D(asprite, xOffset, yOffset);
    }
    putTop2D(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at top
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y - asprite.halfHeight + yOffset;
    }
    putTop3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        // put asprite at top
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y - asprite.halfHeight + yOffset;
        asprite.z = this.z + this.halfDepth - asprite.halfDepth + zOffset;
    }
    putTop(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at top
        putTop2D(asprite, xOffset, yOffset);
    }
    putRight2D(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at right
        asprite.x = this.x + this.width + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
    }
    putRight3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        // put asprite at right
        asprite.x = this.x + this.width + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
        asprite.z = this.z + this.halfDepth - asprite.halfDepth + zOffset;
    }
    putRight(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at right
        putRight2D(asprite, xOffset, yOffset);
    }
    putBottom2D(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at bottom
        asprite.x = this.x + this.width - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.height + yOffset;
    }
    putBottom3D(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at bottom
        asprite.x = this.x + this.width - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.height + yOffset;
        asprite.z = this.z + this.halfDepth - asprite.halfDepth + zOffset;
    }
    putBottom(asprite, xOffset = 0, yOffset = 0) {
        // put asprite at bottom
        putBottom2D(asprite, xOffset, yOffset);
    }
    putLeft2D(asprite, xOffset = 0, yOffset = 0) {
        asprite.x = this.x - asprite.width + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
    }
    putLeft3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        asprite.x = this.x - asprite.width + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
        asprite.z = this.z + this.halfDepth - asprite.halfDepth + zOffset;
    }
    putLeft(asprite, xOffset = 0, yOffset = 0) {
        putLeft2D(asprite, xOffset, yOffset);
    }
    putFront3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
        asprite.z = this.z + this.halfDepth + zOffset;
    }
    putBack3D(asprite, xOffset = 0, yOffset = 0, zOffset = 0) {
        asprite.x = this.x + this.halfWidth - asprite.halfWidth + xOffset;
        asprite.y = this.y + this.halfHeight - asprite.halfHeight + yOffset;
        asprite.z = this.z - this.halfDepth + zOffset;
    }

    // swap child positions
    swapChildren(child1, child2) {
        // swap children position using their index value
        var index1 = this.children.indexOf(child1);
        var index2 = this.children.indexOf(child2);
        if (index1 !== -1 && index2 !== -1) {
            // swap index of children
            child1.childIndex = index2;
            child2.childIndex = index1;

            // swap within the array
            this.children[index2] = child1;
            this.children[index1] = child2;
        } else {
            throw new Error(
                `Both objects must be child of caller ${this}`
            );
        }
    }
    add(...sprites) {
        sprites.forEach(sprite => this.addChild(sprite));
    }
    remove(...sprites) {
        sprites.forEach(sprite => this.removeChild(sprite));
    }
    get currentFrame() {
        return this._currentFrame;
    }
    get draggable() {
        return this.isDraggable;
    }
    // for circular sprites
    get circular() {
        return this.isCircular;
    }
    setCircular(val) {
        if (val === false && this.isCircular === true) {
            // if this is not circular it should not have diameter and radius
            delete this.diameter;
            delete this.radius;
            this.isCircular = false;
        }
        if (val === true && this.isCircular === false) {
            Object.defineProperties(this, {
                diameter: {
                    get() {
                        return this.width;
                    },
                    set(value) {
                        this.height = value;
                        this.width = value;
                    },
                    enumerable: true,
                    configurable: true
                },
                radius: {
                    get() {
                        return this.halfWidth;
                    },
                    set(value) {
                        this.width = value * 2;
                        this.height = value * 2
                    },
                    enumerable: true,
                    configurable: true
                }
            });
            this.isCircular = true;
        }
    }
}
