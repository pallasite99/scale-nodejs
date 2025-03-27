#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

function encodeCompact(value) {
  console.log(chalk.cyan(`\n🔢 Input value:`), value);

  if (value < 0) throw new Error('Negative values are not supported by SCALE compact encoding.');

  // Mode 00: Single byte (value < 64)
  if (value < 1 << 6) {
    const encoded = value << 2;
    console.log(chalk.green('📘 Mode 00 (single-byte mode)'));
    console.log(`→ Left shift by 2: ${value} << 2 = ${encoded}`);
    return Buffer.from([encoded]).toString('hex');
  }

  // Mode 01: Two bytes (value < 2^14)
  if (value < 1 << 14) {
    const shifted = value << 2 | 0b01;
    console.log(chalk.green('📘 Mode 01 (two-byte mode)'));
    console.log(`→ Left shift by 2, add mode bits: ${value} << 2 | 0b01 = ${shifted}`);
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(shifted);
    return buf.toString('hex');
  }

  // Mode 10: Four bytes (value < 2^30)
  if (value < 1 << 30) {
    const shifted = value << 2 | 0b10;
    console.log(chalk.green('📘 Mode 10 (four-byte mode)'));
    console.log(`→ Left shift by 2, add mode bits: ${value} << 2 | 0b10 = ${shifted}`);
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(shifted);
    return buf.toString('hex');
  }

  // Mode 11: BigInt mode
  const big = BigInt(value);
  const bytes = [];
  let temp = big;
  while (temp > 0n) {
    bytes.push(Number(temp & 0xffn));
    temp >>= 8n;
  }

  const length = bytes.length;
  const header = ((length - 4) << 2) | 0b11;
  console.log(chalk.green('📘 Mode 11 (big-integer mode)'));
  console.log(`→ Byte length = ${length}, Header = (${length - 4} << 2) | 0b11 = ${header}`);
  const result = Buffer.from([header, ...bytes]);
  return result.toString('hex');
}

async function mainMenu() {
  while (true) {
    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: chalk.blue('Enter an integer to encode (e.g. 127):'),
        validate: input =>
          /^[0-9]+$/.test(input) || 'Please enter a valid non-negative integer',
      },
    ]);

    try {
      const encodedHex = encodeCompact(parseInt(value, 10));
      console.log(chalk.bold.green(`\n✅ Encoded Hex: 0x${encodedHex}\n`));
    } catch (err) {
      console.error(chalk.red(`❌ Error: ${err.message}\n`));
    }

    const { again } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'again',
        message: 'Encode another number?',
        default: true,
      },
    ]);

    if (!again) {
      console.log(chalk.gray('👋 Goodbye!'));
      break;
    }
  }
}

mainMenu();
