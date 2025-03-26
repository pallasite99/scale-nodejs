#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

function decodeCompact(hexInput) {
  let hex = hexInput.startsWith('0x') ? hexInput.slice(2) : hexInput;
  if (hex.length % 2 !== 0) hex = '0' + hex;

  const bytes = Buffer.from(hex, 'hex');
  const first = bytes[0];
  const modeBits = first & 0b11;

  console.log(chalk.cyan(`\n🔍 Hex input:`), `0x${hex}`);
  console.log(chalk.cyan(`📦 Parsed bytes:`), bytes);
  console.log(chalk.yellow(`🧠 First byte:`), `0x${first.toString(16)} (${first.toString(2).padStart(8, '0')})`);
  console.log(chalk.yellow(`🔢 Mode bits:`), (modeBits).toString(2).padStart(2, '0'));

  switch (modeBits) {
    case 0b00:
      const singleValue = first >> 2;
      console.log(chalk.green(`📘 Mode 00 (single-byte):`));
      console.log(`→ Shift right by 2: ${first} >> 2 = ${singleValue}`);
      return singleValue;

    case 0b01:
      if (bytes.length < 2) throw new Error('Not enough bytes for 2-byte mode');
      const raw2Byte = bytes[0] + (bytes[1] << 8);
      const twoByteVal = raw2Byte >> 2;
      console.log(chalk.green(`📘 Mode 01 (two-byte):`));
      console.log(`→ Combine: 0x${bytes[1].toString(16)} << 8 + 0x${bytes[0].toString(16)} = ${raw2Byte}`);
      console.log(`→ Shift right by 2: ${raw2Byte} >> 2 = ${twoByteVal}`);
      return twoByteVal;

    case 0b10:
      if (bytes.length < 4) throw new Error('Not enough bytes for 4-byte mode');
      const raw4Byte =
        bytes[0] +
        (bytes[1] << 8) +
        (bytes[2] << 16) +
        (bytes[3] << 24);
      const fourByteVal = raw4Byte >>> 2;
      console.log(chalk.green(`📘 Mode 10 (four-byte):`));
      console.log(`→ Combine all 4 bytes (little-endian) = ${raw4Byte}`);
      console.log(`→ Shift right by 2: ${raw4Byte} >>> 2 = ${fourByteVal}`);
      return fourByteVal;

    case 0b11:
      const byteLen = (first >> 2) + 4;
      if (bytes.length < 1 + byteLen) {
        throw new Error(`Not enough bytes for big-integer mode. Needed: ${1 + byteLen}, got: ${bytes.length}`);
      }
      let result = BigInt(0);
      console.log(chalk.green(`📘 Mode 11 (big-integer):`));
      console.log(`→ Length = (0x${first.toString(16)} >> 2) + 4 = ${byteLen}`);
      for (let i = 0; i < byteLen; i++) {
        console.log(`→ Byte ${i}: ${bytes[1 + i]} << ${8 * i}`);
        result += BigInt(bytes[1 + i]) << BigInt(8 * i);
      }
      return result;

    default:
      throw new Error('Unknown mode');
  }
}

async function mainMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.blue('Choose an option:'),
        choices: [
          'Decode a custom SCALE hex input',
          'Try an example (0x04 → 1)',
          'Try an example (0x01ff → 16320)',
          'Try an example (0xfc01 → 127)',
          'Exit',
        ],
      },
    ]);

    if (action === 'Exit') {
      console.log(chalk.gray('👋 Goodbye!'));
      break;
    }

    let input = '';
    if (action.startsWith('Try an example')) {
      input = action.match(/0x[0-9a-fA-F]+/)[0];
    } else {
      const response = await inquirer.prompt([
        {
          type: 'input',
          name: 'hexInput',
          message: 'Enter SCALE-encoded hex (e.g., 0x01ff):',
          validate: input =>
            /^0x[0-9a-fA-F]+$/.test(input) || 'Please enter a valid hex string (e.g. 0x01ff)',
        },
      ]);
      input = response.hexInput;
    }

    try {
      const result = decodeCompact(input);
      console.log(chalk.bold.green(`\n✅ Final Decoded Value: ${result.toString()}\n`));
    } catch (err) {
      console.error(chalk.red(`❌ Error decoding ${input}: ${err.message}\n`));
    }
  }
}

mainMenu();
