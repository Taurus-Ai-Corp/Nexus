#!/usr/bin/env python3
"""
NEURAL COMMERCE SYSTEMS - B2B Order Processing Automation Agent
Intelligent automation for complete B2B order lifecycle management
"""

import asyncio
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import logging
from decimal import Decimal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OrderStatus(Enum):
    RECEIVED = "received"
    VALIDATED = "validated"
    APPROVED = "approved"
    PROCESSING = "processing"
    MANUFACTURING = "manufacturing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class OrderType(Enum):
    STANDARD = "standard"
    CUSTOM = "custom"
    BULK = "bulk"
    RECURRING = "recurring"
    URGENT = "urgent"
    PROTOTYPE = "prototype"

class PaymentTerms(Enum):
    NET_30 = "net_30"
    NET_60 = "net_60"
    NET_90 = "net_90"
    COD = "cash_on_delivery"
    PREPAID = "prepaid"
    CREDIT_TERMS = "credit_terms"

@dataclass
class B2BCustomer:
    """B2B Customer profile"""
    customer_id: str
    company_name: str
    industry: str
    credit_limit: Decimal
    payment_terms: PaymentTerms
    preferred_shipping: str
    account_manager: str
    special_instructions: List[str]
    order_history_months: int
    average_order_value: Decimal
    payment_reliability_score: float

@dataclass
class OrderLineItem:
    """Individual order line item"""
    item_id: str
    product_sku: str
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    specifications: Dict[str, Any]
    delivery_requirements: Dict[str, Any]
    availability_status: str

@dataclass
class B2BOrder:
    """Complete B2B order structure"""
    order_id: str
    customer: B2BCustomer
    order_type: OrderType
    status: OrderStatus
    line_items: List[OrderLineItem]
    subtotal: Decimal
    tax_amount: Decimal
    shipping_cost: Decimal
    total_amount: Decimal
    requested_delivery_date: datetime
    estimated_delivery_date: datetime
    special_instructions: List[str]
    approval_requirements: List[str]
    created_at: datetime
    updated_at: datetime
    processing_notes: List[Dict[str, Any]]

@dataclass
class OrderValidationResult:
    """Order validation result"""
    is_valid: bool
    validation_score: float
    issues: List[Dict[str, Any]]
    warnings: List[Dict[str, Any]]
    recommendations: List[str]
    auto_approval_eligible: bool

