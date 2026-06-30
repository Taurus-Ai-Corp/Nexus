#!/bin/bash
for repo in GRIDERA gridera-scan-cli gridera-migrate gridera-migrate-sdk gridera-asset gridera-lend Quantum-Shield-NFT Quantum_Bio_Foundry_IP_VAULT quantum-bio-foundry-vault quantum-rupee-fraud-detection quantum-rupee-offline-cbdc quantum-rupee-zk-kyc quantum-infrastructure-demo hedera-quantum-ecosystem; do
  echo "$repo open PRs:"
  gh pr list -R Taurus-Ai-Corp/$repo --state open --json number,headRefName,url --jq '.[] | "  #\(.number) [\(.headRefName)] \(.url)"' 2>/dev/null || true
done
