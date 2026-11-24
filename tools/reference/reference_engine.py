#!/usr/bin/env python3
"""Independent reference implementation of the round logic (GDD v1.1).

Written separately from the TypeScript engine, with a different data model
(columns as stacks, union-find clusters). Given the same configuration, seed
and stream it must produce exactly the same rounds; tools/reference/diff.sh
checks that. Not optimised - used for verification only.

usage: reference_engine.py <config.json> <seed> <stream> <rounds>
"""
import json
import sys

M64 = (1 << 64) - 1
WILD, COMPASS, KEY, EXPLORER = 5, 6, 7, 8
DRAWABLE = [0, 1, 2, 3, 4, WILD, COMPASS, KEY]


class Xoshiro256:
    def __init__(self, seed, stream):
        x = (seed ^ ((stream + 1) * 0xD1342543DE82EF95)) & M64
        self.s = []
        for _ in range(4):
            x = (x + 0x9E3779B97F4A7C15) & M64
            z = x
            z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & M64
            z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & M64
            self.s.append(z ^ (z >> 31))

    @staticmethod
    def _rotl(v, k):
        return ((v << k) | (v >> (64 - k))) & M64

    def next64(self):
        s = self.s
        result = (self._rotl((s[1] * 5) & M64, 7) * 9) & M64
        t = (s[1] << 17) & M64
        s[2] ^= s[0]
        s[3] ^= s[1]
        s[1] ^= s[2]
        s[0] ^= s[3]
        s[2] ^= t
        s[3] = self._rotl(s[3], 45)
        return result

    def next_int(self, n):
        threshold = (1 << 32) % n
        while True:
            hi = self.next64() >> 32
            if hi >= threshold:
                return hi % n


def weighted(rng, weights):
    r = rng.next_int(sum(weights))
    for i, w in enumerate(weights):
        if r < w:
            return i
        r -= w
    raise AssertionError


