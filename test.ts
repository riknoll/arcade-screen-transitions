
const bg1 = sprites.create(image.create(160, 120), SpriteKind.Food);
bg1.image.fill(7);

for (let x = 0; x < screen.width; x += 40) {
    for (let y = 0; y < screen.height; y += 40) {
        let s = sprites.create(img`
            . . . . . . . . . . . 6 6 6 6 6
            . . . . . . . . . 6 6 7 7 7 7 8
            . . . . . . 8 8 8 7 7 8 8 6 8 8
            . . e e e e c 6 6 8 8 . 8 7 8 .
            . e 2 5 4 2 e c 8 . . . 6 7 8 .
            e 2 4 2 2 2 2 2 c . . . 6 7 8 .
            e 2 2 2 2 2 2 2 c . . . 8 6 8 .
            e 2 e e 2 2 2 2 e e e e c 6 8 .
            c 2 e e 2 2 2 2 e 2 5 4 2 c 8 .
            . c 2 e e e 2 e 2 4 2 2 2 2 c .
            . . c 2 2 2 e e 2 2 2 2 2 2 2 e
            . . . e c c e c 2 2 2 2 2 2 2 e
            . . . . . . . c 2 e e 2 2 e 2 c
            . . . . . . . c e e e e e e 2 c
            . . . . . . . . c e 2 2 2 2 c .
            . . . . . . . . . c c c c c . .
        `, SpriteKind.Food)
        s.z = 0;
        s.x = x + 10;
        s.y = y + 10
    }
}

const bg2 = sprites.create(image.create(160, 120), SpriteKind.Food);
bg2.image.fill(3);
bg2.z = 90
for (let x = 0; x < screen.width; x += 40) {
    for (let y = 0; y < screen.height; y += 40) {
        let s = sprites.create(img`
            4 4 4 . . 4 4 4 4 4 . . . . . .
            4 5 5 4 4 5 5 5 5 5 4 4 . . . .
            b 4 5 5 1 5 1 1 1 5 5 5 4 . . .
            . b 5 5 5 5 1 1 5 5 1 1 5 4 . .
            . b d 5 5 5 5 5 5 5 5 1 1 5 4 .
            b 4 5 5 5 5 5 5 5 5 5 5 1 5 4 .
            c d 5 5 5 5 5 5 5 5 5 5 5 5 5 4
            c d 4 5 5 5 5 5 5 5 5 5 5 1 5 4
            c 4 5 5 5 d 5 5 5 5 5 5 5 5 5 4
            c 4 d 5 4 5 d 5 5 5 5 5 5 5 5 4
            . c 4 5 5 5 5 d d d 5 5 5 5 5 b
            . c 4 d 5 4 5 d 4 4 d 5 5 5 4 c
            . . c 4 4 d 4 4 4 4 4 d d 5 d c
            . . . c 4 4 4 4 4 4 4 4 5 5 5 4
            . . . . c c b 4 4 4 b b 4 5 4 4
            . . . . . . c c c c c c b b 4 .
        `, SpriteKind.Food)
        s.z = 91;
        s.x = x + 10;
        s.y = y + 10
    }
}

let allWipes = [
    [screenTransitions.Horizontal, "Horizontal"],
    [screenTransitions.Vertical, "Vertical"],
    [screenTransitions.WavyHorizontal, "WavyHorizontal"],
    [screenTransitions.WavyVertical, "WavyVertical"],
    [screenTransitions.VerticalSplit, "VerticalSplit"],
    [screenTransitions.HorizontalSplit, "HorizontalSplit"],
    [screenTransitions.DiagonalTopLeft, "DiagonalTopLeft"],
    [screenTransitions.DiagonalBottomLeft, "DiagonalBottomLeft"],
    [screenTransitions.Circle, "Circle"],
    [screenTransitions.Star, "Star"],
    [screenTransitions.VerticalBlinds, "VerticalBlinds"],
    [screenTransitions.HorizontalBlinds, "HorizontalBlinds"],
    [screenTransitions.Dissolve, "Dissolve"],
    [screenTransitions.Clock, "Clock"],
]

let current = 0;
let index = 0;
let reverse = false;
let first = true;

screenTransitions.setZ(50, 1000)

controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    if (!first) {
        for (const sprite of sprites.allOfKind(SpriteKind.Food)) {
            if (sprite.z > 50) {
                sprite.z -= 100;
            }
            else {
                sprite.z += 100
            }
        }
    }
    else {
        first = false;
    }

    current = index;
    screenTransitions.clearScreenTransition()
    screenTransitions.startTransition(allWipes[index][0] as screenTransitions.Transition, 1000, reverse);
    if (reverse) {
        index = (index + 1) % allWipes.length;
        reverse = false;
    }
    else {
        reverse = true;
    }
})

scene.createRenderable(49, () => {
    for (const sprite of sprites.allOfKind(SpriteKind.Food)) {
        if (sprite.width > 32 || sprite.z > 50) continue;
        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left,
            sprite.top - screen.height
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top - screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top - screen.height
        )
    }
})

scene.createRenderable(199, () => {
    for (const sprite of sprites.allOfKind(SpriteKind.Food)) {
        if (sprite.width > 32 || sprite.z < 50) continue;

        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left,
            sprite.top - screen.height
        )
        screen.drawTransparentImage(
            sprite.image,
            sprite.left,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top - screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left - screen.width,
            sprite.top + screen.height
        )

        screen.drawTransparentImage(
            sprite.image,
            sprite.left + screen.width,
            sprite.top - screen.height
        )
    }
})

game.onUpdate(() => {
    for (const sprite of sprites.allOfKind(SpriteKind.Food)) {
        if (sprite.left > screen.width) {
            sprite.left -= screen.width
        }
        else if (sprite.right < 0) {
            sprite.right += screen.width
        }
        if (sprite.bottom > screen.height) {
            sprite.bottom -= screen.height
        }
        else if (sprite.top < 0) {
            sprite.top += screen.height
        }
    }
})

for (const sprite of sprites.allOfKind(SpriteKind.Food)) {
    if (sprite.width > 32) continue;

    if (sprite.z > 50) {
        sprite.vx = 50;
        sprite.vy = 50;
    }
    else {
        sprite.vx = -50;
        sprite.vy = -50;
    }
}

scene.createRenderable(2000, () => {
    const name = allWipes[current][1] as string;
    const width = name.length * image.font8.charWidth;

    screen.fillRect(
        (screen.width >> 1) - (width >> 1) - 1,
        100,
        width + 2,
        image.font8.charHeight + 2,
        1
    )

    screen.printCenter(
        name,
        101,
        15
    )
})

game.stats = true