(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(TestSceneUI.uiView);
                }
            }
            TestSceneUI.uiView = { "type": "Scene", "props": { "width": 1710, "runtime": "script/GameUI.ts", "name": "gameBox", "height": 1020 }, "compId": 1, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 1720, "texture": "slot/main_game/back.png", "height": 1020 }, "compId": 27 }, { "type": "Animation", "props": { "y": 322, "x": 1378, "width": 249, "source": "slot/animations/pers/pers_idle/pers_idle.json", "name": "person_idle", "height": 484, "autoPlay": true }, "compId": 28 }, { "type": "Animation", "props": { "y": 633, "x": 277, "source": "slot/animations/fire/fire.json", "name": "fire", "autoPlay": true }, "compId": 29 }], "loadList": ["slot/main_game/back.png"], "loadList3D": [] };
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onUpdate() {
        }
        createBox() {
        }
        onStageClick(e) {
        }
        startGame() {
        }
        stopGame() {
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            GameUI.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._control = this.getComponent(GameControl);
        }
        onTipClick(e) {
            this._control.startGame();
        }
        stopGame() {
            this._control.stopGame();
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 1720;
    GameConfig.height = 1020;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
