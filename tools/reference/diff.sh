#!/bin/bash
# Differential test: TypeScript engine vs. Python reference implementation.
# usage: tools/reference/diff.sh <config.json> <seed> <streams> <rounds-per-stream> [buy]
set -euo pipefail
cfg=$1; seed=$2; streams=$3; rounds=$4; mode=${5:-}
tmp=$(mktemp -d)
for s in $(seq 0 $((streams - 1))); do
  ( node dist/tools/sim/dump.js "$cfg" "$seed" "$s" "$rounds" $mode > "$tmp/ts_$s.txt"
    python3 tools/reference/reference_engine.py "$cfg" "$seed" "$s" "$rounds" $mode > "$tmp/py_$s.txt" ) &
done
wait
for s in $(seq 0 $((streams - 1))); do
  cmp "$tmp/ts_$s.txt" "$tmp/py_$s.txt" || { echo "MISMATCH in stream $s"; exit 1; }
done
cat "$tmp"/ts_*.txt | awk -F, '{n++; w+=$1; if($3>0)b++; if($8>0)f++; if($5>0)fi++; if($1>=1000000)c++}
  END {printf "IDENTICAL: %d rounds, RTP in sample %.2f %%, base bonus wins %d, free-spin features %d, finale wins %d, capped %d\n", n, w/n, b, f, fi, c}'
rm -rf "$tmp"
