/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.test {
    export class TestSceneUI extends Scene {
		public scoreLbl:Laya.Label;
		public tipLbll:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":1720,"runtime":"script/GameUI.ts","name":"gameBox","height":1020},"compId":1,"child":[{"type":"Sprite","props":{"y":900,"x":0,"width":1720,"texture":"test/block.png","name":"ground","height":20},"compId":3,"child":[{"type":"Script","props":{"y":0,"x":0,"width":1720,"label":"ground","height":20,"runtime":"Laya.BoxCollider"},"compId":5},{"type":"Script","props":{"type":"static","runtime":"Laya.RigidBody"},"compId":6}]},{"type":"Sprite","props":{"y":0,"x":0,"name":"gameBox"},"compId":18},{"type":"Sprite","props":{"y":0,"x":0,"name":"UI"},"compId":14,"child":[{"type":"Label","props":{"y":50,"x":158,"width":272,"var":"scoreLbl","height":47,"fontSize":40,"color":"#51c524","align":"center"},"compId":17},{"type":"Label","props":{"y":0,"x":0,"width":640,"var":"tipLbll","valign":"middle","text":"别让箱子掉下来\\n\\n点击屏幕开始游戏","height":1136,"fontSize":40,"color":"#c6302e","align":"center"},"compId":16}]},{"type":"Script","props":{"enabled":true,"dropBox":"@Prefab:prefab/DropBox.prefab","bullet":"@Prefab:prefab/Bullet.prefab","runtime":"script/GameControl.ts"},"compId":20}],"loadList":["test/block.png","prefab/DropBox.prefab","prefab/Bullet.prefab"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(TestSceneUI.uiView);
        }
    }
    REG("ui.test.TestSceneUI",TestSceneUI);
}