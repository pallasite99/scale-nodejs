export function decodeCompact(hexInput) {
    const steps = [];
  
    let hex = hexInput.startsWith("0x") ? hexInput.slice(2) : hexInput;
    if (hex.length % 2 !== 0) hex = "0" + hex;
    const bytes = hex.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || [];
  
    if (!bytes.length) throw new Error("Invalid hex input");
  
    const first = bytes[0];
    const mode = first & 0b11;
  
    steps.push(`First byte: ${first} → binary: ${first.toString(2).padStart(8, '0')}`);
    steps.push(`Mode bits: ${mode.toString(2).padStart(2, '0')} (determines number of bytes used)`);
  
    if (mode === 0b00) {
      const val = first >> 2;
      steps.push(`Mode 00: Single-byte mode. Actual value = first byte >> 2 = ${val}`);
      return { value: val, steps };
    }
  
    if (mode === 0b01) {
      if (bytes.length < 2) throw new Error("Expected 2 bytes for Mode 01");
      const raw = bytes[0] + (bytes[1] << 8);
      const val = raw >> 2;
      steps.push(`Mode 01: Two-byte mode.`);
      steps.push(`Raw 16-bit value = (${bytes[1]} << 8) | ${bytes[0]} = ${raw}`);
      steps.push(`Actual value = raw >> 2 = ${val}`);
      return { value: val, steps };
    }
  
    if (mode === 0b10) {
      if (bytes.length < 4) throw new Error("Expected 4 bytes for Mode 10");
      const raw = bytes[0] + (bytes[1] << 8) + (bytes[2] << 16) + (bytes[3] << 24);
      const val = raw >>> 2;
      steps.push(`Mode 10: Four-byte mode.`);
      steps.push(`Raw 32-bit value = decoded from LE bytes = ${raw}`);
      steps.push(`Actual value = raw >>> 2 = ${val}`);
      return { value: val, steps };
    }
  
    if (mode === 0b11) {
      const len = (first >> 2) + 4;
      if (bytes.length < 1 + len) throw new Error(`Expected ${1 + len} bytes for Mode 11`);
      let result = BigInt(0);
      for (let i = 0; i < len; i++) {
        result += BigInt(bytes[1 + i]) << BigInt(8 * i);
      }
      steps.push(`Mode 11: BigInt mode.`);
      steps.push(`Data length = ${len}. Reconstructed value from LE bytes = ${result}`);
      return { value: result.toString(), steps };
    }
  
    throw new Error("Invalid SCALE encoding");
  }
  