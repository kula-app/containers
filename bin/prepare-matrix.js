const fs = require("fs");
const path = require("path");

/**
 * The index of images in this repository
 * @type {{
 *   name: string,
 *   variants: {
 *     name: string,
 *     subvariants: {
 *       name: string
 *     }[] | undefined
 *   }[]
 * }[]}
 */
const images = [
  {
    name: "curl",
    variants: [
      {
        name: "alpine",
        latest: true,
      },
    ],
  },
  {
    name: "jq",
    variants: [
      {
        name: "alpine",
        latest: true,
      },
      {
        name: "bookworm",
      },
    ],
  },
  {
    name: "lftp",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
      },
      {
        name: "bullseye",
      },
    ],
  },
  {
    name: "node-rbenv",
    variants: [
      {
        name: "node-20",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-20-slim",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-22",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-22-slim",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-24",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-24-slim",
        subvariants: [
          {
            name: "ruby-3",
          },
        ],
      },
      {
        name: "node-latest",
      },
    ],
  },
  {
    name: "pulumi-toolbox",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
      },
      {
        name: "bookworm-rbenv",
      },
    ],
  },
  {
    name: "rsync",
    variants: [
      {
        name: "alpine",
      },
    ],
  },
  {
    name: "tree",
    variants: [
      {
        name: "alpine",
      },
    ],
  },
];

/** @type {(image: string, variant: string, subvariant: string | undefined) => string | null} */
function getDockerfileContent(image, variant, subvariant) {
  let dockerfilePath = path.join(__dirname, "..", "images", image, variant);
  if (subvariant) {
    dockerfilePath = path.join(dockerfilePath, subvariant);
  }
  dockerfilePath = path.join(dockerfilePath, "Dockerfile");

  if (!fs.existsSync(dockerfilePath)) {
    return null;
  }
  return fs.readFileSync(dockerfilePath, "utf8");
}

/** @type {(image: string, variant: string, subvariant: string | undefined) => {major: string, minor: string, patch: string} | null} */
function getRubySemver(image, variant, subvariant) {
  const content = getDockerfileContent(image, variant, subvariant);
  if (!content) {
    return null;
  }
  // e.g. ENV RUBY_VERSION 3.4.5
  const match = content.match(
    /ENV\s+RUBY_VERSION\s+([0-9]+)\.([0-9]+)\.([0-9]+)/
  );
  if (!match) return null;
  return {
    major: match[1],
    minor: `${match[1]}.${match[2]}`,
    patch: `${match[1]}.${match[2]}.${match[3]}`,
  };
}

/** @type {(image: string, variant: string, subvariant: string | undefined) => {major: string, minor: string, patch: string} | null} */
function getNodeSemver(image, variant, subvariant) {
  const content = getDockerfileContent(image, variant, subvariant);
  if (!content) {
    return null;
  }
  // e.g. FROM node:20.19.5 or FROM node:20.19.5-slim
  const match = content.match(
    /FROM\s+node:([0-9]+)\.([0-9]+)\.([0-9]+)(?:-[^\s]+)?/
  );
  if (!match) return null;
  return {
    major: match[1],
    minor: `${match[1]}.${match[2]}`,
    patch: `${match[1]}.${match[2]}.${match[3]}`,
  };
}

/** @type {(image: string, variant: string, subvariant: string | undefined) => string[]} */
function generateTags(image, variant, subvariant) {
  // Default behavior for non node-rbenv images: single tag "{variant}"
  // node-latest is special-cased to a single tag
  if (variant.name === "node-latest") {
    return ["kula/node-rbenv:latest"];
  }

  // For subvariants, derive Node version from the base variant Dockerfile (not the subvariant Dockerfile)
  const node = getNodeSemver(image.name, variant.name, undefined);
  if (!subvariant) {
    // Base variant tags: major, minor, patch (no "-slim" suffix in tags per tests)
    if (!node) return [`kula/${image.name}:${variant.name}`];
    return [
      `kula/${image.name}:${node.major}`,
      `kula/${image.name}:${node.minor}`,
      `kula/${image.name}:${node.patch}`,
    ];
  }

  // Subvariant tags: include node minor plain, and node minor/patch with ruby suffixes
  const ruby = getRubySemver(image.name, variant.name, subvariant?.name);
  if (!node || !ruby) {
    return [`kula/${image.name}:${variant.name}-${subvariant.name}`];
  }

  return [
    // plain node minor tag
    `kula/${image.name}:${node.minor}`,
    // ruby major
    `kula/${image.name}:${node.minor}-ruby${ruby.major}`,
    `kula/${image.name}:${node.patch}-ruby${ruby.major}`,
    // ruby minor
    `kula/${image.name}:${node.minor}-ruby${ruby.minor}`,
    `kula/${image.name}:${node.patch}-ruby${ruby.minor}`,
    // ruby patch
    `kula/${image.name}:${node.minor}-ruby${ruby.patch}`,
    `kula/${image.name}:${node.patch}-ruby${ruby.patch}`,
  ];
}

/**
 * Generate context for a matrix entry
 * @param {object} image - Image object
 * @param {object} variant - Variant object
 * @param {object | undefined} subvariant - Subvariant object
 * @returns {string} Context
 */
function getContext(image, variant, subvariant) {
  if (subvariant) {
    return `images/${image.name}/${variant.name}/${subvariant.name}`;
  }
  return `images/${image.name}/${variant.name}`;
}

/**
 * Scan directory structure and generate matrix
 * @returns {{image: string, context: string, tags: string[]}[]}} Matrix array
 */
function generateMatrix() {
  const matrix = [];
  for (const image of images) {
    for (const variant of image.variants) {
      // Always include the base variant entry first
      matrix.push({
        id: `${image.name}-${variant.name}`,
        image: image.name,
        context: getContext(image, variant),
        tags: generateTags(image, variant).join("\n"),
      });

      // Then include subvariants, if any
      if (variant.subvariants) {
        for (const subvariant of variant.subvariants) {
          matrix.push({
            id: `${image.name}-${variant.name}-${subvariant.name}`,
            image: image.name,
            context: getContext(image, variant, subvariant),
            tags: generateTags(image, variant, subvariant).join("\n"),
          });
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

    console.log("Generated matrix:");
    console.log(JSON.stringify({ include: matrix }, null, 2));

    return matrix;
  } catch (error) {
    console.error("Error generating matrix:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  images,
  generateMatrix,
};
