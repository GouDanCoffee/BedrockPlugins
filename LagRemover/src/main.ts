const system = server.registerSystem(0, 0);
//掉落物白名单
let itemWhitelist:string[] = ["minecraft:diamond","minecraft:gold_ore","minecraft:iron_ore","minecraft:diamond_ore","minecraft:diamond_block","minecraft:enchanting_table","minecraft:emerald_ore","minecraft:emerald_block","minecraft:beacon","minecraft:iron_shovel","minecraft:iron_pickaxe","minecraft:iron_axe","minecraft:bow","minecraft:diamond","minecraft:iron_ingot","minecraft:gold_ingot","minecraft:iron_sword","minecraft:diamond_sword","minecraft:diamond_shovel","minecraft:diamond_pickaxe","minecraft:diamond_axe"];
//实体黑
let entityBlacklist:string[] = [
"minecraft:evoker","minecraft:vex","minecraft:vindicator","minecraft:cat","minecraft:wolf","minecraft:silverfish","minecraft:polar_bear","minecraft:pufferfish","minecraft:rabbit","minecraft:mule","minecraft:llama","minecraft:horse",
  "minecraft:guardian","minecraft:tropical_fish","minecraft:tropicalfish","minecraft:donkey","minecraft:cod","minecraft:slime",
,"minecraft:squid","minecraft:dolphin","minecraft:chicken","minecraft:cow","minecraft:salmon",
"minecraft:sheep","","minecraft:pig",  "minecraft:spider","minecraft:turtle","fine:halfzombie","minecraft:bat","minecraft:blaze",
"minecraft:cave_spider","minecraft:creeper","minecraft:drowned","minecraft:enderman"
,"minecraft:ghast","minecraft:husk","minecraft:magma_cube","minecraft:skeleton","minecraft:squid"
,"minecraft:stray","minecraft:wither_skeleton","minecraft:zombie","minecraft:zombie_pigman","minecraft:ocelot"];
//堆叠生物白名单
let stackWhitelist:string[] = ["minecraft:xp_orb","minecraft:falling_block","minecraft:ravager","minecraft:pillager","minecraft:player","minecraft:armor_stand","minecraft:villager","minecraft:villager_v2","minecraft:villager_v2"];
let noNameEntityBlackList:string[] = ["minecraft:wither_skull","minecraft:egg","minecraft:xp_orb","minecraft:fireball","minecraft:small_fireball","minecraft:arrow"];
let itemQuery,mobQuery,entityQuery,positionQuery,playerQuery,noNameEntityQuery;
let notClearMobNum = 0,clearMobNum = 0;
//模拟距离
let tick = 0;
let clearInterval = 10800; //清理间隔设置（这里是提醒的间隔） 上一次清理后间隔1200tick提醒，然后再等一分钟开始清理 一共两分钟
//let clearInterval = 300;
let second=0,minute=0,hour=0;
system.initialize = function () {
    server.log("LagRemover Loaded");

    itemQuery = system.registerQuery();
    mobQuery = system.registerQuery();
    entityQuery = system.registerQuery();
    noNameEntityQuery = system.registerQuery();
    positionQuery = system.registerQuery(MinecraftComponent.Position, "x", "y", "z");
    system.registerComponent("lagremover:isItem", {});
    system.registerComponent("lagremover:isMob", {});
    system.registerComponent("lagremover:noNameEntity", {});
    system.addFilterToQuery(itemQuery,"lagremover:isItem");
    system.addFilterToQuery(mobQuery,"lagremover:isMob");
    system.addFilterToQuery(mobQuery,"minecraft:nameable");
    system.addFilterToQuery(noNameEntityQuery,"lagremover:noNameEntity")
    system.listenForEvent("minecraft:entity_created",onEntityCreate);

    system.registerCommand("lagstatus", {
        description: "查看当前卡顿情况",
        permission: 1,
        overloads: [{
            parameters:[],
            handler() {
                if(!this.entity) throw "只有玩家可以执行";
              let entities = system.getEntitiesFromQuery(itemQuery);
              system.sendText(this.entity,`§c服务器已运行${minute}分钟${second}秒\n§c当前待清除掉落物数量:${entities.length}`)
              server.log(`当前待清除掉落物数量:${entities.length}`);
              entities = system.getEntitiesFromQuery(mobQuery);
              let noNameEntities = system.getEntitiesFromQuery(noNameEntityQuery);

              system.sendText(this.entity,`§c当前待清除生物数量:${entities.length + noNameEntities.length}`);
              server.log(`当前待清除生物数量:${entities.length + noNameEntities.length}`);
              entities = system.getEntitiesFromQuery(entityQuery);
              system.sendText(this.entity,`§c当前实体总数量${entities.length} \ntick:${tick} 距离清理:tick:${clearInterval + 1200 - tick}`)
              server.log(`当前实体总数量${entities.length} tick:${tick}\n距离清理:tick:${clearInterval + 1200 - tick}`);
          }
        } as CommandOverload<[]>
        ]
      });
}


