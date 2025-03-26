# SCALE Compact Decoder (Node.js)

A simple and accurate SCALE Compact Integer decoder implementation in Node.js — built from scratch to help understand and work with SCALE encoding used in Substrate-based blockchains (like Polkadot, Kusama, etc.).

---

## 🚀 Features

- Decodes SCALE compact-encoded integers (all 4 modes: single-byte, two-byte, four-byte, big-integer).
- Fully little-endian aware.
- Helpful debug logs for educational purposes.
- Designed for manual testing and prototyping.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/pallasite99/scale-nodejs.git
cd scale-nodejs
```

## Usage

```bash
node scale.js
```

### Example Output

```bash
Parsed bytes: <Buffer 04>
Decoded 0x04 => 1

Parsed bytes: <Buffer 08>
Decoded 0x08 => 2

Parsed bytes: <Buffer fc>
Decoded 0xfc => 63

Parsed bytes: <Buffer fc 01>
Decoded 0xfc01 => 127
```

## Supported SCALE Compact modes

```bash
| Mode Bits | Bytes Used | Max Value | Description        |
|-----------|------------|-----------|--------------------|
| `00`      | 1 byte     | up to 63  | Single-byte mode   |
| `01`      | 2 bytes    | up to 16K | Two-byte mode      |
| `10`      | 4 bytes    | up to 1B  | Four-byte mode     |
| `11`      | N+5 bytes  | BigInt    | Big-integer mode   |
```

## Coming Soon

* `encodeCompact(number)` — SCALE encoder function
* CLI tool for quick encode/decode
* Web-based interactive demo

