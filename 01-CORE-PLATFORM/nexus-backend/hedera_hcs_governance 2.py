#!/usr/bin/env python3
"""
🏛️ TAURUS AI CORP. - Hedera HCS Immutable Governance Layer
Mirrors executive commands to Hedera Consensus Service for immutable audit trails.
Implements "Executive Intent" provenance for regulatory compliance.

HCS Topic: 0.0.8076305 (TAURUS AI Governance)
"""

import os
import json
import logging
import hashlib
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from dataclasses import dataclass, asdict

logger = logging.getLogger("HederaGovernance")
logging.basicConfig(level=logging.INFO)


@dataclass
class GovernanceMessage:
    message_id: str
    timestamp: str
    command: str
    user_id: str
    gcr_score: float
    autonomy_level: str
    pqc_verified: bool
    action_risk: float
    approved: bool
    execution_hash: str
    metadata: Dict[str, Any]


class HederaHCSGovernance:
    """
    Provides immutable audit trail for executive commands via Hedera HCS.

    Every Tier 1 command is mirrored to HCS topic, creating:
    - Unalterable timestamp
    - Proof of executive intent
    - Regulatory compliance trail
    """

    def __init__(
        self,
        account_id: str = None,
        private_key: str = None,
        network: str = "testnet",
        topic_id: str = "0.0.8076305",
    ):
        self.account_id = account_id or os.getenv("HEDERA_ACCOUNT_ID")
        self.private_key = private_key or os.getenv("HEDERA_PRIVATE_KEY")
        self.network = network or os.getenv("HEDERA_NETWORK", "testnet")
        self.topic_id = topic_id or os.getenv(
            "HEDERA_GOVERNANCE_TOPIC_ID", "0.0.8076305"
        )
        self.client = None

    def _init_client(self):
        """Initialize Hedera client lazily."""
        if self.client:
            return self.client

        try:
            from hiero import Client, AccountId, PrivateKey, TopicId
            from hiero import Network

            if self.network == "mainnet":
                client = Client.for_mainnet()
            else:
                client = Client.for_testnet()

            client.set_operator(
                AccountId.fromString(self.account_id),
                PrivateKey.fromString(self.private_key),
            )
            self.client = client
            logger.info(f"🏛️ Hedera Client initialized: {self.account_id}")
            return client

        except ImportError:
            logger.warning("Hiero SDK not installed. Install with: pip install hiero")
            return None
        except Exception as e:
            logger.error(f"Failed to initialize Hedera client: {e}")
            return None

    def create_execution_hash(self, command: str, user_id: str, timestamp: str) -> str:
        """Create SHA-256 hash of the execution intent."""
        data = f"{command}|{user_id}|{timestamp}"
        return hashlib.sha256(data.encode()).hexdigest()

    async def mirror_command(
        self,
        command: str,
        user_id: str,
        gcr_score: float,
        autonomy_level: str,
        pqc_verified: bool,
        action_risk: float,
        approved: bool,
        metadata: Dict[str, Any] = None,
    ) -> Optional[str]:
        """
        Mirror an executive command to Hedera HCS.

        Returns:
            Transaction ID if successful, None otherwise.
        """
        timestamp = datetime.now(timezone.utc).isoformat()
        execution_hash = self.create_execution_hash(command, user_id, timestamp)

        governance_msg = GovernanceMessage(
            message_id=execution_hash[:16],
            timestamp=timestamp,
            command=command,
            user_id=user_id,
            gcr_score=gcr_score,
            autonomy_level=autonomy_level,
            pqc_verified=pqc_verified,
            action_risk=action_risk,
            approved=approved,
            execution_hash=execution_hash,
            metadata=metadata or {},
        )

        message_json = json.dumps(asdict(governance_msg), indent=2)

        logger.info(f"🏛️ Mirroring to HCS Topic {self.topic_id}")
        logger.info(f"   Command: {command}")
        logger.info(f"   Hash: {execution_hash}")

        client = self._init_client()

        if not client:
            logger.warning("Hedera client not available. Storing locally.")
            return self._store_locally(governance_msg)

        try:
            from hiero import TopicMessageSubmitTransaction, TopicId

            topic_id = TopicId.fromString(self.topic_id)

            transaction = (
                TopicMessageSubmitTransaction()
                .set_topic_id(topic_id)
                .set_message(message_json)
            )

            response = transaction.execute(client)
            receipt = response.get_receipt(client)

            sequence_number = receipt.topic_sequence_number
            logger.info(f"✅ HCS Message submitted: Sequence #{sequence_number}")

            return f"{response.transaction_id}@{sequence_number}"

        except Exception as e:
            logger.error(f"HCS submission failed: {e}")
            return self._store_locally(governance_msg)

    def _store_locally(self, msg: GovernanceMessage) -> str:
        """Fallback: Store governance message locally."""
        os.makedirs("logs/hcs_audit", exist_ok=True)
        filename = f"logs/hcs_audit/{msg.message_id}.json"

        with open(filename, "w") as f:
            json.dump(asdict(msg), f, indent=2)

        logger.info(f"📁 Stored locally: {filename}")
        return f"local://{filename}"

    async def get_topic_messages(self, limit: int = 10) -> list:
        """Retrieve recent messages from HCS topic."""
        client = self._init_client()

        if not client:
            return []

        try:
            from hiero import TopicMessageQuery, TopicId

            topic_id = TopicId.fromString(self.topic_id)
            messages = []

            query = TopicMessageQuery().set_topic_id(topic_id).set_limit(limit)

            def on_message(msg):
                try:
                    data = json.loads(msg.contents.decode())
                    messages.append(data)
                except:
                    pass

            query.execute(client, on_message)

            return messages

        except Exception as e:
            logger.error(f"Failed to retrieve HCS messages: {e}")
            return []


if __name__ == "__main__":
    import asyncio

    async def test():
        governance = HederaHCSGovernance()

        tx_id = await governance.mirror_command(
            command="/analyze https://github.com/hiero-ledger",
            user_id="ceo_taurus",
            gcr_score=0.85,
            autonomy_level="high_autonomy",
            pqc_verified=True,
            action_risk=0.7,
            approved=True,
            metadata={"source": "telegram", "ip": "127.0.0.1"},
        )

        print(f"\n{'=' * 60}")
        print(f"🏛️ HCS GOVERNANCE SUBMISSION")
        print(f"{'=' * 60}")
        print(f"Transaction ID: {tx_id}")
        print(f"{'=' * 60}\n")

        messages = await governance.get_topic_messages(5)
        print(f"Recent HCS Messages: {len(messages)}")
        for msg in messages[:3]:
            print(f"  - {msg.get('command', 'N/A')[:50]}")

    asyncio.run(test())
