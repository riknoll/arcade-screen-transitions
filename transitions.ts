namespace screenTransitions {
    let renderBackground: Image;
    let mask: Image;
    let maskShades: Buffer;

    export class State {
        swapRenderable: scene.Renderable;
        renderRenderable: scene.Renderable;
        isStatic: boolean;
        swapDirection: boolean;

        // This is used by the start transition api
        transitionId: number;

        protected transition: Transition;
        constructor() {
            if (!renderBackground) renderBackground = image.create(screen.width, screen.height);

            game.currentScene().eventContext.registerFrameHandler(scene.RENDER_BACKGROUND_PRIORITY - 1, () => {
                this.preRender();
            })

            this.swapRenderable = scene.createRenderable(1000, () => {
                this.swapScreens();
            })

            this.renderRenderable = scene.createRenderable(2000, () => {
                this.postRender()
            })

            this.transitionId = 0;
            this.swapDirection = false;
        }

        setZ(cutoffZ: number, renderZ: number) {
            this.swapRenderable.z = cutoffZ;
            this.renderRenderable.z = renderZ;
        }

        clear() {
            mask = undefined;
            maskShades = undefined;
            renderBackground = undefined;
            this.transition = undefined;
        }

        start(transition: Transition) {
            this.transition = transition;
            if (!renderBackground) {
                renderBackground = image.create(screen.width, screen.height);
            }
        }

        protected preRender() {
            if (this.transition && !this.isStatic) {
                this.transition.update(game.currentScene().eventContext.deltaTime);
            }
        }

        protected swapScreens() {
            if (this.transition) {
                renderBackground.drawImage(screen, 0, 0);
                screen.fill(0);
            }
        }

        protected postRender() {
            if (this.transition) {
                if (this.swapDirection) {
                    this.transition.draw(renderBackground, screen);
                    screen.drawImage(renderBackground, 0, 0);
                }
                else {
                    this.transition.draw(screen, renderBackground);
                }
            }
        }
    }

    //% fixedInstances
    export class Transition {
        percent: number;
        progress: number;
        maxProgress: number;
        speed: number;
        reverse: boolean;

        constructor() {
            this.percent = 0;
            this.progress = 0;
            this.maxProgress = screen.width;
            this.speed = 100;
            this.reverse = false;
        }

        start(speed: number, reverse: boolean) {
            this.progress = 0;
            this.percent = 0;
            this.speed = speed;
            this.reverse = reverse
            _state().start(this);
            _state().isStatic = false;
        }

        showAtPercent(percent: number, reverse: boolean) {
            this.percent = percent;
            this.progress = (this.percent / 100) * this.maxProgress
            this.reverse = reverse
            _state().start(this);
            _state().isStatic = true;
        }

        update(dt: number) {
            this.percent += this.speed * dt;
            if (this.percent > 100) {
                this.percent = 100;
            }

            this.progress = (this.percent / 100) * this.maxProgress
        }

        draw(upperScreen: Image, lowerScreen: Image) {
            if (this.percent === 100) {
                upperScreen.drawImage(lowerScreen, 0, 0)
            }
            else {
                this.drawCore(upperScreen, lowerScreen)
            }
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
        }
    }


    export class LinearTransition extends Transition {
        constructor(maxProgress: number) {
            super();
            this.maxProgress = maxProgress;
        }

        start(speed: number, reverse: boolean) {
            super.start(speed, reverse)
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            copyRect(
                upperScreen,
                lowerScreen,
                this.copyX(),
                this.copyY(),
                this.copyWidth(),
                this.copyHeight()
            )
        }

        protected copyX(): number {
            return 0;
        }

        protected copyY(): number {
            return 0;
        }

        protected copyWidth(): number {
            return screen.width;
        }

        protected copyHeight(): number {
            return screen.width;
        }
    }

    //% fixedInstances
    export class VerticalTransition extends LinearTransition {
        constructor() {
            super(screen.height);
        }

        protected copyY() {
            if (this.reverse) {
                return 0;
            }
            return screen.height - (this.progress | 0);
        }

        protected copyHeight() {
            return this.progress | 0;
        }
    }

    //% fixedInstances
    export class HorizontalTransition extends LinearTransition {
        constructor() {
            super(screen.width);
        }

        start(speed: number, reverse: boolean) {
            super.start(speed, reverse)
        }

        protected copyX() {
            if (this.reverse) {
                return 0;
            }
            return screen.width - (this.progress | 0);
        }

        protected copyWidth() {
            return this.progress | 0;
        }
    }

    //% fixedInstances
    export class VerticalWavyTransition extends VerticalTransition {
        constructor() {
            super();
            this.maxProgress += 10
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            const angle = Math.PI / 60;
            const angle2 = Math.PI / 100;

            let o = Math.idiv(game.runtime(), 5);

            if (this.reverse) {
                for (let x = 0; x < screen.width; x += 4) {
                    const offset = this.copyHeight() + Math.sin(angle * (x + o)) * 10 * Math.sin(angle2 * (x))
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        x,
                        0,
                        4,
                        offset
                    )
                }
            }
            else {
                for (let x = 0; x < screen.width; x += 4) {
                    const offset = this.copyHeight() + Math.sin(angle * (x + o)) * 10 * Math.sin(angle2 * (x))
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        x,
                        screen.height - offset,
                        4,
                        offset + 1
                    )
                }
            }
        }
    }

    //% fixedInstances
    export class HorizontalWavyTransition extends HorizontalTransition {
        constructor() {
            super();
            this.maxProgress += 10
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            const angle = Math.PI / 60;
            const angle2 = Math.PI / 100;

            let o = Math.idiv(game.runtime(), 5);

            if (this.reverse) {
                for (let y = 0; y < screen.height; y += 4) {
                    const offset = this.copyWidth() + Math.sin(angle * (y + o)) * 10 * Math.sin(angle2 * y)
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        0,
                        y,
                        offset,
                        4
                    )
                }
            }
            else {
                for (let y = 0; y < screen.height; y += 4) {
                    const offset = this.copyWidth() + Math.sin(angle * (y + o)) * 10 * Math.sin(angle2 * y)
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        screen.width - offset,
                        y,
                        offset + 1,
                        4
                    )
                }
            }
        }
    }

    //% fixedInstances
    export class DiagonalTransition extends LinearTransition {
        constructor(public bottomLeft: boolean) {
            super(screen.width << 1);
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            let kind = 0;

            if (this.bottomLeft) {
                if (this.reverse) {
                    kind = 1;
                }
                else {
                    kind = 3;
                }
            }
            else if (this.reverse) {
                kind = 2;
            }

            if (kind == 0) {
                for (let y = 0; y < screen.height; y += 2) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        0,
                        y,
                        this.progress - y,
                        2
                    )
                }
            }
            else if (kind == 1) {
                for (let y = 0; y < screen.height; y += 2) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        screen.width - this.progress + y,
                        y,
                        this.progress + y,
                        2
                    )
                }
            }
            else if (kind == 2) {
                for (let y = 0; y < screen.height; y += 2) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        screen.width - this.progress + (screen.height - y),
                        y,
                        this.progress + (screen.height - y),
                        2
                    )
                }
            }
            else if (kind == 3) {
                for (let y = 0; y < screen.height; y += 2) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        0,
                        y,
                        this.progress - (screen.height - y),
                        2
                    )
                }
            }
        }
    }

    //% fixedInstances
    export class CircleTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = Math.ceil(Math.sqrt(Math.pow(screen.width >> 1, 2) + Math.pow(screen.height >> 1, 2)))
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            initMask();
            mask.fill(0);

            if (this.reverse) {
                mask.fillCircle(mask.width >> 1, mask.height >> 1, (this.maxProgress - this.progress) | 0, 1);
                helpers.mapImage(
                    upperScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                lowerScreen.drawTransparentImage(upperScreen, 0, 0);
                upperScreen.drawImage(lowerScreen, 0, 0)
            }
            else {
                mask.fillCircle(mask.width >> 1, mask.height >> 1, this.progress | 0, 1);
                helpers.mapImage(
                    lowerScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                upperScreen.drawTransparentImage(lowerScreen, 0, 0);
            }
        }
    }

    //% fixedInstances
    export class ImageTransition extends Transition {
        constructor(public maskImage: Image) {
            super();
            this.maxProgress = screen.width + 2
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            initMask();
            mask.fill(0);

            if (this.reverse) {
                const width = ((this.maxProgress - this.progress) * 2) | 0;
                mask.blit(
                    (mask.width >> 1) - (width >> 1),
                    (mask.height >> 1) - (width >> 1),
                    width,
                    width,
                    this.maskImage,
                    0,
                    0,
                    this.maskImage.width,
                    this.maskImage.height,
                    false,
                    false
                )
                helpers.mapImage(
                    upperScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                lowerScreen.drawTransparentImage(upperScreen, 0, 0);
                upperScreen.drawImage(lowerScreen, 0, 0)
            }
            else {
                const width = (this.progress * 2) | 0;
                mask.blit(
                    (mask.width >> 1) - (width >> 1),
                    (mask.height >> 1) - (width >> 1),
                    width,
                    width,
                    this.maskImage,
                    0,
                    0,
                    this.maskImage.width,
                    this.maskImage.height,
                    false,
                    false
                )
                helpers.mapImage(
                    lowerScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                upperScreen.drawTransparentImage(lowerScreen, 0, 0);
            }
        }
    }

    //% fixedInstances
    export class VerticalBlindsTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = screen.width >> 3;
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            if (this.reverse) {
                for (let x = 0; x < screen.width; x += this.maxProgress) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        x, 0,
                        this.progress,
                        screen.height
                    )
                }
            }
            else {
                for (let x = 0; x < screen.width; x += this.maxProgress) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        x + this.maxProgress - this.progress, 0,
                        this.progress,
                        screen.height
                    )
                }
            }
        }
    }

    //% fixedInstances
    export class HorizontalBlindsTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = screen.height >> 3;
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            if (this.reverse) {
                for (let y = 0; y < screen.height; y += this.maxProgress) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        0,
                        y,
                        screen.width,
                        this.progress
                    )
                }
            }
            else {
                for (let y = 0; y < screen.height; y += this.maxProgress) {
                    copyRect(
                        upperScreen,
                        lowerScreen,
                        0,
                        y + this.maxProgress - this.progress,
                        screen.width,
                        this.progress,
                    )
                }
            }
        }
    }

    //% fixedInstances
    export class DissolveTransition extends Transition {
        random: Math.FastRandom;

        constructor() {
            super();

            this.random = new Math.FastRandom();
        }

        start(speed: number, reverse: boolean) {
            super.start(speed, reverse);
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            initMask();
            this.random.reset();
            mask.fill(0);
            for (let x = 0; x < screen.width; x += 4) {
                for (let y = 0; y < screen.height; y += 4) {
                    if (this.random.percentChance(this.percent)) {
                        mask.fillRect(x, y, 4, 4, 1)
                    }
                }
            }

            helpers.mapImage(
                lowerScreen,
                mask,
                0,
                0,
                maskShades,
            );

            upperScreen.drawTransparentImage(lowerScreen, 0, 0)
        }
    }

    //% fixedInstances
    export class ClockTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = 360;
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            initMask();
            if (this.reverse) {
                this.drawMask(this.maxProgress - this.progress)

                helpers.mapImage(
                    upperScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                lowerScreen.drawTransparentImage(upperScreen, 0, 0);
                upperScreen.drawImage(lowerScreen, 0, 0)
            }
            else {
                this.drawMask(this.progress);

                helpers.mapImage(
                    lowerScreen,
                    mask,
                    0,
                    0,
                    maskShades
                )
                upperScreen.drawTransparentImage(lowerScreen, 0, 0);
            }
        }

        protected drawMask(degrees: number) {
            mask.fill(0);

            const angle = ((degrees - 90) / 180) * Math.PI;

            if (degrees < 90) {
                mask.fillTriangle(
                    mask.width >> 1,
                    mask.height >> 1,
                    mask.width >> 1,
                    0,
                    (mask.width >> 1) + Math.cos(angle) * (screen.width << 3),
                    (mask.height >> 1) + Math.sin(angle) * (screen.width << 3),
                    1
                )
            }
            else if (degrees < 180) {
                mask.fillRect(
                    mask.width >> 1,
                    0,
                    mask.width >> 1,
                    mask.height >> 1,
                    1
                )
                mask.fillTriangle(
                    mask.width >> 1,
                    mask.height >> 1,
                    screen.width << 3,
                    mask.height >> 1,
                    (mask.width >> 1) + Math.cos(angle) * (screen.width << 3),
                    (mask.height >> 1) + Math.sin(angle) * (screen.width << 3),
                    1
                )
            }
            else if (degrees < 270) {
                mask.fillRect(
                    mask.width >> 1,
                    0,
                    mask.width >> 1,
                    mask.height,
                    1
                )
                mask.fillTriangle(
                    mask.width >> 1,
                    mask.height >> 1,
                    mask.width >> 1,
                    screen.width << 3,
                    (mask.width >> 1) + Math.cos(angle) * (screen.width << 3),
                    (mask.height >> 1) + Math.sin(angle) * (screen.width << 3),
                    1
                )
            }
            else {
                mask.fillRect(
                    mask.width >> 1,
                    0,
                    mask.width >> 1,
                    mask.height,
                    1
                )
                mask.fillRect(
                    0,
                    mask.height >> 1,
                    mask.width >> 1,
                    mask.height >> 1,
                    1
                )
                mask.fillTriangle(
                    mask.width >> 1,
                    mask.height >> 1,
                    -(screen.width << 3),
                    mask.height >> 1,
                    (mask.width >> 1) + Math.cos(angle) * (screen.width << 3),
                    (mask.height >> 1) + Math.sin(angle) * (screen.width << 3),
                    1
                )
            }
        }
    }

    //% fixedInstances
    export class VerticalSplitTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = screen.width >> 1;
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            if (this.reverse) {
                copyRect(
                    upperScreen,
                    lowerScreen,
                    0,
                    0,
                    this.progress,
                    screen.height
                )

                copyRect(
                    upperScreen,
                    lowerScreen,
                    screen.width - this.progress,
                    0,
                    this.progress + 1,
                    screen.height
                )
            }
            else {
                copyRect(
                    upperScreen,
                    lowerScreen,
                    (screen.width >> 1) - this.progress,
                    0,
                    this.progress << 1,
                    screen.height
                )
            }
        }
    }

    //% fixedInstances
    export class HorizontalSplitTransition extends Transition {
        constructor() {
            super();
            this.maxProgress = screen.height >> 1;
        }

        drawCore(upperScreen: Image, lowerScreen: Image) {
            if (this.reverse) {
                copyRect(
                    upperScreen,
                    lowerScreen,
                    0,
                    0,
                    screen.width,
                    this.progress
                )

                copyRect(
                    upperScreen,
                    lowerScreen,
                    0,
                    screen.height - this.progress,
                    screen.width,
                    this.progress + 1,
                )
            }
            else {
                copyRect(
                    upperScreen,
                    lowerScreen,
                    0,
                    (screen.height >> 1) - this.progress,
                    screen.width,
                    this.progress << 1
                )
            }
        }
    }

    function _create() {
        return new State();
    }

    export function _state() {
        return __util.getState(_create);
    }

    function initMask() {
        if (!mask) {
            mask = image.create(screen.width, screen.height);
            maskShades = control.createBuffer(256);

            for (let i = 16; i < maskShades.length; i++) {
                maskShades[i] = i % 16;
            }
        }
    }

    function copyRect(dest: Image, src: Image, x: number, y: number, width: number, height: number) {
        dest.blit(
            x,
            y,
            width,
            height,
            src,
            x,
            y,
            width,
            height,
            false,
            false
        )
    }
}
