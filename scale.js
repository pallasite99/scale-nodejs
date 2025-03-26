function decodeCompact(hexInput) {
    let hex = hexInput.startsWith('0x') ? hexInput.slice(2) : hexInput;
    if (hex.length % 2 !== 0) hex = '0' + hex;
  
    const bytes = Buffer.from(hex, 'hex');
    console.log('Parsed bytes:', bytes);
  
    const first = bytes[0];
    const mode = first & 0b11;
  
    if (mode === 0b00) {
      return first >> 2;
    }
  
    if (mode === 0b01) {
      if (bytes.length < 2) throw new Error('Not enough bytes for 2-byte mode');
      const val = bytes[0] + (bytes[1] << 8); // Little-endian
      return val >> 2;
    }
  
    if (mode === 0b10) {
      if (bytes.length < 4) throw new Error('Not enough bytes for 4-byte mode');
      const val =
        bytes[0] +
        (bytes[1] << 8) +
        (bytes[2] << 16) +
        (bytes[3] << 24);
      return val >>> 2;
    }
  
    if (mode === 0b11) {
      const byteLen = (first >> 2) + 4;
      if (bytes.length < 1 + byteLen) {
        throw new Error(`Not enough bytes for big-integer mode. Needed: ${1 + byteLen}, got: ${bytes.length}`);
      }
      let result = BigInt(0);
      for (let i = 0; i < byteLen; i++) {
        result += BigInt(bytes[1 + i]) << BigInt(8 * i);
      }
      return result;
    }
  
    throw new Error('Unknown SCALE mode');
  }
  
  // ✅ Test cases (correct SCALE-encoded inputs)
  console.log('Decoded 0x04 =>', decodeCompact('0x04'));       // 1
  console.log('Decoded 0x08 =>', decodeCompact('0x08'));       // 2
  console.log('Decoded 0xfc =>', decodeCompact('0xfc'));       // 63
  