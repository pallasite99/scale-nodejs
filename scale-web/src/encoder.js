export function encodeCompact(value) {
    const steps = [];
  
    if (value < 0) throw new Error("Negative values are not supported in SCALE compact encoding.");
  
    if (value < 1 << 6) {
      const encoded = value << 2;
      steps.push(`Mode 00: Value fits in 6 bits (0–63). Use 1 byte.`);
      steps.push(`Shift value left by 2 bits to reserve 2 least significant bits for mode: ${value} << 2 = ${encoded}`);
      steps.push(`Final byte = 0b${encoded.toString(2).padStart(8, '0')} (hex: ${encoded.toString(16).padStart(2, '0')})`);
      return { hex: encoded.toString(16).padStart(2, '0'), steps };
    }
  
    if (value < 1 << 14) {
      const encoded = (value << 2) | 0b01;
      steps.push(`Mode 01: Value fits in 14 bits (64–16,383). Use 2 bytes.`);
      steps.push(`Shift value left by 2 bits and OR with 01 to indicate Mode 01: (${value} << 2) | 01 = ${encoded}`);
      steps.push(`Binary: 0b${encoded.toString(2).padStart(16, '0')}`);
      const b1 = encoded & 0xff;
      const b2 = (encoded >> 8) & 0xff;
      steps.push(`Byte breakdown (little-endian): [${b1}, ${b2}] → hex: ${b1.toString(16)} ${b2.toString(16)}`);
      return {
        hex: b1.toString(16).padStart(2, '0') + b2.toString(16).padStart(2, '0'),
        steps,
      };
    }
  
    if (value < 1 << 30) {
      const encoded = (value << 2) | 0b10;
      steps.push(`Mode 10: Value fits in 30 bits. Use 4 bytes.`);
      steps.push(`Shift left and OR with 10: (${value} << 2) | 10 = ${encoded}`);
      const bytes = [
        encoded & 0xff,
        (encoded >> 8) & 0xff,
        (encoded >> 16) & 0xff,
        (encoded >> 24) & 0xff,
      ];
      steps.push(`Little-endian byte order: [${bytes.join(', ')}] → hex: ${bytes.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
      return {
        hex: bytes.map(b => b.toString(16).padStart(2, '0')).join(''),
        steps,
      };
    }
  
    // Big integer mode
    const big = BigInt(value);
    const bytes = [];
    let temp = big;
    while (temp > 0n) {
      bytes.push(Number(temp & 0xffn));
      temp >>= 8n;
    }
  
    const len = bytes.length;
    const header = ((len - 4) << 2) | 0b11;
  
    steps.push(`Mode 11: Big integer mode (value larger than 30 bits).`);
    steps.push(`Length = ${len} bytes. Header = ((len - 4) << 2) | 11 = ${header}`);
    steps.push(`Header in hex: ${header.toString(16)}. Bytes (LE): [${bytes.join(', ')}]`);
  
    return {
      hex: [header, ...bytes].map(b => b.toString(16).padStart(2, '0')).join(''),
      steps,
    };
  }
  