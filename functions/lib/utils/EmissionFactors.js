"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_AC_SCORES = exports.ENERGY_LAPTOP_SCORES = exports.SHOPPING_SCORES = exports.DELIVERY_SCORES = exports.LEGACY_FOOD_SCORES = exports.FOOD_DIET_SCORES = exports.FOOD_SOURCE_SCORES = exports.TRANSPORT_SCORES = exports.SHOPPING_EMISSIONS = exports.ENERGY_AC_EMISSIONS = exports.ENERGY_LAPTOP_EMISSIONS = exports.DELIVERY_EMISSIONS = exports.LEGACY_FOOD_EMISSIONS = exports.FOOD_DIET_EMISSIONS = exports.FOOD_SOURCE_EMISSIONS = exports.TRANSPORT_EMISSIONS = void 0;
// Emission Factors (kg CO2e)
exports.TRANSPORT_EMISSIONS = {
    walk: 0,
    cycle: 0,
    none: 0,
    metro: 1.0,
    bus: 1.5,
    auto: 3.0,
    car: 8.0,
    cab: 8.0,
};
exports.FOOD_SOURCE_EMISSIONS = {
    mess: 1.5,
    home: 1.5,
    outside: 3.0,
    none: 0,
};
exports.FOOD_DIET_EMISSIONS = {
    veg: 0.5,
    mixed: 1.5,
    nonveg: 4.5,
    none: 0,
};
exports.LEGACY_FOOD_EMISSIONS = {
    mess: 1.5,
    home: 1.5,
    veg: 2.0,
    mixed: 3.0,
    nonveg: 6.0,
    none: 0,
};
exports.DELIVERY_EMISSIONS = {
    no: 0,
    once: 2.0,
    multiple: 5.0,
};
exports.ENERGY_LAPTOP_EMISSIONS = {
    '<2h': 0.1,
    '2-4h': 0.3,
    '4-8h': 0.6,
    '8+h': 1.0,
    none: 0,
};
exports.ENERGY_AC_EMISSIONS = {
    none: 0,
    '<2h': 1.5,
    '2-6h': 4.0,
    '6+h': 8.0,
};
exports.SHOPPING_EMISSIONS = {
    no: 0,
    small: 2.0,
    medium: 5.0,
    large: 15.0,
};
// Daily Scores (0-100)
exports.TRANSPORT_SCORES = {
    walk: 100,
    cycle: 100,
    none: 100,
    bus: 85,
    metro: 85,
    auto: 65,
    car: 35,
    cab: 35,
};
exports.FOOD_SOURCE_SCORES = {
    mess: 100,
    home: 100,
    outside: 50,
    none: 100,
};
exports.FOOD_DIET_SCORES = {
    veg: 100,
    mixed: 75,
    nonveg: 40,
    none: 100,
};
exports.LEGACY_FOOD_SCORES = {
    mess: 100,
    home: 100,
    veg: 100,
    mixed: 75,
    nonveg: 40,
    none: 100,
};
exports.DELIVERY_SCORES = {
    no: 100,
    once: 60,
    multiple: 20,
};
exports.SHOPPING_SCORES = {
    no: 100,
    small: 80,
    medium: 50,
    large: 20,
};
exports.ENERGY_LAPTOP_SCORES = {
    '<2h': 100,
    'none': 100,
    '2-4h': 80,
    '4-8h': 60,
    '8+h': 40,
};
exports.ENERGY_AC_SCORES = {
    none: 100,
    '<2h': 80,
    '2-6h': 50,
    '6+h': 20,
};
//# sourceMappingURL=EmissionFactors.js.map