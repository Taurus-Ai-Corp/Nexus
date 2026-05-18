#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - PQC Executive Security Layer
Implements NIST FIPS 204 (ML-DSA-65) for Quantum-Resistant Command Signing.
Part of the HIP-1399 PQC Readiness Initiative.
"""

import os
import base64
import logging
from typing import Tuple, Optional
from dilithium_py.ml_dsa import ML_DSA_65

logger = logging.getLogger("PQCSecurity")
logging.basicConfig(level=logging.INFO)

class PQCSecurityProvider:
    """
    Provides ML-DSA-65 digital signatures for executive commands.
    Ensures security against Harvest Now, Decrypt Later (HNDL) attacks.
    """
    
    def __init__(self, key_dir: str = "configs/secrets/pqc"):
        self.key_dir = key_dir
        self.public_key_path = os.path.join(key_dir, "ceo_ml_dsa_65.pub")
        self.private_key_path = os.path.join(key_dir, "ceo_ml_dsa_65.key")
        
        # Ensure key directory exists
        os.makedirs(key_dir, exist_ok=True)

    def generate_ceo_keys(self) -> Tuple[bytes, bytes]:
        """Generate a new ML-DSA-65 keypair for the CEO."""
        logger.info("🔐 Generating new NIST ML-DSA-65 (Dilithium3) Keypair...")
        pk, sk = ML_DSA_65.keygen()
        
        with open(self.public_key_path, "wb") as f:
            f.write(pk)
        with open(self.private_key_path, "wb") as f:
            f.write(sk)
            
        logger.info(f"✅ PQC Keys saved to {self.key_dir}")
        return pk, sk

    def load_public_key(self) -> Optional[bytes]:
        """Load the CEO's public key for verification."""
        if os.path.exists(self.public_key_path):
            with open(self.public_key_path, "rb") as f:
                return f.read()
        return None

    def sign_command(self, command: str, private_key: bytes) -> str:
        """Sign a command string using ML-DSA-65."""
        # Convert command to bytes
        msg = command.encode('utf-8')
        signature = ML_DSA_65.sign(private_key, msg)
        # Return base64 encoded signature for Telegram transport
        return base64.b64encode(signature).decode('utf-8')

    def verify_command(self, command: str, b64_signature: str, public_key: bytes) -> bool:
        """Verify an ML-DSA-65 signature for a given command."""
        try:
            msg = command.encode('utf-8')
            signature = base64.b64decode(b64_signature)
            return ML_DSA_65.verify(public_key, msg, signature)
        except Exception as e:
            logger.error(f"PQC Verification Failed: {e}")
            return False

if __name__ == "__main__":
    # Self-test
    pqc = PQCSecurityProvider()
    pk, sk = pqc.generate_ceo_keys()
    
    cmd = "/analyze https://github.com/hiero-ledger"
    sig = pqc.sign_command(cmd, sk)
    print(f"Command: {cmd}")
    print(f"Signature (Base64): {sig[:50]}...")
    
    is_valid = pqc.verify_command(cmd, sig, pk)
    print(f"Verification Result: {'✅ VALID' if is_valid else '❌ INVALID'}")
