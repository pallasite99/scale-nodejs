# SCALE Compact Encoder / Decoder (Node.js)

A simple and accurate SCALE Compact Integer decoder implementation in Node.js — built from scratch to help understand and work with SCALE encoding used in Substrate-based blockchains (like Polkadot, Kusama, etc.).
* A set of interactive CLI tools to **encode and decode SCALE compact integers** — used in blockchains.

---

## 🚀 Features

- Encodes / Decodes SCALE compact-encoded integers (all 4 modes: single-byte, two-byte, four-byte, big-integer).
- Fully little-endian aware.
- Helpful debug logs for educational purposes.
- Interactive CLI tool for learners
- Designed for manual testing and prototyping.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/pallasite99/scale-nodejs.git
cd scale-nodejs
```

## Usage (basic example)

```bash
node scale.js
```

### Example Output (Decoding)

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

## Local CLI usage

```bash
node ./bin/scale-decode.js
node ./bin/scale-encode.js
```

## CLI support (Global npm link)
![Screenshot 2025-03-26 123921](https://github.com/user-attachments/assets/ceca66bb-30c0-40b7-953e-0b8bd29911d0)
![Screenshot 2025-03-27 103502](https://github.com/user-attachments/assets/19743506-0e27-4e33-aa82-e5768f79ab9c)


## Coming Soon

* Web-based interactive demo

