
//% color="#04c4d9"
//% block="Screen Transitions"
namespace screenTransitions {
    //% fixedInstance
    //% whenUsed
    //% block="horizontal"
    //% blockIdentity="screenTransitions._transition"
    export let Horizontal: Transition = new HorizontalTransition();

    //% fixedInstance
    //% whenUsed
    //% block="vertical"
    //% blockIdentity="screenTransitions._transition"
    export let Vertical: Transition = new VerticalTransition();

    //% fixedInstance
    //% whenUsed
    //% block="wavy horizontal"
    //% blockIdentity="screenTransitions._transition"
    export let WavyHorizontal: Transition = new HorizontalWavyTransition();

    //% fixedInstance
    //% whenUsed
    //% block="wavy vertical"
    //% blockIdentity="screenTransitions._transition"
    export let WavyVertical: Transition = new VerticalWavyTransition();

    //% fixedInstance
    //% whenUsed
    //% block="diagonal top left"
    //% blockIdentity="screenTransitions._transition"
    export let DiagonalTopLeft: Transition = new DiagonalTransition(false);

    //% fixedInstance
    //% whenUsed
    //% block="diagonal bottom left"
    //% blockIdentity="screenTransitions._transition"
    export let DiagonalBottomLeft: Transition = new DiagonalTransition(true);

    //% fixedInstance
    //% whenUsed
    //% block="circle"
    //% blockIdentity="screenTransitions._transition"
    export let Circle: Transition = new CircleTransition();

    //% fixedInstance
    //% whenUsed
    //% block="star"
    //% blockIdentity="screenTransitions._transition"
    export let Star: Transition = new ImageTransition(img`
        ...............11...............
        ..............1111..............
        ..............1111..............
        ..............1111..............
        .............111111.............
        .............111111.............
        ............11111111............
        ............11111111............
        ............11111111............
        ...........1111111111...........
        11111111111111111111111111111111
        .111111111111111111111111111111.
        ...11111111111111111111111111...
        ....111111111111111111111111....
        .....1111111111111111111111.....
        .......111111111111111111.......
        ........1111111111111111........
        ........1111111111111111........
        ........1111111111111111........
        .......111111111111111111.......
        .......111111111111111111.......
        .......111111111111111111.......
        ......11111111111111111111......
        ......111111111..111111111......
        .....11111111......11111111.....
        .....1111111........1111111.....
        .....111111..........111111.....
        ....11111..............11111....
        ....1111................1111....
        ...1111..................1111...
        ...11......................11...
        ...1........................1...
    `);

    //% fixedInstance
    //% whenUsed
    //% block="vertical blinds"
    //% blockIdentity="screenTransitions._transition"
    export let VerticalBlinds: Transition = new VerticalBlindsTransition();

    //% fixedInstance
    //% whenUsed
    //% block="horizontal blinds"
    //% blockIdentity="screenTransitions._transition"
    export let HorizontalBlinds: Transition = new HorizontalBlindsTransition();

    //% fixedInstance
    //% whenUsed
    //% block="vertical split"
    //% blockIdentity="screenTransitions._transition"
    export let VerticalSplit: Transition = new VerticalSplitTransition();

    //% fixedInstance
    //% whenUsed
    //% block="horizontal split"
    //% blockIdentity="screenTransitions._transition"
    export let HorizontalSplit: Transition = new HorizontalSplitTransition();

    //% fixedInstance
    //% whenUsed
    //% block="dissolve"
    //% blockIdentity="screenTransitions._transition"
    export let Dissolve: Transition = new DissolveTransition();

    //% fixedInstance
    //% whenUsed
    //% block="clock"
    //% blockIdentity="screenTransitions._transition"
    export let Clock: Transition = new ClockTransition();

    //% shim=TD_ID
    //% blockId=screen_transitions_field_editor
    //% block="$transition"
    //% weight=80
    export function _transition(transition: Transition): Transition {
        return transition;
    }

    //% blockId=screen_transitions_start_transition
    //% block="start $transition transition for $time|ms reversed $reverse||and pause until done $pause"
    //% transition.shadow=screen_transitions_field_editor
    //% time.shadow=timePicker
    //% pause.defl=false
    //% weight=100
    //% inlineInputMode=inline
    export function startTransition(transition: Transition, time: number, reverse: boolean, pause = false) {
        time = Math.max(time, 0);
        const speed = 100 / (time / 1000);
        transition.start(speed, reverse);

        screenTransitions._state().transitionId++;
        const runId = screenTransitions._state().transitionId;

        const endtime = game.runtime() + time;
        if (pause) {
            pauseUntil(() =>
                game.runtime() >= endtime ||
                screenTransitions._state().transitionId !== runId
            )
        }
    }

    //% blockId=screen_transitions_show_transition_at_percent
    //% block="show $transition transition percent completed $percent reversed $reverse"
    //% transition.shadow=screen_transitions_field_editor
    //% percent.min=0;
    //% percent.max=100;
    //% weight=90
    export function showTransitionAtPercent(transition: Transition, percent: number, reverse: boolean) {
        transition.showAtPercent(Math.clamp(0, 100, percent), reverse);
        screenTransitions._state().transitionId++;
    }

    //% blockId=screen_transitions_clear_screen_transition
    //% block="clear current transition"
    //% weight=70
    export function clearScreenTransition() {
        _state().clear()
        screenTransitions._state().transitionId++;
    }

    //% blockId=screen_transitions_set_z
    //% block="set cutoff z $cutoffZ and render z $renderZ"
    //% weight=60
    export function setZ(cutoffZ: number, renderZ: number) {
        _state().setZ(cutoffZ, renderZ);
    }

    //% blockId=screen_transitions_set_sprite_z
    //% block="set z of all $spriteKind sprites to $value"
    //% spriteKind.shadow=spritekind
    //% weight=50
    export function setSpriteZ(spriteKind: number, value: number) {
        for (const sprite of sprites.allOfKind(spriteKind)) {
            sprite.z = value;
        }
    }

    //% blockId=screen_transitions_change_sprite_z
    //% block="change z of all $spriteKind sprites by $delta"
    //% spriteKind.shadow=spritekind
    //% weight=40
    export function changeSpriteZ(spriteKind: number, delta: number) {
        for (const sprite of sprites.allOfKind(spriteKind)) {
            sprite.z += delta;
        }
    }
}