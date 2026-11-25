# MATH VALIDATION REQUIREMENTS

Date: 25 November 2026 · what is still needed before the mathematics can be called validated

| # | Requirement | Who | Status |
|---|---|---|---|
| 1 | Independent verification of RTP, hit frequency, feature frequencies and maximum win by an accredited test laboratory | laboratory, usually through the provider | NEEDS EXTERNAL VALIDATION |
| 2 | RNG certification (in production normally the provider's certified RNG replaces the demo generator) | laboratory / provider | NEEDS EXTERNAL VALIDATION |
| 3 | Statistical test battery for the demo RNG (e.g. TestU01, PractRand) | developer | NEEDS TESTING |
| 4 | Second statistical RTP sample on configuration 1.0.0 with a new seed | developer (compute time only) | NEEDS TESTING |
| 5 | Additional RTP configurations as expected by operators | developer, **owner's approval required** | IN PROGRESS (tooling ready, none built) |
| 6 | Volatility index on the provider's own scale | provider | NEEDS EXTERNAL VALIDATION |
| 7 | Share of win removed by the 10,000× cap | developer | NEEDS TESTING |
| 8 | Cross-check by full enumeration on a miniature grid | developer | NEEDS TESTING |
| 9 | Game-rule and display review per jurisdiction (RTP disclosure, buy feature, autoplay, minimum spin time) | provider / compliance | NEEDS EXTERNAL VALIDATION |
| 10 | Decision whether the buy feature should match the base RTP | owner | open decision |

What a laboratory can build on [FACT]: deterministic engine, frozen configuration with hash,
documented list of random draws, reproducible reports with seeds, a second implementation, and
replay of any round from seed and picks.