system.update = function() {
    //20tick = 1s
    tick++;
    let mod = tick%20;
    if(mod == 0){
      second++;
    }
    if(second  == 60){
      minute++;
      second=0;
    }
    if(tick == clearInterval / 2){
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§a§l服务器开启了定时清理,大多数未命名生物及多数掉落物都会被清理，请格外注意！"}]}`,data=>{});
    }
    if(tick == clearInterval){
      //system.broadcastMessage(`§a§l一分钟后准备清理掉落物与生物，请做好准备`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§a§l一分钟后准备清理掉落物与生物，请做好准备"}]}`,data=>{});
    }
    else if(tick == (clearInterval+600)){
      //system.broadcastMessage(`§a§l30秒后准备清理掉落物与生物，请做好准备`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§a§l30秒后准备清理掉落物与生物，请做好准备"}]}`,data=>{});
    }
    else if(tick == (clearInterval+900)){
      //system.broadcastMessage(`§a§l15秒后准备清理掉落物与生物，请做好准备`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§a§l15秒后准备清理掉落物与生物，请做好准备"}]}`,data=>{});

    }
    else if(tick == (clearInterval+1100)){
      //system.broadcastMessage(`§c§l5秒后准备清理掉落物与生物`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c§l5秒后准备清理掉落物与生物"}]}`,data=>{});
    }
    else if(tick == (clearInterval+1120)){
      //system.broadcastMessage(`§c§l4秒后准备清理掉落物生物`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c§l4秒后准备清理掉落物与生物"}]}`,data=>{});
    }
    else if(tick == (clearInterval+1140)){
      //system.broadcastMessage(`§c§l3秒后准备清理掉落物生物`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c§l3秒后准备清理掉落物与生物"}]}`,data=>{});
    }
    else if(tick == (clearInterval+1160)){
      //system.broadcastMessage(`§c§l2秒后准备清理掉落物生物`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c§l2秒后准备清理掉落物与生物"}]}`,data=>{});
    }
    else if(tick == (clearInterval+1180)){
      //system.broadcastMessage(`§c§l1秒后准备清理掉落物生物`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c§l1秒后准备清理掉落物与生物"}]}`,data=>{});
    }
    else if(tick == (clearInterval+1200)){
      let itemEntities = system.getEntitiesFromQuery(itemQuery);
      let mobEntities = system.getEntitiesFromQuery(mobQuery);
      let noNameEntities = system.getEntitiesFromQuery(noNameEntityQuery);
      let mobLength = mobEntities.length;
      let itemLength = itemEntities.length;
      let beginTime = Date.now();
      for (let entity of itemEntities){
        system.destroyEntity(entity);
      }
      for (let mob of mobEntities){
       // if(system.getComponent(mob,MinecraftComponent.Nameable).data.name == ""){
        let nameCmp = system.getComponent<INameableComponent>(mob,"minecraft:nameable");
        if(nameCmp.data.name != ""){
          notClearMobNum++;
        }
        else{
          system.destroyEntity(mob);
          clearMobNum++;
        }
      }
      for (let noNameE of noNameEntities){
        system.destroyEntity(noNameE);
        clearMobNum++;
      }
      let endTime = Date.now();
      let useTime = endTime - beginTime;
      //system.(`§a§l清道夫§r §c已经清理${itemLength}个掉落物 ${mobLength}个生物,共耗时${useTime}ms`);
      system.executeCommand(`tellraw @a {"rawtext":[{"text":"§a§l清道夫§r §c已经清理\n${itemLength}个掉落物 ${clearMobNum}个生物(有${notClearMobNum}个命名生物避免被清理),共耗时${useTime}ms"}]}`,data=>{});
      server.log(`已经清理${itemLength}个掉落物 ${clearMobNum}个生物,共耗时${useTime}ms`);
      notClearMobNum = 0;
      clearMobNum = 0;
      tick = 0;
    }
  
  

  };

function onEntityCreate(data){
    let entity = data.data.entity;
    if(entity.__type__ == "item_entity"){
        if(itemWhitelist.indexOf(entity.__identifier__) == -1){
        system.createComponent(entity,"lagremover:isItem");
        }
    }
    else{
      if(entityBlacklist.indexOf(entity.__identifier__) != -1){
        system.createComponent(entity,"lagremover:isMob");
        }
        else if (noNameEntityBlackList.indexOf(entity.__identifier__) != -1){
          system.createComponent(entity,"lagremover:noNameEntity");
        }
        else{
        }
    }
}
