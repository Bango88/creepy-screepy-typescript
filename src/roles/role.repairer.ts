// Repairer role

export var roleRepairer = {
    // repair damaged structures
    run: function(creep: Creep) {
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0){
            creep.memory.repairing = true;
            creep.say('🛠️ repairing')
        }

        if (creep.memory.repairing) {
            // find closest damaged structure
            const damagedStructures = creep.room.find(FIND_STRUCTURES, {
                // filter: (structure) => structure.hits < structure.hitsMax
                filter: (structure) => structure.hits < structure.hitsMax * 0.8
            });
            const closestDamagedStructure = creep.pos.findClosestByRange(damagedStructures);
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (closestDamagedStructure) {
                if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedStructure, {reusePath: 50});
                }
            } else if (constructionSites){
                if (constructionSites.length) {
                    if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], {reusePath: 20});
                    }
                }
            } else {
                const sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
                if (sources) {
                    if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 });
                    }
                }
            }
        } else {
            // harvest energy from dropped energy
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => resource.resourceType == RESOURCE_ENERGY
            })
            // find closest dropped energy
            const closestDroppedEnergy = creep.pos.findClosestByRange(droppedEnergy)
            if (closestDroppedEnergy) {
                if (creep.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDroppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 20});
                }
            }
        }
    }
};
