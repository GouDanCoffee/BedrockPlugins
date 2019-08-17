import { ItemModuleReg,invCheck } from "./module/ItemCheat";
import {system,playerKicked,kickTickAdd,IUseCraftTableComponent} from "./system";
import {enchantReg,enchantCheck} from "./module/enchantCheat";
let tick = 0;



system.initialize = function () {
    server.log("Misbehavior loaded");

    system.registerComponent("misbehavior:isplayer", {});
    //这个组件记录玩家是否打开了工作台（打开工作台的时候将无法捡起物品,防刷）
    system.registerComponent("misbehavior:useCraftTable",{
        ifUse:false,
        ifShow:false
    });
    
    system.listenForEvent(ReceiveFromMinecraftServer.EntityCreated,data=>{
        let entity = data.data.entity;
        try {
            if(entity){
                if (entity.__identifier__ == "minecraft:player") {
                system.createComponent(entity,"misbehavior:isplayer");
                system.createComponent<IUseCraftTableComponent>(entity,"misbehavior:useCraftTable");
                }
            }
        } catch (error) {
            
        }

});

ItemModuleReg();
}

system.update = function () {
    tick++;
    if(tick > 1200){
        tick = 0;
        //system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c进行背包检查"}]}`,data=>{});
        system.executeCommand(`invcheck @a`,data=>{});
    }
    if(kickTickAdd()){
        for(let index in playerKicked){
            system.destroyEntity(playerKicked[index]);
            playerKicked.splice(Number(index),1);
        }
    }

}
