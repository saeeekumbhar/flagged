"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDailyEmissions = void 0;
const EmissionFactors_1 = require("../utils/EmissionFactors");
const calculateDailyEmissions = (log) => {
    let co2 = 0;
    if (log.transport && EmissionFactors_1.TRANSPORT_EMISSIONS[log.transport] !== undefined) {
        co2 += EmissionFactors_1.TRANSPORT_EMISSIONS[log.transport];
    }
    if (log.foodSource || log.foodDiet) {
        if (log.foodSource && EmissionFactors_1.FOOD_SOURCE_EMISSIONS[log.foodSource] !== undefined) {
            co2 += EmissionFactors_1.FOOD_SOURCE_EMISSIONS[log.foodSource];
        }
        if (log.foodDiet && EmissionFactors_1.FOOD_DIET_EMISSIONS[log.foodDiet] !== undefined) {
            co2 += EmissionFactors_1.FOOD_DIET_EMISSIONS[log.foodDiet];
        }
    }
    else if (log.food && EmissionFactors_1.LEGACY_FOOD_EMISSIONS[log.food] !== undefined) {
        co2 += EmissionFactors_1.LEGACY_FOOD_EMISSIONS[log.food];
    }
    if (log.delivery && EmissionFactors_1.DELIVERY_EMISSIONS[log.delivery] !== undefined) {
        co2 += EmissionFactors_1.DELIVERY_EMISSIONS[log.delivery];
    }
    if (log.energyLaptop && EmissionFactors_1.ENERGY_LAPTOP_EMISSIONS[log.energyLaptop] !== undefined) {
        co2 += EmissionFactors_1.ENERGY_LAPTOP_EMISSIONS[log.energyLaptop];
    }
    if (log.energyAC && EmissionFactors_1.ENERGY_AC_EMISSIONS[log.energyAC] !== undefined) {
        co2 += EmissionFactors_1.ENERGY_AC_EMISSIONS[log.energyAC];
    }
    if (log.shopping && EmissionFactors_1.SHOPPING_EMISSIONS[log.shopping] !== undefined) {
        co2 += EmissionFactors_1.SHOPPING_EMISSIONS[log.shopping];
    }
    return Number(co2.toFixed(2));
};
exports.calculateDailyEmissions = calculateDailyEmissions;
//# sourceMappingURL=CarbonService.js.map