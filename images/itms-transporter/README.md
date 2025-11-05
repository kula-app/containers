# ITMS Transporter

Docker image with Apple's ITMS Transporter for uploading and managing media assets on the Apple App Store.

## Supported Architectures

This image is built for:

- `linux/amd64` (x86_64)

Note: Apple's iTMSTransporter only provides x86_64 binaries for Linux. ARM64 systems can run this image through emulation.

## What is ITMS Transporter?

iTMSTransporter is Apple's official command-line tool for uploading and managing media assets (apps, music, movies, books, etc.) on the Apple App Store and other Apple services. It's commonly used in CI/CD pipelines for automated app deployment.

## License

This Docker image packages Apple's iTMSTransporter tool. Please refer to Apple's terms of service and license agreements for the use of iTMSTransporter.

## Links

- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [iTunes Connect Transporter Documentation](https://help.apple.com/itc/transporteruserguide/)
- [Creating App-Specific Passwords](https://support.apple.com/en-us/HT204397)

## Maintainer

kula app GmbH <opensource@kula.app>
