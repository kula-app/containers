const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const { generateMatrix, images } = require("../bin/prepare-matrix.js");

test("images contains all known images and variants", () => {
  assert.deepEqual(images, [
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

test("generateMatrix includes all variants of curl", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "curl");
  assert.deepStrictEqual(
    entries[0],
    {
      id: "curl-alpine",
      image: "curl",
      context: "images/curl/alpine",
      tags: "kula/curl:alpine",
    },
    `matrix should include curl, found: ${entries[0].tags}`
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
      tags: "kula/jq:bookworm",
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
      tags: "kula/lftp:bookworm",
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
      tags: [
        "kula/node-rbenv:20",
        "kula/node-rbenv:20.19",
        "kula/node-rbenv:20.19.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[0].tags}`
  );
  assert.deepStrictEqual(
    entries[1],
    {
      id: "node-rbenv-node-20-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20/ruby-3",
      tags: [
        "kula/node-rbenv:20.19",
        "kula/node-rbenv:20.19-ruby3",
        "kula/node-rbenv:20.19.5-ruby3",
        "kula/node-rbenv:20.19-ruby3.4",
        "kula/node-rbenv:20.19.5-ruby3.4",
        "kula/node-rbenv:20.19-ruby3.4.5",
        "kula/node-rbenv:20.19.5-ruby3.4.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[1].tags}`
  );
  assert.deepStrictEqual(
    entries[2],
    {
      id: "node-rbenv-node-20-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20-slim",
      tags: [
        "kula/node-rbenv:20",
        "kula/node-rbenv:20.19",
        "kula/node-rbenv:20.19.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[2].tags}`
  );
  assert.deepStrictEqual(
    entries[3],
    {
      id: "node-rbenv-node-20-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-20-slim/ruby-3",
      tags: [
        "kula/node-rbenv:20.19",
        "kula/node-rbenv:20.19-ruby3",
        "kula/node-rbenv:20.19.5-ruby3",
        "kula/node-rbenv:20.19-ruby3.4",
        "kula/node-rbenv:20.19.5-ruby3.4",
        "kula/node-rbenv:20.19-ruby3.4.5",
        "kula/node-rbenv:20.19.5-ruby3.4.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[3].tags}`
  );
  assert.deepStrictEqual(
    entries[4],
    {
      id: "node-rbenv-node-22",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22",
      tags: [
        "kula/node-rbenv:22",
        "kula/node-rbenv:22.20",
        "kula/node-rbenv:22.20.0",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[4].tags}`
  );
  assert.deepStrictEqual(
    entries[5],
    {
      id: "node-rbenv-node-22-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22/ruby-3",
      tags: [
        "kula/node-rbenv:22.20",
        "kula/node-rbenv:22.20-ruby3",
        "kula/node-rbenv:22.20.0-ruby3",
        "kula/node-rbenv:22.20-ruby3.4",
        "kula/node-rbenv:22.20.0-ruby3.4",
        "kula/node-rbenv:22.20-ruby3.4.5",
        "kula/node-rbenv:22.20.0-ruby3.4.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[5].tags}`
  );
  assert.deepStrictEqual(
    entries[6],
    {
      id: "node-rbenv-node-22-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22-slim",
      tags: [
        "kula/node-rbenv:22",
        "kula/node-rbenv:22.20",
        "kula/node-rbenv:22.20.0",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[6].tags}`
  );
  assert.deepStrictEqual(
    entries[7],
    {
      id: "node-rbenv-node-22-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-22-slim/ruby-3",
      tags: [
        "kula/node-rbenv:22.20",
        "kula/node-rbenv:22.20-ruby3",
        "kula/node-rbenv:22.20.0-ruby3",
        "kula/node-rbenv:22.20-ruby3.4",
        "kula/node-rbenv:22.20.0-ruby3.4",
        "kula/node-rbenv:22.20-ruby3.4.5",
        "kula/node-rbenv:22.20.0-ruby3.4.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[7].tags}`
  );
  assert.deepStrictEqual(
    entries[8],
    {
      id: "node-rbenv-node-24",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24",
      tags: [
        "kula/node-rbenv:24",
        "kula/node-rbenv:24.9",
        "kula/node-rbenv:24.9.0",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[8].tags}`
  );
  assert.deepStrictEqual(
    entries[9],
    {
      id: "node-rbenv-node-24-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24/ruby-3",
      tags: [
        "kula/node-rbenv:24.9",
        "kula/node-rbenv:24.9-ruby3",
        "kula/node-rbenv:24.9.0-ruby3",
        "kula/node-rbenv:24.9-ruby3.4",
        "kula/node-rbenv:24.9.0-ruby3.4",
        "kula/node-rbenv:24.9-ruby3.4.5",
        "kula/node-rbenv:24.9.0-ruby3.4.5",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[9].tags}`
  );
  assert.deepStrictEqual(
    entries[10],
    {
      id: "node-rbenv-node-24-slim",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24-slim",
      tags: [
        "kula/node-rbenv:24",
        "kula/node-rbenv:24.9",
        "kula/node-rbenv:24.9.0",
      ].join("\n"),
    },
    `matrix should include node-rbenv, found: ${entries[10].tags}`
  );
  assert.deepStrictEqual(
    entries[11],
    {
      id: "node-rbenv-node-24-slim-ruby-3",
      image: "node-rbenv",
      context: "images/node-rbenv/node-24-slim/ruby-3",
      tags: [
        "kula/node-rbenv:24.9",
        "kula/node-rbenv:24.9-ruby3",
        "kula/node-rbenv:24.9.0-ruby3",
        "kula/node-rbenv:24.9-ruby3.4",
        "kula/node-rbenv:24.9.0-ruby3.4",
        "kula/node-rbenv:24.9-ruby3.4.5",
        "kula/node-rbenv:24.9.0-ruby3.4.5",
      ].join("\n"),
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
      tags: "kula/pulumi-toolbox:bookworm",
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

test("generateMatrix includes all variants of rsync", () => {
  const matrix = generateMatrix();
  const entries = matrix.filter((item) => item.image === "rsync");
  assert.deepStrictEqual(entries[0], {
    id: "rsync-alpine",
    image: "rsync",
    context: "images/rsync/alpine",
    tags: "kula/rsync:alpine",
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
    tags: "kula/tree:alpine",
  });
});
