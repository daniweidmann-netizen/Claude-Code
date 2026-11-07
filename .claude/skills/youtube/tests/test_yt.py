"""Offline tests for the caption parsing helpers in yt.py.

Run: python3 -m unittest discover -s .claude/skills/youtube/tests
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import yt  # noqa: E402

JSON3 = {
    "events": [
        {"tStartMs": 0, "dDurationMs": 2000, "segs": [{"utf8": "Hello "}, {"utf8": "world"}]},
        {"tStartMs": 2000, "dDurationMs": 10, "aAppend": 1, "segs": [{"utf8": "\n"}]},
        {"tStartMs": 2100, "dDurationMs": 1500, "segs": [{"utf8": "\n"}]},
        {"tStartMs": 35000, "dDurationMs": 3000, "segs": [{"utf8": "second  part"}]},
        {"tStartMs": 40000},
    ]
}

AUTO_VTT = """WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:00:02.000 align:start position:0%
<c>so</c><00:00:00.500><c> today</c><00:00:01.000><c> we</c>

00:00:02.000 --> 00:00:04.000 align:start position:0%
so today we
are going to talk &amp; learn

00:00:04.000 --> 00:00:06.000
are going to talk &amp; learn
"""


class ParseTests(unittest.TestCase):
    def test_json3(self):
        segs = yt.parse_json3(json.dumps(JSON3))
        self.assertEqual([s["text"] for s in segs], ["Hello world", "second part"])
        self.assertEqual((segs[0]["start"], segs[0]["end"]), (0, 2))

    def test_vtt_dedupes_rolling_lines(self):
        segs = yt.parse_vtt(AUTO_VTT)
        self.assertEqual([s["text"] for s in segs], ["so today we", "are going to talk & learn"])
        self.assertEqual(segs[1]["end"], 6)

    def test_srt_input(self):
        segs = yt.parse_vtt("1\n00:00:01,000 --> 00:00:02,500\nHi\n\n2\n00:00:03,000 --> 00:00:04,000\nThere\n")
        self.assertEqual([(s["start"], s["text"]) for s in segs], [(1, "Hi"), (3, "There")])

    def test_chunk_and_srt(self):
        segs = yt.parse_json3(JSON3)
        self.assertEqual(len(yt.chunk_segments(segs, 30)), 2)
        self.assertEqual(len(yt.chunk_segments(segs, 60)), 1)
        self.assertIn("00:00:35,000 --> 00:00:38,000", yt.to_srt(segs))

    def test_fmt_ts(self):
        self.assertEqual(yt.fmt_ts(65), "01:05")
        self.assertEqual(yt.fmt_ts(3725), "1:02:05")


class TrackPickTests(unittest.TestCase):
    def info(self, subs=None, auto=None, language="en"):
        t = lambda *exts: [{"ext": e, "url": f"u.{e}"} for e in exts]  # noqa: E731
        return {
            "language": language,
            "subtitles": {k: t(*v) for k, v in (subs or {}).items()},
            "automatic_captions": {k: t(*v) for k, v in (auto or {}).items()},
        }

    def test_manual_preferred_over_auto(self):
        r = yt.pick_track(self.info({"en": ["vtt", "json3"]}, {"en": ["json3"]}), None)
        self.assertEqual((r[0], r[1], r[2]["ext"]), ("manual", "en", "json3"))

    def test_auto_fallback_and_orig(self):
        r = yt.pick_track(self.info({}, {"de-orig": ["vtt"], "en": ["vtt"]}, language="de"), None)
        self.assertEqual((r[0], r[1]), ("auto-generated", "de-orig"))

    def test_regional_variant(self):
        r = yt.pick_track(self.info({"en-US": ["vtt"]}), "en")
        self.assertEqual(r[1], "en-US")

    def test_missing_language(self):
        self.assertIsNone(yt.pick_track(self.info({"fr": ["vtt"]}), "ja"))

    def test_none(self):
        self.assertIsNone(yt.pick_track(self.info(), None))


class CliTests(unittest.TestCase):
    def test_help_parses(self):
        with self.assertRaises(SystemExit) as cm:
            yt.main(["--help"])
        self.assertEqual(cm.exception.code, 0)


if __name__ == "__main__":
    unittest.main()
