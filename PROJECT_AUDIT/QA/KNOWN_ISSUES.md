# KNOWN ISSUES

Date: 25 November 2026

| ID | Issue | Severity | Affects | Workaround / plan |
|---|---|---|---|---|
| K1 | No recovery of an interrupted round: a reload starts the demo fresh (verified) | high for production, none for a demo | production | needs a server; part of integration |
| K2 | Tested on one real device only | high | presentation | complete the device matrix |
| K3 | Single-file build does not open on iPhone | low | demo distribution | hosted link |
| K4 | First load about 5.6 MB | medium | mobile networks | lazy loading (not built) |
| K5 | Symbols are 256 px stills | medium | large screens | higher-resolution or reworked art |
| K6 | Frame image squeezed about 10 % | low | visual | redraw frame |
| K7 | Licence notices not in the build | low | distribution | add before hand-over |
| K8 | Free-spin summary wording "highest multiplier" can confuse | low | clarity | reword |
| K9 | Two effects shorter than requested; loops not on bar lines | low | audio | owner did not object |
| K10 | In a production build the developer-tool text strings remain (unreachable) | low | hygiene | remove from the string table |
| K11 | Buy feature RTP differs from base RTP | owner's decision | provider questions | disclose; can be changed with approval |

No known defect in game logic, cluster evaluation or accounting.
