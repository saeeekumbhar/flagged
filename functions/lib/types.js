"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEra = void 0;
const calculateEra = (score) => {
    if (score <= 40)
        return 'Red Flag Era';
    if (score <= 70)
        return 'Glow Up Era';
    return 'Green Flag Era';
};
exports.calculateEra = calculateEra;
//# sourceMappingURL=types.js.map