/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    reject: [
        // move to Node 24+ manually when ready
        '@types/node',
    ],
    packageManager: 'pnpm',
    deep: true,
};
