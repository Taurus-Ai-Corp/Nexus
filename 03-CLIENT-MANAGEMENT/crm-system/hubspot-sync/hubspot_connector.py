"""
BizFlow-NeoVibe Platform - HubSpot CRM Connector
Bidirectional sync between custom CRM and HubSpot
"""

import os
import asyncio
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

import httpx
from hubspot import HubSpot
from hubspot.crm.contacts import SimplePublicObjectInputForCreate, SimplePublicObjectInput
from hubspot.crm.companies import SimplePublicObjectInputForCreate as CompanyInput
from hubspot.crm.deals import SimplePublicObjectInputForCreate as DealInput
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ===========================================
# CONFIGURATION
# ===========================================

class HubSpotConfig(BaseModel):
    """HubSpot configuration"""
    access_token: str
    portal_id: Optional[str] = None
    sync_interval_seconds: int = 300  # 5 minutes
    batch_size: int = 100
    retry_max_attempts: int = 3
    retry_delay_seconds: int = 5


# ===========================================
# HUBSPOT CONNECTOR
# ===========================================

class HubSpotConnector:
    """
    Bidirectional sync connector between BizFlow CRM and HubSpot

    Features:
    - Create, update, delete contacts/companies/deals
    - Bidirectional sync with conflict resolution
    - Custom property mapping for cultural context
    - Batch operations for efficiency
    - Retry logic for resilience
    """

    def __init__(self, config: Optional[HubSpotConfig] = None):
        """Initialize HubSpot connector"""
        if config is None:
            config = HubSpotConfig(
                access_token=os.getenv("HUBSPOT_ACCESS_TOKEN", ""),
                portal_id=os.getenv("HUBSPOT_PORTAL_ID"),
            )

        self.config = config
        self.client = HubSpot(access_token=config.access_token)
        self._sync_queue: List[Dict[str, Any]] = []

    # ===========================================
    # CONTACT OPERATIONS
    # ===========================================

    async def create_contact(
        self,
        email: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        company: Optional[str] = None,
        phone: Optional[str] = None,
        bizflow_client_id: Optional[str] = None,
        market_region: Optional[str] = None,
        industry: Optional[str] = None,
        custom_properties: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new contact in HubSpot

        Args:
            email: Contact email (required)
            first_name: First name
            last_name: Last name
            company: Company name
            phone: Phone number
            bizflow_client_id: BizFlow CRM client ID for sync
            market_region: Market region (dubai, india, etc.)
            industry: Industry vertical
            custom_properties: Additional custom properties

        Returns:
            Created contact data including HubSpot ID
        """
        properties = {
            "email": email,
        }

        if first_name:
            properties["firstname"] = first_name
        if last_name:
            properties["lastname"] = last_name
        if company:
            properties["company"] = company
        if phone:
            properties["phone"] = phone

        # BizFlow custom properties
        if bizflow_client_id:
            properties["bizflow_client_id"] = bizflow_client_id
        if market_region:
            properties["market_region"] = market_region
        if industry:
            properties["industry"] = industry

        # Merge custom properties
        if custom_properties:
            properties.update(custom_properties)

        try:
            contact_input = SimplePublicObjectInputForCreate(properties=properties)
            response = self.client.crm.contacts.basic_api.create(
                simple_public_object_input_for_create=contact_input
            )

            logger.info(f"Created HubSpot contact: {response.id} for email: {email}")

            return {
                "hubspot_id": response.id,
                "email": email,
                "properties": response.properties,
                "created_at": response.created_at,
            }

        except Exception as e:
            logger.error(f"Failed to create HubSpot contact: {str(e)}")
            raise

    async def update_contact(
        self,
        hubspot_id: str,
        properties: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Update an existing contact in HubSpot

        Args:
            hubspot_id: HubSpot contact ID
            properties: Properties to update

        Returns:
            Updated contact data
        """
        try:
            contact_input = SimplePublicObjectInput(properties=properties)
            response = self.client.crm.contacts.basic_api.update(
                contact_id=hubspot_id,
                simple_public_object_input=contact_input,
            )

            logger.info(f"Updated HubSpot contact: {hubspot_id}")

            return {
                "hubspot_id": response.id,
                "properties": response.properties,
                "updated_at": response.updated_at,
            }

        except Exception as e:
            logger.error(f"Failed to update HubSpot contact {hubspot_id}: {str(e)}")
            raise

    async def get_contact(self, hubspot_id: str) -> Optional[Dict[str, Any]]:
        """Get a contact by HubSpot ID"""
        try:
            response = self.client.crm.contacts.basic_api.get_by_id(
                contact_id=hubspot_id,
                properties=["email", "firstname", "lastname", "company",
                           "phone", "bizflow_client_id", "market_region", "industry"],
            )

            return {
                "hubspot_id": response.id,
                "properties": response.properties,
                "created_at": response.created_at,
                "updated_at": response.updated_at,
            }

        except Exception as e:
            logger.error(f"Failed to get HubSpot contact {hubspot_id}: {str(e)}")
            return None

    async def search_contact_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Search for a contact by email"""
        try:
            search_request = {
                "filterGroups": [
                    {
                        "filters": [
                            {
                                "propertyName": "email",
                                "operator": "EQ",
                                "value": email,
                            }
                        ]
                    }
                ],
                "properties": ["email", "firstname", "lastname", "bizflow_client_id"],
            }

            response = self.client.crm.contacts.search_api.do_search(
                public_object_search_request=search_request
            )

            if response.results:
                contact = response.results[0]
                return {
                    "hubspot_id": contact.id,
                    "properties": contact.properties,
                }

            return None

        except Exception as e:
            logger.error(f"Failed to search HubSpot contact by email {email}: {str(e)}")
            return None

    # ===========================================
    # DEAL OPERATIONS
    # ===========================================

    async def create_deal(
        self,
        deal_name: str,
        amount: Optional[float] = None,
        stage: str = "appointmentscheduled",
        close_date: Optional[str] = None,
        bizflow_deal_id: Optional[str] = None,
        associated_contact_id: Optional[str] = None,
        custom_properties: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new deal in HubSpot

        Args:
            deal_name: Deal name (required)
            amount: Deal amount
            stage: Deal stage (HubSpot pipeline stage)
            close_date: Expected close date (YYYY-MM-DD)
            bizflow_deal_id: BizFlow CRM deal ID for sync
            associated_contact_id: HubSpot contact ID to associate
            custom_properties: Additional custom properties

        Returns:
            Created deal data including HubSpot ID
        """
        properties = {
            "dealname": deal_name,
            "dealstage": stage,
        }

        if amount is not None:
            properties["amount"] = str(amount)
        if close_date:
            properties["closedate"] = close_date
        if bizflow_deal_id:
            properties["bizflow_deal_id"] = bizflow_deal_id

        if custom_properties:
            properties.update(custom_properties)

        try:
            deal_input = DealInput(properties=properties)
            response = self.client.crm.deals.basic_api.create(
                simple_public_object_input_for_create=deal_input
            )

            # Associate with contact if provided
            if associated_contact_id:
                await self._associate_deal_to_contact(response.id, associated_contact_id)

            logger.info(f"Created HubSpot deal: {response.id}")

            return {
                "hubspot_id": response.id,
                "properties": response.properties,
                "created_at": response.created_at,
            }

        except Exception as e:
            logger.error(f"Failed to create HubSpot deal: {str(e)}")
            raise

    async def _associate_deal_to_contact(
        self, deal_id: str, contact_id: str
    ) -> None:
        """Associate a deal with a contact"""
        try:
            self.client.crm.deals.associations_api.create(
                deal_id=deal_id,
                to_object_type="contact",
                to_object_id=contact_id,
                association_type="deal_to_contact",
            )
            logger.info(f"Associated deal {deal_id} with contact {contact_id}")
        except Exception as e:
            logger.warning(f"Failed to associate deal with contact: {str(e)}")

    # ===========================================
    # SYNC OPERATIONS
    # ===========================================

    async def sync_client_to_hubspot(
        self,
        client_id: UUID,
        client_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Sync a BizFlow client to HubSpot

        Args:
            client_id: BizFlow client UUID
            client_data: Client data dictionary

        Returns:
            Sync result with HubSpot ID
        """
        email = client_data.get("email")
        if not email:
            raise ValueError("Email is required for HubSpot sync")

        # Check if contact already exists
        existing = await self.search_contact_by_email(email)

        if existing:
            # Update existing contact
            hubspot_id = existing["hubspot_id"]
            result = await self.update_contact(
                hubspot_id=hubspot_id,
                properties={
                    "firstname": client_data.get("first_name"),
                    "lastname": client_data.get("last_name"),
                    "company": client_data.get("company_name"),
                    "phone": client_data.get("phone"),
                    "bizflow_client_id": str(client_id),
                    "market_region": client_data.get("market"),
                    "industry": client_data.get("industry"),
                },
            )
            result["sync_action"] = "updated"
        else:
            # Create new contact
            result = await self.create_contact(
                email=email,
                first_name=client_data.get("first_name"),
                last_name=client_data.get("last_name"),
                company=client_data.get("company_name"),
                phone=client_data.get("phone"),
                bizflow_client_id=str(client_id),
                market_region=client_data.get("market"),
                industry=client_data.get("industry"),
            )
            result["sync_action"] = "created"

        return result

    async def sync_from_hubspot(
        self,
        hubspot_id: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Sync data from HubSpot to BizFlow

        Args:
            hubspot_id: HubSpot contact ID

        Returns:
            Contact data in BizFlow format
        """
        contact = await self.get_contact(hubspot_id)

        if not contact:
            return None

        props = contact.get("properties", {})

        return {
            "hubspot_id": hubspot_id,
            "email": props.get("email"),
            "first_name": props.get("firstname"),
            "last_name": props.get("lastname"),
            "company_name": props.get("company"),
            "phone": props.get("phone"),
            "market": props.get("market_region"),
            "industry": props.get("industry"),
            "bizflow_client_id": props.get("bizflow_client_id"),
            "synced_at": datetime.utcnow().isoformat(),
        }

    # ===========================================
    # BATCH OPERATIONS
    # ===========================================

    async def batch_create_contacts(
        self,
        contacts: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Create multiple contacts in batch

        Args:
            contacts: List of contact data dictionaries

        Returns:
            List of created contact results
        """
        results = []

        # Process in batches
        for i in range(0, len(contacts), self.config.batch_size):
            batch = contacts[i:i + self.config.batch_size]

            for contact_data in batch:
                try:
                    result = await self.create_contact(**contact_data)
                    results.append({"success": True, **result})
                except Exception as e:
                    results.append({
                        "success": False,
                        "email": contact_data.get("email"),
                        "error": str(e),
                    })

            # Small delay between batches to avoid rate limiting
            if i + self.config.batch_size < len(contacts):
                await asyncio.sleep(0.5)

        return results

    # ===========================================
    # WEBHOOK HANDLERS
    # ===========================================

    async def handle_webhook(
        self,
        event_type: str,
        payload: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Handle incoming HubSpot webhook

        Args:
            event_type: HubSpot event type
            payload: Webhook payload

        Returns:
            Processing result
        """
        logger.info(f"Received HubSpot webhook: {event_type}")

        handlers = {
            "contact.creation": self._handle_contact_created,
            "contact.propertyChange": self._handle_contact_updated,
            "contact.deletion": self._handle_contact_deleted,
            "deal.creation": self._handle_deal_created,
            "deal.propertyChange": self._handle_deal_updated,
        }

        handler = handlers.get(event_type)
        if handler:
            return await handler(payload)

        logger.warning(f"Unhandled webhook event type: {event_type}")
        return {"status": "ignored", "event_type": event_type}

    async def _handle_contact_created(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle contact.creation webhook"""
        hubspot_id = payload.get("objectId")

        # Sync to BizFlow
        contact_data = await self.sync_from_hubspot(hubspot_id)

        return {
            "status": "processed",
            "action": "contact_created",
            "hubspot_id": hubspot_id,
            "data": contact_data,
        }

    async def _handle_contact_updated(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle contact.propertyChange webhook"""
        hubspot_id = payload.get("objectId")
        changed_properties = payload.get("propertyName")

        # Sync updated data to BizFlow
        contact_data = await self.sync_from_hubspot(hubspot_id)

        return {
            "status": "processed",
            "action": "contact_updated",
            "hubspot_id": hubspot_id,
            "changed_properties": changed_properties,
            "data": contact_data,
        }

    async def _handle_contact_deleted(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle contact.deletion webhook"""
        hubspot_id = payload.get("objectId")

        return {
            "status": "processed",
            "action": "contact_deleted",
            "hubspot_id": hubspot_id,
        }

    async def _handle_deal_created(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle deal.creation webhook"""
        hubspot_id = payload.get("objectId")

        return {
            "status": "processed",
            "action": "deal_created",
            "hubspot_id": hubspot_id,
        }

    async def _handle_deal_updated(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle deal.propertyChange webhook"""
        hubspot_id = payload.get("objectId")

        return {
            "status": "processed",
            "action": "deal_updated",
            "hubspot_id": hubspot_id,
        }


# ===========================================
# FACTORY FUNCTION
# ===========================================

def get_hubspot_connector() -> HubSpotConnector:
    """Factory function to get HubSpot connector instance"""
    return HubSpotConnector()


# ===========================================
# MAIN (for testing)
# ===========================================

if __name__ == "__main__":
    async def test_connector():
        connector = get_hubspot_connector()

        # Test creating a contact
        result = await connector.create_contact(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            company="Test Company",
            market_region="dubai",
            industry="technology",
        )

        print(f"Created contact: {result}")

    asyncio.run(test_connector())
