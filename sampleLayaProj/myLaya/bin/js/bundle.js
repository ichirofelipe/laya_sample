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
            TestSceneUI.uiView = { "type": "Scene", "props": { "width": 1720, "runtime": "script/GameUI.ts", "name": "gameBox", "height": 1020 }, "compId": 1, "child": [{ "type": "Sprite", "props": { "y": 900, "x": 0, "width": 1720, "texture": "test/block.png", "name": "ground", "height": 20 }, "compId": 3, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "width": 1720, "label": "ground", "height": 20, "runtime": "Laya.BoxCollider" }, "compId": 5 }, { "type": "Script", "props": { "type": "static", "runtime": "Laya.RigidBody" }, "compId": 6 }] }, { "type": "Sprite", "props": { "y": 0, "x": 0, "name": "gameBox" }, "compId": 18 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "name": "UI" }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 50, "x": 158, "width": 272, "var": "scoreLbl", "height": 47, "fontSize": 40, "color": "#51c524", "align": "center" }, "compId": 17 }, { "type": "Label", "props": { "y": 0, "x": 0, "width": 640, "var": "tipLbll", "valign": "middle", "text": "别让箱子掉下来\\n\\n点击屏幕开始游戏", "height": 1136, "fontSize": 40, "color": "#c6302e", "align": "center" }, "compId": 16 }] }, { "type": "Script", "props": { "enabled": true, "dropBox": "@Prefab:prefab/DropBox.prefab", "bullet": "@Prefab:prefab/Bullet.prefab", "runtime": "script/GameControl.ts" }, "compId": 20 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 1, "visible": false, "name": "wallLeft", "height": 920 }, "compId": 21, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "width": 1, "label": "wall-left", "height": 920, "runtime": "Laya.BoxCollider" }, "compId": 22 }, { "type": "Script", "props": { "type": "static", "group": 1, "runtime": "Laya.RigidBody" }, "compId": 23 }] }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 1, "visible": false, "name": "wallRight", "height": 920 }, "compId": 24, "child": [{ "type": "Script", "props": { "y": 0, "x": 1720, "width": 1, "label": "wall-right", "height": 920, "runtime": "Laya.BoxCollider" }, "compId": 25 }, { "type": "Script", "props": { "type": "static", "group": 1, "runtime": "Laya.RigidBody" }, "compId": 26 }] }], "loadList": ["test/block.png", "prefab/DropBox.prefab", "prefab/Bullet.prefab"], "loadList3D": [] };
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 1000;
            this._time = 0;
            this._started = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(500, -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
            let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
            flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._gameBox.addChild(flyer);
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            this._gameBox.removeChildren();
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
            this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
        }
        onTipClick(e) {
            this.tipLbll.visible = false;
            this._score = 0;
            this.scoreLbl.text = "";
            this._control.startGame();
        }
        addScore(value = 1) {
            this._score += value;
            this.scoreLbl.changeText("分数：" + this._score);
            if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = Math.round(Math.random() * 5) + 1;
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            if (other.label === "buttle") {
                if (this.level > 1) {
                    this.level--;
                    this._text.changeText(this.level + "");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
                else {
                    if (owner.parent) {
                        let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                        effect.pos(owner.x, owner.y);
                        owner.parent.addChild(effect);
                        effect.play(0, true);
                        owner.removeSelf();
                        Laya.SoundManager.playSound("sound/destroy.wav");
                    }
                }
                GameUI.instance.addScore(1);
            }
            else if (other.label === "ground") {
                var velX = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.x;
                var velY = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.y;
                velY = (velY - 100) * 0.2;
                owner.getComponent(Laya.RigidBody).setVelocity({ x: velX, y: velY * 0.5 });
            }
            else if (other.label === "levelCollission") {
                var ownerMass = owner.getComponent(Laya.RigidBody)._body.m_mass;
                var otherMass = other.rigidBody._body.m_mass;
                var ownerVelY = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.y;
                var otherVelY = other.rigidBody._body.m_linearVelocity.y;
                var finalVelY = ((ownerMass * ownerVelY) + (otherMass * otherVelY)) / (ownerMass + otherMass);
                var diffX = (owner.x - other.rigidBody.owner.x);
                if (diffX < 0)
                    finalVelY *= -1;
                owner.getComponent(Laya.RigidBody).setVelocity({ x: finalVelY, y: 0 });
            }
            else if (other.label === "wall-left" || other.label === "wall-right") {
                console.log("wall");
                var velX = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.x;
                var vely = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.y;
                velX *= -1;
                owner.getComponent(Laya.RigidBody).setVelocity({ x: velX, y: vely });
            }
        }
        onTriggerStay(other, self, contact) {
            var owner = this.owner;
            if (other.label === "levelCollission") {
                var ownerMass = owner.getComponent(Laya.RigidBody)._body.m_mass;
                var otherMass = other.rigidBody._body.m_mass;
                var ownerVelY = owner.getComponent(Laya.RigidBody)._body.m_linearVelocity.y;
                var otherVelY = other.rigidBody._body.m_linearVelocity.y;
                var finalVelY = ((ownerMass * ownerVelY) + (otherMass * otherVelY)) / (ownerMass + otherMass);
                var diffX = (owner.x - other.rigidBody.owner.x);
                if (diffX < 0)
                    finalVelY *= -1;
                owner.getComponent(Laya.RigidBody).setVelocity({ x: finalVelY, y: 0 });
            }
        }
        createEffect() {
            let ani = new Laya.Animation();
            ani.loadAnimation("test/TestAni.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("effect", ani);
            }
            return ani;
        }
        onDisable() {
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
            reg("script/GameControl.ts", GameControl);
            reg("script/Bullet.ts", Bullet);
            reg("script/DropBox.ts", DropBox);
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
