const fs = require('fs');
const path = require('path');

/**
 * Parse a Dockerfile to extract version information
 * @param {string} dockerfilePath - Path to the Dockerfile
 * @returns {object} Parsed version information
 */
function parseDockerfile(dockerfilePath) {
    try {
        const content = fs.readFileSync(dockerfilePath, 'utf8');
        const lines = content.split('\n');

        const result = {
            nodeVersion: null,
            isSlim: false,
            rubyVersion: null,
            isRubyImage: false
        };

        // Parse first line for base image
        const fromLine = lines.find(line => line.trim().startsWith('FROM'));
        if (fromLine) {
            const fromMatch = fromLine.match(/FROM\s+(.+)/);
            if (fromMatch) {
                const baseImage = fromMatch[1].trim();

                // Check if it's a base node image
                const nodeMatch = baseImage.match(/^node:(.+)$/);
                if (nodeMatch) {
                    const version = nodeMatch[1];
                    if (version === 'latest') {
                        result.nodeVersion = 'latest';
                    } else if (version.endsWith('-slim')) {
                        result.nodeVersion = version.replace('-slim', '');
                        result.isSlim = true;
                    } else {
                        result.nodeVersion = version;
                    }
                }

                // Check if it's a Ruby image (based on our own base image)
                const rubyMatch = baseImage.match(/^kula\/node-rbenv:(.+)$/);
                if (rubyMatch) {
                    result.isRubyImage = true;
                    const nodeVersion = rubyMatch[1];
                    if (nodeVersion.includes('-slim')) {
                        result.nodeVersion = nodeVersion.replace('-slim', '');
                        result.isSlim = true;
                    } else {
                        result.nodeVersion = nodeVersion;
                    }
                }
            }
        }

        // Parse Ruby version from ENV line
        const rubyEnvLine = lines.find(line => line.trim().startsWith('ENV RUBY_VERSION'));
        if (rubyEnvLine) {
            const rubyMatch = rubyEnvLine.match(/ENV\s+RUBY_VERSION\s+(.+)/);
            if (rubyMatch) {
                result.rubyVersion = rubyMatch[1].trim();
            }
        }

        return result;
    } catch (error) {
        console.error(`Error parsing ${dockerfilePath}:`, error.message);
        return null;
    }
}

/**
 * Generate tags for a matrix entry
 * @param {string} nodeVersion - Node.js version (e.g., "20.19.5")
 * @param {boolean} isSlim - Whether it's a slim variant
 * @param {string} rubyVersion - Ruby version (e.g., "3.4.5"), null if no Ruby
 * @returns {string[]} Array of tags
 */
function generateTags(nodeVersion, isSlim, rubyVersion) {
    const tags = [];

    if (nodeVersion === 'latest') {
        tags.push('kula/node-rbenv:latest');
        return tags;
    }

    // Parse version components
    const versionParts = nodeVersion.split('.');
    const major = versionParts[0];
    const minor = versionParts.slice(0, 2).join('.');
    const patch = nodeVersion;

    const slimSuffix = isSlim ? '-slim' : '';
    const rubySuffix = rubyVersion ? '-ruby3' : '';

    if (!rubyVersion) {
        // Base Node.js tags
        tags.push(`kula/node-rbenv:${major}${slimSuffix}`);
        tags.push(`kula/node-rbenv:${minor}${slimSuffix}`);
        tags.push(`kula/node-rbenv:${patch}${slimSuffix}`);
    } else {
        // Ruby version tags
        const rubyParts = rubyVersion.split('.');
        const rubyMajorMinor = rubyParts.slice(0, 2).join('.');

        // Basic ruby tags
        tags.push(`kula/node-rbenv:${major}${slimSuffix}${rubySuffix}`);
        tags.push(`kula/node-rbenv:${minor}${slimSuffix}${rubySuffix}`);
        tags.push(`kula/node-rbenv:${patch}${slimSuffix}${rubySuffix}`);

        // Specific ruby version tags
        tags.push(`kula/node-rbenv:${major}${slimSuffix}-ruby${rubyMajorMinor}`);
        tags.push(`kula/node-rbenv:${minor}${slimSuffix}-ruby${rubyMajorMinor}`);
        tags.push(`kula/node-rbenv:${patch}${slimSuffix}-ruby${rubyMajorMinor}`);
        tags.push(`kula/node-rbenv:${major}${slimSuffix}-ruby${rubyVersion}`);
        tags.push(`kula/node-rbenv:${minor}${slimSuffix}-ruby${rubyVersion}`);
        tags.push(`kula/node-rbenv:${patch}${slimSuffix}-ruby${rubyVersion}`);
    }

    return tags;
}

/**
 * Scan directory structure and generate matrix
 * @param {string} baseDir - Base directory containing images
 * @returns {object[]} Matrix array
 */
function generateMatrix(baseDir = 'images') {
    const matrix = [];
    const nodeRbenvDir = path.join(baseDir, 'node-rbenv');

    if (!fs.existsSync(nodeRbenvDir)) {
        console.error(`Directory ${nodeRbenvDir} does not exist`);
        return matrix;
    }

    const directories = fs.readdirSync(nodeRbenvDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort();

    for (const dir of directories) {
        const dirPath = path.join(nodeRbenvDir, dir);
        const dockerfilePath = path.join(dirPath, 'Dockerfile');

        // Check if there's a Dockerfile in this directory
        if (fs.existsSync(dockerfilePath)) {
            const dockerInfo = parseDockerfile(dockerfilePath);

            if (dockerInfo && dockerInfo.nodeVersion) {
                const context = `node-rbenv/${dir}`;
                const tags = generateTags(dockerInfo.nodeVersion, dockerInfo.isSlim, null);

                matrix.push({
                    image: 'node-rbenv',
                    context: context,
                    tags: tags.join('\n')
                });

                // Check for Ruby subdirectory
                const rubyDir = path.join(dirPath, 'ruby-3');
                const rubyDockerfilePath = path.join(rubyDir, 'Dockerfile');

                if (fs.existsSync(rubyDockerfilePath)) {
                    const rubyDockerInfo = parseDockerfile(rubyDockerfilePath);

                    if (rubyDockerInfo && rubyDockerInfo.rubyVersion) {
                        const rubyContext = `${context}/ruby-3`;
                        const rubyTags = generateTags(dockerInfo.nodeVersion, dockerInfo.isSlim, rubyDockerInfo.rubyVersion);

                        matrix.push({
                            image: 'node-rbenv',
                            context: rubyContext,
                            tags: rubyTags.join('\n')
                        });
                    }
                }
            }
        }
    }

    return matrix;
}

/**
 * Main function to generate and output matrix
 */
function main() {
    try {
        const matrix = generateMatrix();

        console.log('Generated matrix:');
        console.log(JSON.stringify({ include: matrix }, null, 2));

        return matrix;
    } catch (error) {
        console.error('Error generating matrix:', error);
        process.exit(1);
    }
}

// Export for testing
module.exports = {
    parseDockerfile,
    generateTags,
    generateMatrix,
    main
};

// Run if called directly
if (require.main === module) {
    main();
}
