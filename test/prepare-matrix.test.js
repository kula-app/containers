const test = require("node:test");
const assert = require("node:assert/strict");

const { generateMatrix, images } = require("../bin/prepare-matrix.js");

// renovate: datasource=github-releases depName=nodejs/node versioning=loose
const NODE_20_VERSION = "20.19.5";
// renovate: datasource=github-releases depName=nodejs/node versioning=loose
const NODE_22_VERSION = "22.23.0";
// renovate: datasource=github-releases depName=nodejs/node versioning=loose
const NODE_24_VERSION = "24.9.0";
// renovate: datasource=github-releases depName=ruby/ruby versioning=loose
const RUBY_3_VERSION = "3.4.5";

function semver(version) {
  const [major, minor, patch] = version.split(".");
  return { major, minor: `${major}.${minor}`, patch: `${major}.${minor}.${patch}` };
}

function nodeTags(version, suffix = "") {
  const v = semver(version);
  return [
    `kula/node-rbenv:${v.major}${suffix}`,
    `kula/node-rbenv:${v.minor}${suffix}`,
    `kula/node-rbenv:${v.patch}${suffix}`,
  ];
}

function nodeRubyTags(nodeVersion, rubyVersion, suffix = "") {
  const n = semver(nodeVersion);
  const r = semver(rubyVersion);
  const tags = [];
  for (const nv of [n.major, n.minor, n.patch]) {
    for (const rv of [r.major, r.minor, r.patch]) {
      tags.push(`kula/node-rbenv:${nv}${suffix}-ruby${rv}`);
    }
  }
  return tags;
}

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
      name: "rcodesign",
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
  ]);
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

test("generateMatrix includes all variants of itms-transporter", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "itms-transporter");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "itms-transporter-bookworm",
      image: "itms-transporter",
      context: "images/itms-transporter/bookworm",
      tags: ["kula/itms-transporter:bookworm", "kula/itms-transporter:latest"].join("\n"),
      platforms: '["linux/amd64"]',
    },
    `matrix should include itms-transporter, found: ${entries[0].tags}`
  );
  assert.equal(entries.length, 1);
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
  assert.equal(entries.length, 2);
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
      id: "lftp-bullseye",
      image: "lftp",
      context: "images/lftp/bullseye",
      tags: "kula/lftp:bullseye",
    },
    `matrix should include lftp, found: ${entries[2].tags}`
  );
  assert.equal(entries.length, 3);
});

test("generateMatrix includes all variants of node-rbenv", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "node-rbenv");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "node-rbenv-node-20",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20",
      tags: nodeTags(NODE_20_VERSION).join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "node-rbenv-node-20-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20/ruby-3",
      tags: nodeRubyTags(NODE_20_VERSION, RUBY_3_VERSION).join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(
    entries[2],
    {
      id: "node-rbenv-node-20-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20-slim",
      tags: nodeTags(NODE_20_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[2].tags}`
  );
  assert.deepStrictEqual(
    entries[3],
    {
      id: "node-rbenv-node-20-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20-slim/ruby-3",
      tags: nodeRubyTags(NODE_20_VERSION, RUBY_3_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[3].tags}`
  );
  assert.deepStrictEqual(
    entries[4],
    {
      id: "node-rbenv-node-22",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22",
      tags: nodeTags(NODE_22_VERSION).join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[4].tags}`
  );
  assert.deepStrictEqual(
    entries[5],
    {
      id: "node-rbenv-node-22-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22/ruby-3",
      tags: nodeRubyTags(NODE_22_VERSION, RUBY_3_VERSION).join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[5].tags}`
  );
  assert.deepStrictEqual(
    entries[6],
    {
      id: "node-rbenv-node-22-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22-slim",
      tags: nodeTags(NODE_22_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[6].tags}`
  );
  assert.deepStrictEqual(
    entries[7],
    {
      id: "node-rbenv-node-22-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22-slim/ruby-3",
      tags: nodeRubyTags(NODE_22_VERSION, RUBY_3_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[7].tags}`
  );
  assert.deepStrictEqual(
    entries[8],
    {
      id: "node-rbenv-node-24",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24",
      tags: [...nodeTags(NODE_24_VERSION), "kula/node-rbenv:latest"].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[8].tags}`
  );
  assert.deepStrictEqual(
    entries[9],
    {
      id: "node-rbenv-node-24-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24/ruby-3",
      tags: nodeRubyTags(NODE_24_VERSION, RUBY_3_VERSION).join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[9].tags}`
  );
  assert.deepStrictEqual(
    entries[10],
    {
      id: "node-rbenv-node-24-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24-slim",
      tags: nodeTags(NODE_24_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[10].tags}`
  );
  assert.deepStrictEqual(
    entries[11],
    {
      id: "node-rbenv-node-24-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24-slim/ruby-3",
      tags: nodeRubyTags(NODE_24_VERSION, RUBY_3_VERSION, "-slim").join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[11].tags}`
  );
  assert.deepStrictEqual(
    entries[12],
    {
      id: "node-rbenv-node-latest",
      image: "node-rbenv",
      context: "images/node-rbenv/node-latest",
      tags: "kula/node-rbenv:latest",
    },
    `matrix should include node-rbenv, found: ${entries[12].tags}`
  );
  assert.equal(entries.length, 13);
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
    entries[2],
    {
      id: "pulumi-toolbox-bookworm-rbenv",
      image: "pulumi-toolbox",
      context: "images/pulumi-toolbox/bookworm-rbenv",
      tags: "kula/pulumi-toolbox:bookworm-rbenv",
    },
    `matrix should include pulumi-toolbox, found: ${entries[2].tags}`
  );
  assert.equal(entries.length, 3);
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
  assert.equal(entries.length, 2);
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