class Game:
    def __init__(self, cfg, rng):
        self.c, self.rng = cfg, rng
        self.cols_n, self.rows_n = cfg["cols"], cfg["rows"]

    # ---- one round -------------------------------------------------------
    def play(self, buy=False):
        c = self.c
        self.total = 0
        self.src = {"base": 0, "bonus": 0, "free": 0, "finale": 0}
        self.capped = False
        self.sun = 0
        self.base_camp = 0
        self.seals = 0
        self.fs_awarded = 0
        self.fs_left = 0
        self.fs_played = 0
        self.temple = False

        if buy:
            fb = c["featureBuy"]
            assert fb["enabled"]
            self.base_station, self.base_cascades = 0, 0
            self.award(fb["spins"], fb["baseCamp"])
        else:
            compass, self.base_station, self.base_cascades = self.spin(False)
        if not buy and not self.capped:
            for a in c["freeSpins"]["awards"]:
                if compass >= a["minCompass"]:
                    self.award(a["spins"], a["baseCamp"])
                    break
            if self.temple:
                self.bonus(c["templeBonus"]["base"], "bonus")
        if not self.capped:
            while self.fs_left > 0:
                self.fs_left -= 1
                self.fs_played += 1
                compass, _, _ = self.spin(True)
                if self.capped:
                    break
                if compass >= c["freeSpins"]["retriggerCompass"]:
                    self.award(c["freeSpins"]["retriggerSpins"], self.base_camp)
        if not self.capped and self.seals > 0:
            self.bonus(c["templeBonus"]["finale"][self.seals - 1], "finale")
        return (self.total, self.src["base"], self.src["bonus"], self.src["free"], self.src["finale"],
                self.base_station, self.base_cascades, self.fs_played)

    def add_win(self, amount, source):
        paid = min(amount, self.c["maxWin"] - self.total)
        self.total += paid
        self.src[source] += paid
        if self.total >= self.c["maxWin"]:
            self.capped = True

    def award(self, spins, base_camp):
        granted = min(spins, self.c["freeSpins"]["maxSpins"] - self.fs_awarded)
        self.fs_awarded += granted
        self.fs_left += granted
        self.base_camp = max(self.base_camp, base_camp)

    # ---- temple bonus ----------------------------------------------------
    def bonus(self, table, source):
        n = self.c["templeBonus"]["chambers"]
        weights = [p["weight"] for p in table]
        prizes, has_grand = [], False
        while len(prizes) < n:
            p = table[weighted(self.rng, weights)]
            if p["kind"] == "grand":
                if has_grand:
                    continue
                has_grand = True
            prizes.append(p)
        for i in range(n - 1, 0, -1):
            j = self.rng.next_int(i + 1)
            prizes[i], prizes[j] = prizes[j], prizes[i]
        for i, p in enumerate(prizes):  # always open the first closed chamber
            if p["kind"] == "freeSpins":
                f = self.c["templeBonus"]["bonusFreeSpins"]
                self.award(f["spins"], f["baseCamp"])
            else:
                self.add_win(p["value"], source)
            if p["kind"] != "relic" or self.capped:
                break

    # ---- one spin --------------------------------------------------------
    def cell(self, r, c):
        return self.cols[c][self.rows_n - 1 - r]

    def set_cell(self, r, c, v):
        self.cols[c][self.rows_n - 1 - r] = v

    def fill(self, weights):
        for col in self.cols:
            while len(col) < self.rows_n:
                col.append(DRAWABLE[weighted(self.rng, weights)])

    def random_pay_cell(self):
        cells = [(r, c) for r in range(self.rows_n) for c in range(self.cols_n) if self.cell(r, c) < 5]
        if not cells:
            return None
        return cells[self.rng.next_int(len(cells))]

    def station_effect(self, station, free):
        c = self.c
        if station == 1:
            for _ in range(c["discoveryWilds"]):
                p = self.random_pay_cell()
                if p is None:
                    break
                self.set_cell(p[0], p[1], WILD)
        elif station == 2:
            self.treasure = c["treasureMultiplier"]
        elif station == 3:
            p = self.random_pay_cell()
            if p is not None:
                self.set_cell(p[0], p[1], EXPLORER)
        elif station == 4:
            p = self.random_pay_cell()
            if p is not None:
                table = c["relicValuesFree"] if free else c["relicValues"]
                self.sun += table[weighted(self.rng, [t["weight"] for t in table])]["value"]
                self.set_cell(p[0], p[1], WILD)
        elif free:
            self.seals = min(c["freeSpins"]["maxSeals"], self.seals + 1)
        else:
            self.temple = True

    def clusters(self):
        R, C = self.rows_n, self.cols_n
        found = []
        for s in range(5):
            member = {(r, c) for r in range(R) for c in range(C) if self.cell(r, c) in (s, WILD, EXPLORER)}
            parent = {m: m for m in member}

            def root(x):
                while parent[x] != x:
                    parent[x] = parent[parent[x]]
                    x = parent[x]
                return x

            for (r, c) in member:
                for nb in ((r + 1, c), (r, c + 1)):
                    if nb in member:
                        parent[root((r, c))] = root(nb)
            groups = {}
            for m in member:
                groups.setdefault(root(m), []).append(m)
            for cells in groups.values():
                if len(cells) >= self.c["minClusterSize"] and any(self.cell(r, c) == s for r, c in cells):
                    found.append((s, cells))
        return found

    def pay(self, symbol, size):
        b = 0
        br = self.c["payBrackets"]
        while b + 1 < len(br) and br[b + 1] <= size:
            b += 1
        return self.c["paytable"][symbol][b]

    def spin(self, free):
        c = self.c
        weights = c["weights"]["free" if free else "base"]
        need = c["stationSteps"]
        if not free:
            self.sun = 0
        station = self.base_camp if free else 0
        steps = need[station - 1] if station > 0 else 0
        self.treasure = 1
        cascades = 0
        self.cols = [[] for _ in range(self.cols_n)]
        self.fill(weights)
        for s in range(1, station + 1):
            self.station_effect(s, free)
        while True:
            found = self.clusters()
            if not found:
                break
            mult = self.treasure + self.sun
            self.add_win(sum(self.pay(s, len(cells)) * mult for s, cells in found), "free" if free else "base")
            cascades += 1
            if self.capped:
                break
            remove = set()
            for _, cells in found:
                remove.update(p for p in cells if self.cell(*p) != EXPLORER)
            keys = [(r, k) for r in range(self.rows_n) for k in range(self.cols_n) if self.cell(r, k) == KEY]
            remove.update(keys)
            steps = min(need[4], steps + 1 + len(keys))
            target = sum(1 for n in need if n <= steps)
            if free and keys:
                self.base_camp = min(c["freeSpins"]["maxBaseCamp"], self.base_camp + len(keys))
            for k in range(self.cols_n):
                self.cols[k] = [v for i, v in enumerate(self.cols[k]) if (self.rows_n - 1 - i, k) not in remove]
            self.fill(weights)
            for s in range(station + 1, target + 1):
                self.station_effect(s, free)
            station = target
            if cascades >= c["maxCascades"]:
                break
        compass = sum(col.count(COMPASS) for col in self.cols)
        return compass, station, cascades


def main():
    cfg = json.load(open(sys.argv[1]))
    seed, stream, rounds = int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
    buy = len(sys.argv) > 5 and sys.argv[5] == "buy"
    game = Game(cfg, Xoshiro256(seed, stream))
    out = sys.stdout
    for _ in range(rounds):
        out.write(",".join(map(str, game.play(buy))) + "\n")


if __name__ == "__main__":
    main()
