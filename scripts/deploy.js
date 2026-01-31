#!/usr/bin/env node

/**
 * AnoneX Contract Deployment Script
 * Deploys Leo programs to Aleo testnet/mainnet
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const NETWORK = process.env.ALEO_NETWORK || 'testnet';
const PRIVATE_KEY = process.env.ALEO_PRIVATE_KEY;
const PROGRAMS_DIR = path.join(__dirname, '..', 'contracts', 'programs');

// Programs to deploy in order
const PROGRAMS = [
  'identity',
  'post',
  'reaction',
  'follow',
  'group',
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('\n📋 Checking prerequisites...', 'cyan');

  // Check Leo CLI
  try {
    const leoVersion = execSync('leo --version', { encoding: 'utf-8' }).trim();
    log(`  ✓ Leo CLI: ${leoVersion}`, 'green');
  } catch {
    log('  ✗ Leo CLI not found. Please install: https://docs.leo-lang.org/', 'red');
    process.exit(1);
  }

  // Check private key
  if (!PRIVATE_KEY) {
    log('  ✗ ALEO_PRIVATE_KEY environment variable not set', 'red');
    log('    Export your private key: export ALEO_PRIVATE_KEY="APrivateKey1..."', 'yellow');
    process.exit(1);
  }
  log(`  ✓ Private key configured`, 'green');

  log(`  ✓ Network: ${NETWORK}`, 'green');
}

function buildProgram(programName) {
  const programPath = path.join(PROGRAMS_DIR, programName);
  
  if (!fs.existsSync(programPath)) {
    log(`  ✗ Program directory not found: ${programPath}`, 'red');
    return false;
  }

  log(`\n🔨 Building ${programName}...`, 'cyan');
  
  try {
    execSync('leo build', { 
      cwd: programPath,
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    log(`  ✓ Built successfully`, 'green');
    return true;
  } catch (error) {
    log(`  ✗ Build failed: ${error.message}`, 'red');
    return false;
  }
}

function deployProgram(programName) {
  const programPath = path.join(PROGRAMS_DIR, programName);
  
  log(`\n🚀 Deploying ${programName} to ${NETWORK}...`, 'cyan');
  
  try {
    const result = execSync(`leo deploy --network ${NETWORK}`, {
      cwd: programPath,
      encoding: 'utf-8',
      env: { ...process.env, PRIVATE_KEY },
    });
    
    log(`  ✓ Deployed successfully`, 'green');
    
    // Extract transaction ID from output
    const txMatch = result.match(/Transaction ID: (at1\w+)/);
    if (txMatch) {
      log(`  📝 Transaction: ${txMatch[1]}`, 'cyan');
    }
    
    return true;
  } catch (error) {
    log(`  ✗ Deployment failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🌟 AnoneX Contract Deployment', 'cyan');
  log('================================', 'cyan');

  checkPrerequisites();

  const deployedPrograms = [];
  const failedPrograms = [];

  for (const program of PROGRAMS) {
    // Build
    if (!buildProgram(program)) {
      failedPrograms.push(program);
      continue;
    }

    // Deploy
    if (deployProgram(program)) {
      deployedPrograms.push(program);
    } else {
      failedPrograms.push(program);
    }
  }

  // Summary
  log('\n📊 Deployment Summary', 'cyan');
  log('=====================', 'cyan');
  
  if (deployedPrograms.length > 0) {
    log(`\n✓ Deployed (${deployedPrograms.length}):`, 'green');
    deployedPrograms.forEach(p => log(`  - ${p}`, 'green'));
  }
  
  if (failedPrograms.length > 0) {
    log(`\n✗ Failed (${failedPrograms.length}):`, 'red');
    failedPrograms.forEach(p => log(`  - ${p}`, 'red'));
  }

  log('\n');
  
  if (failedPrograms.length > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
