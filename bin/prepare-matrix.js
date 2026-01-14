const fs = require("fs");
const path = require("path");

/**
 * The index of images in this repository
 * @type {{
 *   name: string,
 *   platforms: string[] | undefined,
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
    name: "android-build-box",
    platforms: ["linux/amd64"],
    variants: [
      {
        name: "latest",
      },
    ],
  },
  {
    name: "atlas-app-services-cli",
    variants: [
      {
        name: "latest",
      },
    ],
  },
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
    name: "golang-toolbox",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
      },
    ],
  },
  {
    name: "itms-transporter",
    platforms: ["linux/amd64"],
    variants: [
      {
        name: "bookworm",
        latest: true,
      },
    ],
  },
  {
    name: "jq",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
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
        latest: true,
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
        latest: true,
      },
    ],
  },
  {
    name: "tree",
    variants: [
      {
        name: "alpine",
        latest: true,
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
  // e.g. ARG RUBY_VERSION=3.4.5
  const match = content.match(
    /ARG\s+RUBY_VERSION=([0-9]+)\.([0-9]+)\.([0-9]+)/
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
  // e.g. ARG NODE_VERSION=20.19.5 or ARG NODE_VERSION=20.19.5-slim
  const match = content.match(
    /ARG\s+NODE_VERSION=([0-9]+)\.([0-9]+)\.([0-9]+)(?:-[^\s]+)?/
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
    if (!node) {
      let tags = [`kula/${image.name}:${variant.name}`];
      if (variant.latest) {
        tags.push(`kula/${image.name}:latest`);
      }
      return tags;
    }

    // For node variants, include slim suffix if present
    const variantSuffix = variant.name.includes("-slim") ? "-slim" : "";
    let tags = [
      `kula/${image.name}:${node.major}${variantSuffix}`,
      `kula/${image.name}:${node.minor}${variantSuffix}`,
      `kula/${image.name}:${node.patch}${variantSuffix}`,
    ];
    if (variant.latest) {
      tags.push(`kula/${image.name}:latest`);
    }
    return tags;
  }

  // Subvariant tags: include ruby suffixes with node versions
  const ruby = getRubySemver(image.name, variant.name, subvariant?.name);
  if (!node || !ruby) {
    let tags = [`kula/${image.name}:${variant.name}-${subvariant.name}`];
    if (variant.latest) {
      tags.push(`kula/${image.name}:latest`);
    }
    return tags;
  }

  const variantSuffix = variant.name.includes("-slim") ? "-slim" : "";
  let tags = [];
  for (const nodeVersion of [node.major, node.minor, node.patch]) {
    for (const rubyVersion of [ruby.major, ruby.minor, ruby.patch]) {
      tags.push(
        `kula/${image.name}:${nodeVersion}${variantSuffix}-ruby${rubyVersion}`
      );
    }
  }
  return tags;
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
 * @returns {{image: string, context: string, tags: string[], platforms: string | undefined}[]} Matrix array
 */
function generateMatrix() {
  const matrix = [];
  for (const image of images) {
    for (const variant of image.variants) {
      const entry = {
        id: `${image.name}-${variant.name}`,
        image: image.name,
        context: getContext(image, variant),
        tags: generateTags(image, variant).join("\n"),
      };
      if (image.platforms) {
        entry.platforms = JSON.stringify(image.platforms);
      }
      matrix.push(entry);
      if (variant.subvariants) {
        for (const subvariant of variant.subvariants) {
          const subEntry = {
            id: `${image.name}-${variant.name}-${subvariant.name}`,
            image: image.name,
            context: getContext(image, variant, subvariant),
            tags: generateTags(image, variant, subvariant).join("\n"),
          };
          if (image.platforms) {
            subEntry.platforms = JSON.stringify(image.platforms);
          }
          matrix.push(subEntry);
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
