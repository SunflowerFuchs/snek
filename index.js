class Snake {
    head;
    parts = [];
    apples = [];
    direction = 'u';
    loopId;
    keyListener;

    constructor(head, startLength = 3, appleCounter = 2) {
        this.head = head;
        this.parts.push(head);

        for (let i = 1; i < startLength; i++) {
            this.addPart();
        }

        for (let i = 0; i < appleCounter; i++) {
            this.addApple();
        }
    }

    addPart() {
        let lastPart = this.parts[this.parts.length - 1];
        let div = document.createElement('div');
        div.className = 'part';
        div.style.left = lastPart.offsetLeft + "px";
        div.style.top = lastPart.offsetTop + "px";

        this.parts.push(div);
        this.head.parentNode.appendChild(div);
    }

    addApple() {
        let field = this.head.parentNode;
        let div = document.createElement('div');
        div.className = 'apple';
        div.style.left = (Math.floor(Math.random() * 21) * this.head.offsetWidth) + "px";
        div.style.top = (Math.floor(Math.random() * 21) * this.head.offsetHeight) + "px";

        this.apples.push(div);
        field.appendChild(div);
    }

    eatApple(index) {
        let apple = this.apples.splice(index, 1)[0];
        apple.remove();

        this.addApple();
        this.addPart();
    }

    die() {
        this.head.style.background = 'red';
        this.head.setAttribute('alive', 'false');
        this.endLoop();
    }

    move() {
        // move parts, beginning from last to first, except head
        for (let i = this.parts.length - 1; i > 0; i--) {
            debugger;
            this.parts[i].style.left = this.parts[i - 1].offsetLeft + "px";
            this.parts[i].style.top = this.parts[i - 1].offsetTop + "px";
        }

        // finally, move head
        switch (this.direction) {
            case 'u':
                this.head.style.top = (this.head.offsetTop - this.head.offsetHeight) + "px";
                this.head.style.transform = 'rotate(0deg)';
                break;
            case 'd':
                this.head.style.top = (this.head.offsetTop + this.head.offsetHeight) + "px";
                this.head.style.transform = 'rotate(180deg)';
                break;
            case 'l':
                this.head.style.left = (this.head.offsetLeft - this.head.offsetWidth) + "px";
                this.head.style.transform = 'rotate(270deg)';
                break;
            case 'r':
                this.head.style.left = (this.head.offsetLeft + this.head.offsetWidth) + "px";
                this.head.style.transform = 'rotate(90deg)';
                break;
        }

        this.validatePosition();
    }

    validatePosition() {
        let left = this.head.offsetLeft;
        let right = left + this.head.offsetWidth;
        let top = this.head.offsetTop;
        let bottom = top + this.head.offsetHeight;

        // check boundaries
        if (left < 0 || right > this.head.parentNode.offsetWidth) {
            this.die();
            return;
        } else if (top < 0 || bottom > this.head.parentNode.offsetHeight) {
            this.die();
            return;
        }

        // check if we hit ourselves
        let part;
        for (let i = 1; i < this.parts.length; i++) {
            part = this.parts[i];
            if (left === part.offsetLeft && top === part.offsetTop) {
                this.die();
            }
        }

        // check if we hit ourselves
        let apple;
        for (let i = 0; i < this.apples.length; i++) {
            apple = this.apples[i];
            if (left === apple.offsetLeft && top === apple.offsetTop) {
                this.eatApple(i);
            }
        }
    }

    setDirection(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                if (this.direction === 'd') break;
                this.direction = 'u';
                break;
            case 's':
            case 'ArrowDown':
                if (this.direction === 'u') break;
                this.direction = 'd';
                break;
            case 'a':
            case 'ArrowLeft':
                if (this.direction === 'r') break;
                this.direction = 'l';
                break;
            case 'd':
            case 'ArrowRight':
                if (this.direction === 'l') break;
                this.direction = 'r';
                break;
        }
    }

    registerKeys() {
        if (typeof this.keyListener !== "undefined") {
            console.log('Listener already registered');
            return;
        }

        this.keyListener = this.setDirection.bind(this);
        document.addEventListener("keydown", this.keyListener);
    }

    unregisterKeys() {
        if (typeof this.keyListener !== "undefined") {
            document.removeEventListener("keydown", this.keyListener);
            this.keyListener = undefined;
        }
    }

    loop() {
        if (typeof this.loopId !== "undefined") {
            console.log('Loop already running');
            return;
        }

        this.loopId = setInterval(this.move.bind(this), 500);
        this.registerKeys();
    }

    endLoop() {
        if (typeof this.loopId !== "undefined") {
            clearInterval(this.loopId);
            this.loopId = undefined;
            this.unregisterKeys();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let heads = document.getElementsByClassName('head');
    for (let i = 0; i < heads.length; i++) {
        (new Snake(heads[i])).loop();
    }
});