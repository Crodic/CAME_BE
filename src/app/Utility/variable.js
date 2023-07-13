const expIncrements = {
    like: 10,
    upload: 20,
    comment: 5
};

const vipLevels = [
    { expThreshold: 200, vipLevel: 1 },
    { expThreshold: 1000, vipLevel: 2 },
    { expThreshold: 2000, vipLevel: 3 },
    { expThreshold: 3000, vipLevel: 4 },
    { expThreshold: 4000, vipLevel: 5 },
    { expThreshold: 5000, vipLevel: 6 },
    { expThreshold: 6000, vipLevel: 7 },
    { expThreshold: 7000, vipLevel: 8 },
    { expThreshold: 8000, vipLevel: 9 },
    { expThreshold: 9500, vipLevel: 10 },
    { expThreshold: 10000, vipLevel: 11 },
    { expThreshold: 12000, vipLevel: 12 }
];

module.exports = { vipLevels, expIncrements }