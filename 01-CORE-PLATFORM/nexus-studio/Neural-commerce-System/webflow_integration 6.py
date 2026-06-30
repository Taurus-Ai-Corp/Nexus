#!/usr/bin/env python3
"""
🪑 Webflow Integration for KAYA-RATTAN E-commerce
Taurus AI Corp - Webflow API integration for KAYA-RATTAN project
"""

import os
import sys
from datetime import datetime
from typing import Any

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from webflow_api_client import create_webflow_client
from webflow_services import get_service


class KayaRattanWebflowIntegration:
    """
    Webflow integration for KAYA-RATTAN E-commerce
    """

    def __init__(self):
        self.client = create_webflow_client()
        self.kaya_service = get_service('kaya_rattan', self.client)

    def sync_product_catalog(self, products: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync product catalog from external systems
        
        Args:
            products: List of product data
            
        Returns:
            Sync result
        """
        try:
            results = {
                'created': 0,
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for product in products:
                try:
                    # Create product in Webflow
                    webflow_product = self.kaya_service.create_product(product)
                    results['created'] += 1

                    # Log analytics
                    analytics_data = {
                        'metric_name': 'product_catalog_sync',
                        'value': 1,
                        'date': datetime.now().isoformat(),
                        'source': 'kaya_rattan',
                        'category': 'inventory',
                        'description': f'Product {product.get("name", "Unknown")} synced'
                    }
                    self.kaya_service.log_analytics(analytics_data)

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'product': product,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Product catalog sync completed: {results["created"]} created, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_order_from_webflow(self, order_data: dict[str, Any]) -> dict[str, Any]:
        """
        Sync order from Webflow form submission or webhook
        
        Args:
            order_data: Order information from Webflow
            
        Returns:
            Sync result
        """
        try:
            # Create order in Webflow
            order = self.kaya_service.create_order(order_data)

            # Create customer if not exists
            customer_data = {
                'name': order_data.get('customer_name', ''),
                'email': order_data.get('customer_email', ''),
                'phone': order_data.get('customer_phone', ''),
                'address': order_data.get('shipping_address', ''),
                'customer_type': 'individual',
                'total_orders': 1,
                'total_spent': order_data.get('total', 0),
                'last_order_date': datetime.now().isoformat()
            }

            customer = self.kaya_service.create_customer(customer_data)

            # Update inventory
            items = order_data.get('items', [])
            for item in items:
                inventory_data = {
                    'product_id': item.get('product_id', ''),
                    'product_name': item.get('product_name', ''),
                    'sku': item.get('sku', ''),
                    'quantity': -item.get('quantity', 0),  # Negative for deduction
                    'location': 'warehouse',
                    'notes': f'Order {order["id"]} fulfillment'
                }
                self.kaya_service.update_inventory(inventory_data)

            return {
                'success': True,
                'order_id': order['id'],
                'customer_id': customer['id'],
                'message': 'Order synced successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def update_inventory_levels(self, inventory_updates: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Update inventory levels from external systems
        
        Args:
            inventory_updates: List of inventory updates
            
        Returns:
            Update result
        """
        try:
            results = {
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for update in inventory_updates:
                try:
                    # Update inventory
                    inventory = self.kaya_service.update_inventory(update)
                    results['updated'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'update': update,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Inventory update completed: {results["updated"]} updated, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_customer_data(self, customers: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync customer data from external systems
        
        Args:
            customers: List of customer data
            
        Returns:
            Sync result
        """
        try:
            results = {
                'created': 0,
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for customer in customers:
                try:
                    # Create customer in Webflow
                    webflow_customer = self.kaya_service.create_customer(customer)
                    results['created'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'customer': customer,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Customer sync completed: {results["created"]} created, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def process_order_fulfillment(self, fulfillment_data: dict[str, Any]) -> dict[str, Any]:
        """
        Process order fulfillment workflow
        
        Args:
            fulfillment_data: Fulfillment information
            
        Returns:
            Fulfillment result
        """
        try:
            order_id = fulfillment_data.get('order_id')
            if not order_id:
                raise ValueError("Order ID is required")

            # Process fulfillment
            result = self.kaya_service.process_order_fulfillment(order_id, fulfillment_data)

            if result['success']:
                # Log analytics
                analytics_data = {
                    'metric_name': 'order_fulfillment',
                    'value': 1,
                    'date': datetime.now().isoformat(),
                    'source': 'kaya_rattan',
                    'category': 'fulfillment',
                    'description': f'Order {order_id} fulfilled successfully'
                }
                self.kaya_service.log_analytics(analytics_data)

            return result

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_ecommerce_analytics(self, analytics_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync e-commerce analytics data
        
        Args:
            analytics_data: List of analytics records
            
        Returns:
            Sync result
        """
        try:
            results = {
                'logged': 0,
                'errors': 0,
                'error_details': []
            }

            for analytics in analytics_data:
                try:
                    # Log analytics
                    self.kaya_service.log_analytics(analytics)
                    results['logged'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'analytics': analytics,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Analytics sync completed: {results["logged"]} logged, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_inventory_report(self) -> dict[str, Any]:
        """
        Generate inventory report from Webflow data
        
        Returns:
            Inventory report
        """
        try:
            # Get inventory data
            inventory = self.kaya_service.get_inventory()

            # Get products data
            products = self.kaya_service.get_products()

            # Generate report
            report = {
                'total_products': len(products.get('items', [])),
                'total_inventory_items': len(inventory.get('items', [])),
                'low_stock_items': [],
                'out_of_stock_items': [],
                'generated_at': datetime.now().isoformat()
            }

            # Analyze inventory levels
            for item in inventory.get('items', []):
                quantity = item.get('fieldData', {}).get('quantity', 0)
                product_name = item.get('fieldData', {}).get('product-name', 'Unknown')

                if quantity <= 0:
                    report['out_of_stock_items'].append({
                        'product': product_name,
                        'quantity': quantity
                    })
                elif quantity <= 10:  # Low stock threshold
                    report['low_stock_items'].append({
                        'product': product_name,
                        'quantity': quantity
                    })

            return {
                'success': True,
                'report': report
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Integration endpoints for KAYA-RATTAN API
def create_kaya_rattan_webflow_endpoints():
    """
    Create Webflow integration endpoints for KAYA-RATTAN API
    """

    integration = KayaRattanWebflowIntegration()

    endpoints = {
        '/api/webflow/kaya/sync-products': {
            'method': 'POST',
            'handler': integration.sync_product_catalog,
            'description': 'Sync product catalog from external systems'
        },
        '/api/webflow/kaya/sync-order': {
            'method': 'POST',
            'handler': integration.sync_order_from_webflow,
            'description': 'Sync order from Webflow form submission'
        },
        '/api/webflow/kaya/update-inventory': {
            'method': 'POST',
            'handler': integration.update_inventory_levels,
            'description': 'Update inventory levels from external systems'
        },
        '/api/webflow/kaya/sync-customers': {
            'method': 'POST',
            'handler': integration.sync_customer_data,
            'description': 'Sync customer data from external systems'
        },
        '/api/webflow/kaya/fulfill-order': {
            'method': 'POST',
            'handler': integration.process_order_fulfillment,
            'description': 'Process order fulfillment workflow'
        },
        '/api/webflow/kaya/sync-analytics': {
            'method': 'POST',
            'handler': integration.sync_ecommerce_analytics,
            'description': 'Sync e-commerce analytics data'
        },
        '/api/webflow/kaya/inventory-report': {
            'method': 'GET',
            'handler': integration.get_inventory_report,
            'description': 'Generate inventory report from Webflow data'
        }
    }

    return endpoints

# Example usage and testing
if __name__ == "__main__":
    print("🪑 Testing Webflow Integration for KAYA-RATTAN E-commerce")
    print("=" * 60)

    try:
        # Create integration
        integration = KayaRattanWebflowIntegration()

        # Test product catalog sync
        print("\n📦 Testing Product Catalog Sync...")
        products = [
            {
                'name': 'Rattan Dining Set',
                'description': 'Beautiful 4-piece rattan dining set',
                'price': 899.99,
                'compare_price': 1199.99,
                'sku': 'RAT-DIN-SET-001',
                'category': 'dining',
                'subcategory': 'sets',
                'material': 'rattan',
                'color': 'natural',
                'dimensions': 'Table: 120cm x 80cm, Chairs: 4 pieces',
                'weight': 45.0,
                'in_stock': True,
                'stock_quantity': 25,
                'images': 'https://example.com/dining-set-1.jpg,https://example.com/dining-set-2.jpg',
                'tags': 'dining,set,rattan,outdoor',
                'seo_title': 'Rattan Dining Set - Premium Outdoor Furniture',
                'seo_description': 'Premium 4-piece rattan dining set for outdoor living'
            },
            {
                'name': 'Rattan Lounge Chair',
                'description': 'Comfortable rattan lounge chair for relaxation',
                'price': 299.99,
                'compare_price': 399.99,
                'sku': 'RAT-LOU-001',
                'category': 'lounge',
                'subcategory': 'chairs',
                'material': 'rattan',
                'color': 'natural',
                'dimensions': '80cm x 70cm x 100cm',
                'weight': 18.5,
                'in_stock': True,
                'stock_quantity': 40,
                'images': 'https://example.com/lounge-chair-1.jpg',
                'tags': 'lounge,chair,rattan,comfort',
                'seo_title': 'Rattan Lounge Chair - Comfortable Outdoor Seating',
                'seo_description': 'Premium rattan lounge chair for ultimate comfort'
            }
        ]

        product_result = integration.sync_product_catalog(products)
        print(f"✅ Product catalog sync: {product_result}")

        # Test order sync
        print("\n🛒 Testing Order Sync...")
        order_data = {
            'order_number': 'ORD-KAYA-2024-001',
            'customer_name': 'Sarah Johnson',
            'customer_email': 'sarah@example.com',
            'customer_phone': '+1234567890',
            'shipping_address': '456 Oak Street, City, State 54321',
            'billing_address': '456 Oak Street, City, State 54321',
            'items': [
                {
                    'product_id': 'product_1',
                    'product_name': 'Rattan Dining Set',
                    'sku': 'RAT-DIN-SET-001',
                    'quantity': 1,
                    'price': 899.99
                }
            ],
            'subtotal': 899.99,
            'tax': 72.00,
            'shipping': 50.00,
            'total': 1021.99,
            'status': 'pending',
            'payment_method': 'credit_card',
            'payment_status': 'paid',
            'shipping_method': 'standard',
            'notes': 'Customer requested white glove delivery'
        }

        order_result = integration.sync_order_from_webflow(order_data)
        print(f"✅ Order sync: {order_result}")

        # Test inventory update
        print("\n📊 Testing Inventory Update...")
        inventory_updates = [
            {
                'product_id': 'product_1',
                'product_name': 'Rattan Dining Set',
                'sku': 'RAT-DIN-SET-001',
                'quantity': 24,  # Reduced by 1 for the order
                'reserved': 0,
                'available': 24,
                'location': 'warehouse',
                'notes': 'Stock updated after order fulfillment'
            }
        ]

        inventory_result = integration.update_inventory_levels(inventory_updates)
        print(f"✅ Inventory update: {inventory_result}")

        # Test inventory report
        print("\n📈 Testing Inventory Report...")
        report_result = integration.get_inventory_report()
        print(f"✅ Inventory report: {report_result}")

        print("\n🎉 All KAYA-RATTAN integration tests completed successfully!")

    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
