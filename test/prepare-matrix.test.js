const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { generateMatrix, images } = require("../bin/prepare-matrix.js");

test("images contains all known images and variants", () => {
  assert.deepEqual(images, [
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
  ]);
});

test("generateMatrix offers both supported Debian flavors", () => {
  const matrix = generateMatrix();
  for (const image of [
    "base",
    "golang-toolbox",
    "jq",
    "lftp",
    "pulumi-toolbox",
    "rcodesign",
  ]) {
    for (const distro of ["bookworm", "trixie"]) {
      const entry = matrix.find(
        (item) => item.context === `images/${image}/${distro}`
      );
      assert.ok(entry, `${image} must offer ${distro}`);
      assert.ok(entry.tags.split("\n").includes(`kula/${image}:${distro}`));
    }
  }
  assert.ok(!matrix.some((item) => item.context.includes("bullseye")));
});

test("every matrix context has a buildable Dockerfile path", () => {
  for (const entry of generateMatrix()) {
    assert.ok(
      fs.existsSync(path.join(__dirname, "..", entry.context, "Dockerfile")),
      entry.context
    );
  }
});

test("matrix contexts match all repository Dockerfiles", () => {
  const root = path.join(__dirname, "..");
  function dockerfileContexts(directory) {
    return fs
      .readdirSync(path.join(root, directory), { withFileTypes: true })
      .flatMap((entry) => {
        const entryPath = `${directory}/${entry.name}`;
        if (entry.isDirectory()) {
          return dockerfileContexts(entryPath);
        }
        return entry.name === "Dockerfile" ? [directory] : [];
      });
  }

  assert.deepEqual(
    generateMatrix()
      .map((entry) => entry.context)
      .sort(),
    dockerfileContexts("images").sort()
  );
});

test("generateMatrix returns expected structure", () => {
  const matrix = generateMatrix();
  assert.notEqual(matrix, undefined, "matrix should not be undefined");
  assert.ok(Array.isArray(matrix), "matrix should be an array");
  assert.ok(matrix.length > 0, "matrix should not be empty");
});

test("generateMatrix includes all images and variants", () => {
  const matrix = generateMatrix();
  for (const image of images) {
    for (const variant of image.variants) {
      assert.ok(
        matrix.some(
          (item) =>
            item.image === image.name &&
            item.context === `images/${image.name}/${variant.name}`
        ),
        `matrix should include ${image.name}, found: ${matrix.length}`
      );
    }
  }
});

test("generateMatrix includes all variants of android-build-box", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "android-build-box");
  assert.deepStrictEqual(entries[0], {
    id: "android-build-box-latest",
    image: "android-build-box",
    context: "images/android-build-box/latest",
    tags: "kula/android-build-box:latest",
    platforms: '["linux/amd64"]',
  });
  assert.equal(entries.length, 1);
});

test("generateMatrix includes all variants of base", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "base");
  assert.deepStrictEqual(entries[0], {
    id: "base-alpine",
    image: "base",
    context: "images/base/alpine",
    tags: "kula/base:alpine",
  });
  assert.deepStrictEqual(entries[1], {
    id: "base-bookworm",
    image: "base",
    context: "images/base/bookworm",
    tags: ["kula/base:bookworm", "kula/base:latest"].join("\n"),
  });
  assert.deepStrictEqual(entries[2], {
    id: "base-trixie",
    image: "base",
    context: "images/base/trixie",
    tags: "kula/base:trixie",
  });
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of curl", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "curl");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "curl-alpine",
      image: "curl",
      context: "images/curl/alpine",
      tags: ["kula/curl:alpine", "kula/curl:latest"].join("\n"),
    },
    `matrix should include curl, found: ${entries[0].tags}`
  );
  assert.equal(entries.length, 1);
});

