# rcodesign

Container image with [`rcodesign`](https://github.com/indygreg/apple-platform-rs) (the CLI for the `apple-codesign` Rust crate), enabling signing and notarization of Apple binaries from Linux — no macOS runner required.

Bundled tools:

- `rcodesign` — sign Mach-O binaries, submit for notarization, staple notarization tickets
- `zip` — package Mach-O binaries for notary submission

## Variants

### Bookworm (Recommended)

Based on Debian Bookworm.

```sh
docker pull kula/rcodesign:latest
docker pull kula/rcodesign:bookworm
```

### Alpine

Minimal Alpine-based image for smaller footprint. `rcodesign` is a statically-linked musl binary, so no glibc is needed.

```sh
docker pull kula/rcodesign:alpine
```

## Usage

### Signing a Mach-O binary

```sh
docker run --rm -v "$(pwd):/workspace" kula/rcodesign:latest \
  rcodesign sign \
    --p12-file cert.p12 \
    --p12-password-file cert.pw \
    --code-signature-flags runtime \
    my-binary
```

### Submitting for notarization

```sh
docker run --rm -v "$(pwd):/workspace" kula/rcodesign:latest sh -c '
  zip -q my-binary.zip my-binary && \
  rcodesign notary-submit --api-key-file api_key.json --wait my-binary.zip
'
```

### GitHub Actions example

```yaml
jobs:
  sign:
    runs-on: ubuntu-latest
    container: kula/rcodesign:latest
    steps:
      - uses: actions/checkout@v6
      - name: Sign binary
        run: rcodesign sign --p12-file cert.p12 --p12-password-file cert.pw --code-signature-flags runtime dist/my-binary
```

## References

- [rcodesign documentation](https://gregoryszorc.com/docs/apple-codesign/stable/)
- [apple-platform-rs on GitHub](https://github.com/indygreg/apple-platform-rs)