class B2BOrderProcessingAgent:
    """
    Advanced B2B order processing automation providing:
    - Intelligent order validation and approval
    - Automated inventory allocation
    - Dynamic pricing and discount application
    - Supply chain coordination
    - Customer communication automation
    - Exception handling and escalation
    """
    
    def __init__(self):
        self.name = "b2b_order_processing"
        self.description = "Intelligent B2B order lifecycle automation"
        self.capabilities = [
            "order_validation",
            "inventory_allocation", 
            "pricing_optimization",
            "approval_workflows",
            "supply_chain_coordination",
            "customer_communication",
            "exception_handling",
            "performance_analytics"
        ]
        
        # Initialize business rules engine
        self.business_rules = self._initialize_business_rules()
        
        # Initialize validation thresholds
        self.validation_thresholds = self._initialize_validation_thresholds()
        
        # Mock inventory system
        self.inventory_system = self._initialize_inventory_system()
    
    def _initialize_business_rules(self) -> Dict[str, Any]:
        """Initialize B2B business rules"""
        return {
            "auto_approval_limits": {
                "standard_customers": Decimal("50000"),
                "premium_customers": Decimal("100000"),
                "new_customers": Decimal("10000")
            },
            "credit_checks": {
                "required_for_amount": Decimal("25000"),
                "max_credit_utilization": 0.8,
                "payment_history_threshold": 0.85
            },
            "inventory_allocation": {
                "standard_reserve_percentage": 0.15,
                "premium_customer_priority": True,
                "minimum_stock_threshold": 10
            },
            "pricing_rules": {
                "volume_discounts": {
                    1000: 0.05,  # 5% discount for 1000+ units
                    5000: 0.10,  # 10% discount for 5000+ units
                    10000: 0.15  # 15% discount for 10000+ units
                },
                "customer_tier_discounts": {
                    "premium": 0.08,
                    "standard": 0.03,
                    "new": 0.0
                }
            },
            "delivery_requirements": {
                "standard_lead_time": 14,  # days
                "rush_surcharge": 0.25,
                "custom_lead_time": 30
            }
        }
    
    def _initialize_validation_thresholds(self) -> Dict[str, float]:
        """Initialize order validation thresholds"""
        return {
            "minimum_order_score": 0.7,
            "auto_approval_score": 0.85,
            "credit_check_score": 0.8,
            "inventory_availability_score": 0.9,
            "compliance_score": 0.95
        }
    
    def _initialize_inventory_system(self) -> Dict[str, Any]:
        """Mock inventory system initialization"""
        return {
            "SKU001": {"available": 1500, "reserved": 200, "incoming": 500, "lead_time": 7},
            "SKU002": {"available": 750, "reserved": 100, "incoming": 200, "lead_time": 14},
            "SKU003": {"available": 2000, "reserved": 300, "incoming": 1000, "lead_time": 10},
            "SKU004": {"available": 50, "reserved": 20, "incoming": 100, "lead_time": 21},
            "SKU005": {"available": 890, "reserved": 150, "incoming": 300, "lead_time": 5}
        }
    
    async def process_incoming_order(self, order_data: Dict[str, Any]) -> Tuple[B2BOrder, OrderValidationResult]:
        """Process incoming B2B order with full validation and automation"""
        try:
            logger.info(f"📦 Processing incoming B2B order...")
            
            # Parse and structure order data
            order = await self._parse_order_data(order_data)
            
            # Validate order comprehensively
            validation_result = await self._validate_order(order)
            
            # Apply business rules and pricing
            order = await self._apply_business_rules(order)
            
            # Allocate inventory if validation passes
            if validation_result.is_valid:
                order = await self._allocate_inventory(order)
            
            # Route for approval if needed
            if not validation_result.auto_approval_eligible:
                order = await self._route_for_approval(order, validation_result)
            else:
                order.status = OrderStatus.APPROVED
                order = await self._auto_approve_order(order)
            
            # Initialize customer communication
            await self._send_order_confirmation(order)
            
            # Update order tracking
            order.updated_at = datetime.now()
            order.processing_notes.append({
                "timestamp": datetime.now().isoformat(),
                "action": "order_received_and_processed",
                "details": f"Validation score: {validation_result.validation_score}",
                "auto_approved": validation_result.auto_approval_eligible
            })
            
            logger.info(f"✅ Order {order.order_id} processed successfully")
            return order, validation_result
            
        except Exception as e:
            logger.error(f"❌ Order processing failed: {e}")
            raise
    
    async def _parse_order_data(self, order_data: Dict[str, Any]) -> B2BOrder:
        """Parse incoming order data into structured B2B order"""
        # Create customer profile
        customer_data = order_data.get("customer", {})
        customer = B2BCustomer(
            customer_id=customer_data.get("customer_id", str(uuid.uuid4())),
            company_name=customer_data.get("company_name", "Unknown Company"),
            industry=customer_data.get("industry", "general"),
            credit_limit=Decimal(str(customer_data.get("credit_limit", 100000))),
            payment_terms=PaymentTerms(customer_data.get("payment_terms", "net_30")),
            preferred_shipping=customer_data.get("preferred_shipping", "standard"),
            account_manager=customer_data.get("account_manager", "unassigned"),
            special_instructions=customer_data.get("special_instructions", []),
            order_history_months=customer_data.get("order_history_months", 0),
            average_order_value=Decimal(str(customer_data.get("average_order_value", 25000))),
            payment_reliability_score=customer_data.get("payment_reliability_score", 0.8)
        )
        
        # Parse line items
        line_items = []
        for item_data in order_data.get("line_items", []):
            line_item = OrderLineItem(
                item_id=str(uuid.uuid4()),
                product_sku=item_data.get("sku", ""),
                product_name=item_data.get("product_name", ""),
                quantity=item_data.get("quantity", 0),
                unit_price=Decimal(str(item_data.get("unit_price", 0))),
                total_price=Decimal(str(item_data.get("quantity", 0))) * Decimal(str(item_data.get("unit_price", 0))),
                specifications=item_data.get("specifications", {}),
                delivery_requirements=item_data.get("delivery_requirements", {}),
                availability_status="pending_check"
            )
            line_items.append(line_item)
        
        # Calculate totals
        subtotal = sum(item.total_price for item in line_items)
        tax_rate = Decimal("0.08")  # 8% tax
        tax_amount = subtotal * tax_rate
        shipping_cost = Decimal(str(order_data.get("shipping_cost", 500)))
        total_amount = subtotal + tax_amount + shipping_cost
        
        # Create order
        order = B2BOrder(
            order_id=order_data.get("order_id", f"ORD-{uuid.uuid4().hex[:8].upper()}"),
            customer=customer,
            order_type=OrderType(order_data.get("order_type", "standard")),
            status=OrderStatus.RECEIVED,
            line_items=line_items,
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_cost=shipping_cost,
            total_amount=total_amount,
            requested_delivery_date=datetime.fromisoformat(
                order_data.get("requested_delivery_date", 
                              (datetime.now() + timedelta(days=30)).isoformat())
            ),
            estimated_delivery_date=datetime.now() + timedelta(days=14),
            special_instructions=order_data.get("special_instructions", []),
            approval_requirements=[],
            created_at=datetime.now(),
            updated_at=datetime.now(),
            processing_notes=[]
        )
        
        return order
    
    async def _validate_order(self, order: B2BOrder) -> OrderValidationResult:
        """Comprehensive B2B order validation"""
        issues = []
        warnings = []
        recommendations = []
        validation_scores = {}
        
        # Customer validation
        customer_score = await self._validate_customer(order.customer, issues, warnings)
        validation_scores["customer"] = customer_score
        
        # Inventory validation  
        inventory_score = await self._validate_inventory_availability(order.line_items, issues, warnings)
        validation_scores["inventory"] = inventory_score
        
        # Credit validation
        credit_score = await self._validate_credit_terms(order, issues, warnings)
        validation_scores["credit"] = credit_score
        
        # Business rules validation
        business_score = await self._validate_business_rules(order, issues, warnings)
        validation_scores["business_rules"] = business_score
        
        # Compliance validation
        compliance_score = await self._validate_compliance(order, issues, warnings)
        validation_scores["compliance"] = compliance_score
        
        # Calculate overall validation score
        weights = {
            "customer": 0.2,
            "inventory": 0.25, 
            "credit": 0.2,
            "business_rules": 0.2,
            "compliance": 0.15
        }
        
        overall_score = sum(score * weights[category] for category, score in validation_scores.items())
        
        # Generate recommendations
        if overall_score < self.validation_thresholds["minimum_order_score"]:
            recommendations.append("Order requires manual review before processing")
        if inventory_score < 0.8:
            recommendations.append("Consider alternative products or partial fulfillment")
        if credit_score < 0.8:
            recommendations.append("Require prepayment or credit approval")
        
        # Determine auto-approval eligibility
        auto_approval_eligible = (
            overall_score >= self.validation_thresholds["auto_approval_score"] and
            len(issues) == 0 and
            order.total_amount <= self.business_rules["auto_approval_limits"]["standard_customers"]
        )
        
        return OrderValidationResult(
            is_valid=overall_score >= self.validation_thresholds["minimum_order_score"],
            validation_score=round(overall_score, 3),
            issues=issues,
            warnings=warnings,
            recommendations=recommendations,
            auto_approval_eligible=auto_approval_eligible
        )
    
    async def _validate_customer(self, customer: B2BCustomer, issues: List, warnings: List) -> float:
        """Validate customer information and standing"""
        score = 1.0
        
        # Check customer information completeness
        if not customer.company_name or customer.company_name == "Unknown Company":
            issues.append({
                "type": "customer_info",
                "severity": "high",
                "message": "Missing or invalid company name"
            })
            score -= 0.3
        
        # Check payment reliability
        if customer.payment_reliability_score < 0.7:
            warnings.append({
                "type": "payment_history",
                "severity": "medium",
                "message": f"Customer payment reliability below threshold: {customer.payment_reliability_score}"
            })
            score -= 0.2
        
        # Check credit limit availability
        if customer.average_order_value > customer.credit_limit * Decimal("0.8"):
            warnings.append({
                "type": "credit_utilization",
                "severity": "medium", 
                "message": "Order approaching customer credit limit"
            })
            score -= 0.1
        
        return max(0, score)
    
    async def _validate_inventory_availability(self, line_items: List[OrderLineItem], 
                                             issues: List, warnings: List) -> float:
        """Validate inventory availability for all line items"""
        total_items = len(line_items)
        available_items = 0
        
        for item in line_items:
            inventory = self.inventory_system.get(item.product_sku)
            
            if not inventory:
                issues.append({
                    "type": "inventory",
                    "severity": "high",
                    "message": f"Product {item.product_sku} not found in inventory"
                })
                continue
            
            available_quantity = inventory["available"] - inventory["reserved"]
            
            if item.quantity <= available_quantity:
                available_items += 1
                item.availability_status = "available"
            elif item.quantity <= available_quantity + inventory["incoming"]:
                available_items += 0.7  # Partial credit for incoming stock
                item.availability_status = "partial_availability"
                warnings.append({
                    "type": "inventory",
                    "severity": "medium",
                    "message": f"Item {item.product_sku}: {available_quantity} available, {item.quantity} requested"
                })
            else:
                item.availability_status = "insufficient_stock"
                issues.append({
                    "type": "inventory",
                    "severity": "high",
                    "message": f"Insufficient inventory for {item.product_sku}"
                })
        
        return available_items / total_items if total_items > 0 else 0
    
    async def _validate_credit_terms(self, order: B2BOrder, issues: List, warnings: List) -> float:
        """Validate credit terms and payment requirements"""
        score = 1.0
        
        # Check if credit check is required
        if order.total_amount >= self.business_rules["credit_checks"]["required_for_amount"]:
            if order.customer.payment_reliability_score < self.business_rules["credit_checks"]["payment_history_threshold"]:
                issues.append({
                    "type": "credit",
                    "severity": "high",
                    "message": "Credit check required - payment history below threshold"
                })
                score -= 0.4
        
        # Check credit utilization
        credit_utilization = float(order.total_amount / order.customer.credit_limit)
        if credit_utilization > self.business_rules["credit_checks"]["max_credit_utilization"]:
            issues.append({
                "type": "credit",
                "severity": "high",
                "message": f"Order exceeds credit utilization limit: {credit_utilization:.1%}"
            })
            score -= 0.3
        
        return max(0, score)
    
    async def _validate_business_rules(self, order: B2BOrder, issues: List, warnings: List) -> float:
        """Validate against business rules"""
        score = 1.0
        
        # Check minimum order requirements
        if order.total_amount < Decimal("500"):  # Minimum $500 order
            warnings.append({
                "type": "business_rules",
                "severity": "low",
                "message": "Order below minimum recommended amount"
            })
            score -= 0.1
        
        # Check delivery date feasibility
        lead_time_required = max(
            self.inventory_system.get(item.product_sku, {}).get("lead_time", 14)
            for item in order.line_items
        )
        
        days_to_delivery = (order.requested_delivery_date - datetime.now()).days
        if days_to_delivery < lead_time_required:
            warnings.append({
                "type": "delivery",
                "severity": "medium",
                "message": f"Requested delivery date may not be achievable (requires {lead_time_required} days)"
            })
            score -= 0.2
        
        return max(0, score)
    
    async def _validate_compliance(self, order: B2BOrder, issues: List, warnings: List) -> float:
        """Validate compliance requirements"""
        score = 1.0
        
        # Check for regulated products (mock validation)
        regulated_skus = ["SKU004"]  # Mock regulated products
        
        for item in order.line_items:
            if item.product_sku in regulated_skus:
                # Check if customer has proper certifications
                if "compliance_certified" not in order.customer.special_instructions:
                    issues.append({
                        "type": "compliance",
                        "severity": "high",
                        "message": f"Product {item.product_sku} requires compliance certification"
                    })
                    score -= 0.3
        
        return max(0, score)
    
    async def _apply_business_rules(self, order: B2BOrder) -> B2BOrder:
        """Apply business rules for pricing, discounts, and terms"""
        # Apply volume discounts
        for item in order.line_items:
            original_price = item.total_price
            
            # Volume discount
            for volume_threshold, discount in sorted(self.business_rules["pricing_rules"]["volume_discounts"].items()):
                if item.quantity >= volume_threshold:
                    discount_amount = original_price * Decimal(str(discount))
                    item.total_price = original_price - discount_amount
                    break
            
            # Customer tier discount
            customer_tier = "standard"  # Would determine from customer data
            if customer_tier in self.business_rules["pricing_rules"]["customer_tier_discounts"]:
                tier_discount = self.business_rules["pricing_rules"]["customer_tier_discounts"][customer_tier]
                tier_discount_amount = item.total_price * Decimal(str(tier_discount))
                item.total_price = item.total_price - tier_discount_amount
        
        # Recalculate order totals
        order.subtotal = sum(item.total_price for item in order.line_items)
        tax_rate = Decimal("0.08")
        order.tax_amount = order.subtotal * tax_rate
        order.total_amount = order.subtotal + order.tax_amount + order.shipping_cost
        
        return order
    
    async def _allocate_inventory(self, order: B2BOrder) -> B2BOrder:
        """Allocate inventory for order items"""
        for item in order.line_items:
            if item.availability_status == "available":
                # Reserve inventory
                if item.product_sku in self.inventory_system:
                    self.inventory_system[item.product_sku]["reserved"] += item.quantity
                    logger.info(f"Reserved {item.quantity} units of {item.product_sku}")
        
        order.processing_notes.append({
            "timestamp": datetime.now().isoformat(),
            "action": "inventory_allocated",
            "details": "Inventory reserved for available items"
        })
        
        return order
    
    async def _route_for_approval(self, order: B2BOrder, validation: OrderValidationResult) -> B2BOrder:
        """Route order for manual approval"""
        # Determine approval requirements based on validation issues
        approval_requirements = []
        
        for issue in validation.issues:
            if issue["type"] == "credit":
                approval_requirements.append("credit_manager_approval")
            elif issue["type"] == "compliance":
                approval_requirements.append("compliance_officer_approval")
            elif issue["type"] == "inventory":
                approval_requirements.append("operations_manager_approval")
        
        if order.total_amount > self.business_rules["auto_approval_limits"]["standard_customers"]:
            approval_requirements.append("sales_manager_approval")
        
        order.approval_requirements = approval_requirements
        order.status = OrderStatus.ON_HOLD
        
        order.processing_notes.append({
            "timestamp": datetime.now().isoformat(),
            "action": "routed_for_approval",
            "details": f"Requires: {', '.join(approval_requirements)}"
        })
        
        logger.info(f"Order {order.order_id} routed for approval: {', '.join(approval_requirements)}")
        return order
    
    async def _auto_approve_order(self, order: B2BOrder) -> B2BOrder:
        """Auto-approve qualifying orders"""
        order.status = OrderStatus.APPROVED
        order.processing_notes.append({
            "timestamp": datetime.now().isoformat(),
            "action": "auto_approved",
            "details": "Order met all auto-approval criteria"
        })
        
        # Schedule for processing
        await self._schedule_order_processing(order)
        
        logger.info(f"Order {order.order_id} auto-approved and scheduled for processing")
        return order
    
    async def _schedule_order_processing(self, order: B2BOrder):
        """Schedule order for production/fulfillment"""
        # Estimate processing timeline
        max_lead_time = max(
            self.inventory_system.get(item.product_sku, {}).get("lead_time", 14)
            for item in order.line_items
        )
        
        order.estimated_delivery_date = datetime.now() + timedelta(days=max_lead_time)
        order.status = OrderStatus.PROCESSING
        
        order.processing_notes.append({
            "timestamp": datetime.now().isoformat(),
            "action": "scheduled_for_processing",
            "details": f"Estimated delivery: {order.estimated_delivery_date.strftime('%Y-%m-%d')}"
        })
    
    async def _send_order_confirmation(self, order: B2BOrder):
        """Send order confirmation to customer"""
        # Mock customer communication
        confirmation_data = {
            "order_id": order.order_id,
            "customer_company": order.customer.company_name,
            "total_amount": float(order.total_amount),
            "status": order.status.value,
            "estimated_delivery": order.estimated_delivery_date.strftime('%Y-%m-%d'),
            "items_count": len(order.line_items)
        }
        
        logger.info(f"📧 Order confirmation sent to {order.customer.company_name} for order {order.order_id}")
        
        order.processing_notes.append({
            "timestamp": datetime.now().isoformat(),
            "action": "confirmation_sent",
            "details": "Order confirmation email sent to customer"
        })
    
    async def update_order_status(self, order_id: str, new_status: OrderStatus, 
                                 notes: str = "") -> Dict[str, Any]:
        """Update order status with tracking"""
        try:
            # Mock order status update
            update_result = {
                "order_id": order_id,
                "previous_status": "processing",  # Would fetch from database
                "new_status": new_status.value,
                "updated_at": datetime.now().isoformat(),
                "notes": notes,
                "updated_by": "system"
            }
            
            # Send status update notification
            await self._send_status_update_notification(order_id, new_status, notes)
            
            logger.info(f"📊 Order {order_id} status updated to {new_status.value}")
            return update_result
            
        except Exception as e:
            logger.error(f"❌ Status update failed for order {order_id}: {e}")
            raise
    
    async def _send_status_update_notification(self, order_id: str, status: OrderStatus, notes: str):
        """Send status update notification to customer"""
        # Mock notification system
        notification_data = {
            "type": "order_status_update",
            "order_id": order_id,
            "new_status": status.value,
            "message": f"Your order {order_id} has been updated to: {status.value}",
            "notes": notes,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"🔔 Status update notification sent for order {order_id}")
    
    async def generate_order_analytics(self, date_range_days: int = 30) -> Dict[str, Any]:
        """Generate order processing analytics"""
        # Mock analytics data
        analytics = {
            "performance_metrics": {
                "total_orders_processed": 1247,
                "auto_approval_rate": 0.78,
                "average_processing_time_hours": 4.2,
                "order_accuracy_rate": 0.96,
                "customer_satisfaction_score": 4.3
            },
            "volume_analysis": {
                "daily_average_orders": 41.6,
                "peak_day_orders": 73,
                "order_value_distribution": {
                    "under_1k": 0.23,
                    "1k_10k": 0.45,
                    "10k_50k": 0.25,
                    "over_50k": 0.07
                }
            },
            "efficiency_metrics": {
                "validation_success_rate": 0.94,
                "inventory_allocation_accuracy": 0.91,
                "delivery_promise_adherence": 0.88,
                "exception_rate": 0.12
            },
            "improvement_opportunities": [
                "Enhance inventory forecasting for better availability",
                "Streamline approval process for mid-tier orders",
                "Improve delivery time estimation accuracy",
                "Automate more customer communications"
            ]
        }
        
        return analytics