test("generateMatrix includes all variants of golang-toolbox", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "golang-toolbox");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "golang-toolbox-alpine",
      image: "golang-toolbox",
      context: "images/golang-toolbox/alpine",
      tags: "kula/golang-toolbox:alpine",
    },
    `matrix should include golang-toolbox, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "golang-toolbox-bookworm",
      image: "golang-toolbox",
      context: "images/golang-toolbox/bookworm",
      tags: ["kula/golang-toolbox:bookworm", "kula/golang-toolbox:latest"].join("\n"),
    },
    `matrix should include golang-toolbox, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(
    entries[2],
    {
      id: "golang-toolbox-trixie",
      image: "golang-toolbox",
      context: "images/golang-toolbox/trixie",
      tags: "kula/golang-toolbox:trixie",
    },
    `matrix should include golang-toolbox, found: ${entries[2].tags}`
  );
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of jq", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "jq");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "jq-alpine",
      image: "jq",
      context: "images/jq/alpine",
      tags: "kula/jq:alpine",
    },
    `matrix should include jq, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "jq-bookworm",
      image: "jq",
      context: "images/jq/bookworm",
      tags: ["kula/jq:bookworm", "kula/jq:latest"].join("\n"),
    },
    `matrix should include jq, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(entries[2], {
    id: "jq-trixie",
    image: "jq",
    context: "images/jq/trixie",
    tags: "kula/jq:trixie",
  });
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of lftp", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "lftp");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "lftp-alpine",
      image: "lftp",
      context: "images/lftp/alpine",
      tags: "kula/lftp:alpine",
    },
    `matrix should include lftp, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "lftp-bookworm",
      image: "lftp",
      context: "images/lftp/bookworm",
      tags: ["kula/lftp:bookworm", "kula/lftp:latest"].join("\n"),
    },
    `matrix should include lftp, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(
    entries[2],
    {
      id: "lftp-trixie",
      image: "lftp",
      context: "images/lftp/trixie",
      tags: "kula/lftp:trixie",
    },
    `matrix should include lftp, found: ${entries[2].tags}`
  );
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of pulumi-toolbox", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "pulumi-toolbox");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "pulumi-toolbox-alpine",
      image: "pulumi-toolbox",
      context: "images/pulumi-toolbox/alpine",
      tags: "kula/pulumi-toolbox:alpine",
    },
    `matrix should include pulumi-toolbox, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "pulumi-toolbox-bookworm",
      image: "pulumi-toolbox",
      context: "images/pulumi-toolbox/bookworm",
      tags: ["kula/pulumi-toolbox:bookworm", "kula/pulumi-toolbox:latest"].join(
        "\n"
      ),
    },
    `matrix should include pulumi-toolbox, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(
    entries[3],
    {
      id: "pulumi-toolbox-bookworm-rbenv",
      image: "pulumi-toolbox",
      context: "images/pulumi-toolbox/bookworm-rbenv",
      tags: "kula/pulumi-toolbox:bookworm-rbenv",
    },
    `matrix should include pulumi-toolbox, found: ${entries[3].tags}`
  );
  assert.deepStrictEqual(entries[2], {
    id: "pulumi-toolbox-trixie",
    image: "pulumi-toolbox",
    context: "images/pulumi-toolbox/trixie",
    tags: "kula/pulumi-toolbox:trixie",
  });
  assert.equal(entries.length, 4);
});

test("generateMatrix includes all variants of rcodesign", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "rcodesign");
  assert.deepStrictEqual(entries[0], {
    id: "rcodesign-alpine",
    image: "rcodesign",
    context: "images/rcodesign/alpine",
    tags: "kula/rcodesign:alpine",
  });
  assert.deepStrictEqual(entries[1], {
    id: "rcodesign-bookworm",
    image: "rcodesign",
    context: "images/rcodesign/bookworm",
    tags: ["kula/rcodesign:bookworm", "kula/rcodesign:latest"].join("\n"),
  });
  assert.deepStrictEqual(entries[2], {
    id: "rcodesign-trixie",
    image: "rcodesign",
    context: "images/rcodesign/trixie",
    tags: "kula/rcodesign:trixie",
  });
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of rsync", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "rsync");
  assert.deepStrictEqual(entries[0], {
    id: "rsync-alpine",
    image: "rsync",
    context: "images/rsync/alpine",
    tags: ["kula/rsync:alpine", "kula/rsync:latest"].join("\n"),
  });
  assert.equal(entries.length, 1);
});

test("generateMatrix includes all variants of tree", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "tree");
  assert.deepStrictEqual(entries[0], {
    id: "tree-alpine",
    image: "tree",
    context: "images/tree/alpine",
    tags: ["kula/tree:alpine", "kula/tree:latest"].join("\n"),
  });
  assert.equal(entries.length, 1);
});
