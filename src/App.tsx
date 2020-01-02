import React from 'react';
import './App.css';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { useSpring, animated, config, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";

type ClassNames = "app" | "sceneContainer" | "scene" | "cube" | "cubeFace" | "back" | "front" | "left" | "right" | "top" | "bottom" | "titlebar";

const useStyles = createUseStyles<ClassNames>({
    app: {

    },
    titlebar: {
        position: "fixed",
        top: 0, left: 0, right: 0,
        backgroundColor: "#43b5ff",
        color: "white",
        padding: "10px",
        "& h1": {
            margin: "5px 10px"
        },
        boxShadow: "2px 0 8px rgba(0,0,0,0.6)"
    },
    sceneContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
    },
    scene: {
        width: 200,
        height: 200,
        perspective: "600px"
    },
    cube: {
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        userSelect: "none",
        cursor: "grab",
        "&:active": {
            cursor: "grabbing"
        }
    },
    cubeFace: {
        position: "absolute",
        width: 200,
        height: 200,
        textAlign: "center",
        lineHeight: "200px",
        fontSize: "46px",
        opacity: 0.7,
        color: "white",
        fontWeight: "600",
        border: "1px solid black",
        textShadow: "1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000"
    },
    front: {
        backgroundColor: "red",
        transform: "rotateY(0deg) translateZ(100px)"
    },
    back: {
        backgroundColor: "green",
        transform: "rotateY(180deg) translateZ(100px)"
    },
    left: {
        backgroundColor: "yellow",
        transform: "rotateY(-90deg) translateZ(100px)"
    },
    right: {
        backgroundColor: "purple",
        transform: "rotateY(90deg) translateZ(100px)"
    },
    top: {
        backgroundColor: "orange",
        transform: "rotateX(90deg) translateZ(100px)"
    },
    bottom: {
        backgroundColor: "cyan",
        transform: "rotateX(-90deg) translateZ(100px)"
    }
});

const App: React.FC = () => {
    const classes = useStyles();

    const [ { rotateY },  setY] = useSpring(() => ({
        rotateY: 0,
        config: config.molasses
    }));


    const [{ rotateX }, setX] = useSpring(() => ({
        rotateX: 0,
        config: config.molasses
    }));

    const bind = useDrag(
        ({ down, direction: [dx, dy], vxvy: [vx, vy] }) => {
            setX({
                rotateX: (dx * vx * dx + rotateX.getValue()) % 360,
                immediate: down,
                config: () => ({
                    velocity: vx / 3,
                    decay: true
                })
            });

            setY({
                rotateY: (-dy * vy * dy + rotateY.getValue()) % 360,
                immediate: down,
                config: () => ({
                    velocity: -vy / 3,
                    decay: true
                })
            })
        });

    return (
        <div className={classes.app}>
            <div className={classes.titlebar}>
                <h1>Spin the Cube</h1>
            </div>
            <div className={classes.sceneContainer}>
                <div className={classes.scene}>
                    <animated.div
                        className={classes.cube}
                        {...bind()}
                        style={{
                            transform: interpolate([rotateX, rotateY],
                                (x,y) => `rotateY(${x}deg) rotateX(${y}deg)`)
                        }}>
                        <div className={classNames(classes.cubeFace, classes.back)}>Back</div>
                        <div className={classNames(classes.cubeFace, classes.front)}>Front</div>
                        <div className={classNames(classes.cubeFace, classes.left)}>Left</div>
                        <div className={classNames(classes.cubeFace, classes.right)}>Right</div>
                        <div className={classNames(classes.cubeFace, classes.top)}>Top</div>
                        <div className={classNames(classes.cubeFace, classes.bottom)}>Bottom</div>
                    </animated.div>
                </div>
            </div>
        </div>
    );
};

export default App;
