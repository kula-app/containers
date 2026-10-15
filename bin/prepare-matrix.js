/**
 * The index of images in this repository
 * @type {{
 *   name: string,
 *   platforms: string[] | undefined,
 *   variants: {
 *     name: string,
 *     latest?: boolean
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
    name: "base",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
      },
      {
        name: "trixie",
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
      {
        name: "trixie",
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
      {
        name: "trixie",
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
        name: "trixie",
      },
    ],
  },
  {
    name: "rcodesign",
    variants: [
      {
        name: "alpine",
      },
      {
        name: "bookworm",
        latest: true,
      },
      {
        name: "trixie",
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
        name: "trixie",
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

/** @type {(image: object, variant: object) => string[]} */
function generateTags(image, variant) {
  const tags = [`kula/${image.name}:${variant.name}`];
  if (variant.latest) {
    tags.push(`kula/${image.name}:latest`);
  }
  return tags;
}

/**
 * Generate context for a matrix entry
 * @param {object} image - Image object
 * @param {object} variant - Variant object
 * @returns {string} Context
 */
function getContext(image, variant) {
  return `images/${image.name}/${variant.name}`;
}

/**
 * Generate the build matrix for the image index
 * @returns {{id: string, image: string, context: string, tags: string, platforms?: string}[]} Matrix array
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
