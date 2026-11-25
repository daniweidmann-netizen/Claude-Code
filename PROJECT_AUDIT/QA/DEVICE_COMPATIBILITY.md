# DEVICE COMPATIBILITY

Date: 25 November 2026 · only what was actually run

| Device / browser | Type of test | Result | Notes |
|---|---|---|---|
| Chromium (Playwright, headless, software rendering) at 10 viewport sizes | automated | PASS | frame rate 9–17 fps is an artefact of software rendering |
| Chromium at device pixel ratio 3 | automated | PASS | sharp rendering path |
| iPhone 15 Pro | manual, by the owner, 25 Nov 2026 | "very good" | personal impression; browser, iOS version, frame rate, orientation change and app-switch behaviour not reported |
| Single-file build on iPhone | manual, by the owner | FAIL – does not open | use the hosted version |
| Android phone | – | NOT EXECUTED | – |
| iPad / Android tablet | – | NOT EXECUTED | tablet viewport passes in Chromium only |
| Desktop Safari | – | NOT EXECUTED | – |
| Desktop Firefox | – | NOT EXECUTED | – |
| Desktop Edge / Chrome with GPU | – | NOT EXECUTED | – |
| Slow network, low-end device | – | NOT EXECUTED | delivery about 5.6 MB |

Technical requirements of the demo [FACT]: WebGL or canvas, Web Audio, WebP images, ES modules.
All are available in current browsers; this is a statement about requirements, not a test result.

To complete the matrix: play 20 rounds per device, open **i → Performance**, note frame rate,
rotate the device, switch apps and return, trigger a Temple Bonus with `?present=temple`.
