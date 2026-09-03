const { createPublicClient, http } = require('viem');
const { hardhat } = require('viem/chains');

const client = createPublicClient({ chain: hardhat, transport: http('http://127.0.0.1:8545') });

async function check() {
  const addr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  try {
    const code = await client.getBytecode({ address: addr });
    console.log('Bytecode at', addr, ':', code && code.length > 2 ? 'YES' : 'NO');
  } catch (e) {
    console.log('Error:', e.message);
  }
}
check();
