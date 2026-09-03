const { createPublicClient, http } = require('viem');
const { sepolia } = require('viem/chains');

const client = createPublicClient({ chain: sepolia, transport: http('https://rpc.sepolia.org') });

async function check() {
  const addr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const code = await client.getBytecode({ address: addr });
  console.log('Bytecode at', addr, ':', code ? 'YES' : 'NO');
}
check().catch(console.error);
