#!/usr/bin/env python3
"""
🔐 TAURUS AI CORP. - CEO PQC Command Signer
Client-side utility to sign Telegram commands with ML-DSA-65.
Usage: python3 ceo_pqc_signer.py "/analyze https://github.com"
"""

import sys
import os
import base64
from pqc_executive_security import PQCSecurityProvider


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 ceo_pqc_signer.py "/command args..."')
        return

    command = sys.argv[1]
    pqc = PQCSecurityProvider()

    # Check if private key exists
    if not os.path.exists(pqc.private_key_path):
        print(f"❌ Error: Private key not found at {pqc.private_key_path}")
        print("Please run /pqc_setup in Telegram first to generate keys on the server,")
        print("then ensure the private key is synced to this local machine.")
        return

    with open(pqc.private_key_path, "rb") as f:
        sk = f.read()

    # Sign the command
    signature = pqc.sign_command(command, sk)

    sig_id = signature[:16]

    sig_file = f"configs/secrets/pqc/signatures/{sig_id}.sig"
    os.makedirs(os.path.dirname(sig_file), exist_ok=True)
    with open(sig_file, "w") as f:
        f.write(signature)

    print("\n" + "=" * 60)
    print("🔓 PQC-SIGNED COMMAND READY FOR TELEGRAM")
    print("=" * 60)
    print(f"\n{command} --sig-id {sig_id}\n")
    print("=" * 60)
    print(f"✅ Signature stored: {sig_file}")
    print("Copy the SHORT command above into Telegram.")


if __name__ == "__main__":
    main()