async def main():
    """Demo the B2B Order Processing Agent"""
    agent = B2BOrderProcessingAgent()
    
    print("🔄 Neural Commerce Systems - B2B Order Processing Agent")
    print("=" * 60)
    
    # Mock incoming order
    sample_order = {
        "order_id": "ORD-DEMO-001",
        "customer": {
            "customer_id": "CUST-12345",
            "company_name": "TechFlow Manufacturing Inc.",
            "industry": "manufacturing",
            "credit_limit": 150000,
            "payment_terms": "net_30",
            "payment_reliability_score": 0.92
        },
        "order_type": "standard",
        "line_items": [
            {
                "sku": "SKU001",
                "product_name": "Industrial Component A",
                "quantity": 100,
                "unit_price": 45.50
            },
            {
                "sku": "SKU002", 
                "product_name": "Precision Tool B",
                "quantity": 25,
                "unit_price": 125.00
            }
        ],
        "special_instructions": ["Handle with care", "Quality inspection required"],
        "requested_delivery_date": (datetime.now() + timedelta(days=21)).isoformat()
    }
    
    print(f"📦 Processing sample B2B order...")
    order, validation = await agent.process_incoming_order(sample_order)
    
    print(f"\n✅ Order Processing Complete!")
    print(f"Order ID: {order.order_id}")
    print(f"Status: {order.status.value}")
    print(f"Total Amount: ${order.total_amount:,.2f}")
    print(f"Validation Score: {validation.validation_score}")
    print(f"Auto-Approved: {validation.auto_approval_eligible}")
    
    if validation.issues:
        print(f"\n⚠️ Issues Found:")
        for issue in validation.issues:
            print(f"  • {issue['message']} ({issue['severity']})")
    
    print(f"\n📊 Generating analytics...")
    analytics = await agent.generate_order_analytics()
    
    print(f"Auto-Approval Rate: {analytics['performance_metrics']['auto_approval_rate']:.1%}")
    print(f"Average Processing Time: {analytics['performance_metrics']['average_processing_time_hours']} hours")
    print(f"Customer Satisfaction: {analytics['performance_metrics']['customer_satisfaction_score']}/5.0")

if __name__ == "__main__":
    asyncio.run(main())