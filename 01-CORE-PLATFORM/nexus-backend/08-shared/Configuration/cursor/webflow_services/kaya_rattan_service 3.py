#!/usr/bin/env python3
"""
🪑 KAYA-RATTAN Webflow Service
Taurus AI Corp - Specialized Webflow integration for KAYA-RATTAN E-commerce
"""

from datetime import datetime
from typing import Any

from webflow_api_client import WebflowAPIClient, WebflowAPIError
from webflow_config import get_project_config


class KayaRattanWebflowService:
    """
    Specialized Webflow service for KAYA-RATTAN E-commerce operations
    """

    def __init__(self, client: WebflowAPIClient):
        self.client = client
        self.config = get_project_config('kaya_rattan')
        self.site_id = self.config.site_id

        if not self.site_id:
            raise ValueError("KAYA-RATTAN site ID not configured. Run webflow_oauth_setup.py first.")

    def create_product(self, product_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new product in Webflow
        
        Args:
            product_data: Product information including name, price, description, etc.
            
        Returns:
            Created product data
        """
        if 'products' not in self.config.collection_ids:
            raise ValueError("Products collection not configured")

        collection_id = self.config.collection_ids['products']

        webflow_product = {
            'fieldData': {
                'name': product_data.get('name', ''),
                'description': product_data.get('description', ''),
                'price': product_data.get('price', 0),
                'compare-price': product_data.get('compare_price', 0),
                'sku': product_data.get('sku', ''),
                'category': product_data.get('category', 'rattan_furniture'),
                'subcategory': product_data.get('subcategory', ''),
                'material': product_data.get('material', 'rattan'),
                'color': product_data.get('color', ''),
                'dimensions': product_data.get('dimensions', ''),
                'weight': product_data.get('weight', 0),
                'in-stock': product_data.get('in_stock', True),
                'stock-quantity': product_data.get('stock_quantity', 0),
                'images': product_data.get('images', ''),
                'tags': product_data.get('tags', ''),
                'seo-title': product_data.get('seo_title', ''),
                'seo-description': product_data.get('seo_description', ''),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_product['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_product,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create product: {e.message}")

    def update_product_stock(self, product_id: str, stock_quantity: int, in_stock: bool = None) -> dict[str, Any]:
        """
        Update product stock information
        
        Args:
            product_id: Webflow item ID
            stock_quantity: New stock quantity
            in_stock: Whether product is in stock
            
        Returns:
            Updated product data
        """
        if 'products' not in self.config.collection_ids:
            raise ValueError("Products collection not configured")

        collection_id = self.config.collection_ids['products']

        update_data = {
            'fieldData': {
                'stock-quantity': stock_quantity,
                'updated-date': datetime.now().isoformat()
            }
        }

        if in_stock is not None:
            update_data['fieldData']['in-stock'] = in_stock

        try:
            result = self.client.update_item(collection_id, product_id, update_data,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [product_id])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update product stock: {e.message}")

    def create_order(self, order_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new order
        
        Args:
            order_data: Order information
            
        Returns:
            Created order data
        """
        if 'orders' not in self.config.collection_ids:
            raise ValueError("Orders collection not configured")

        collection_id = self.config.collection_ids['orders']

        webflow_order = {
            'fieldData': {
                'order-number': order_data.get('order_number', ''),
                'customer-name': order_data.get('customer_name', ''),
                'customer-email': order_data.get('customer_email', ''),
                'customer-phone': order_data.get('customer_phone', ''),
                'shipping-address': order_data.get('shipping_address', ''),
                'billing-address': order_data.get('billing_address', ''),
                'items': order_data.get('items', ''),
                'subtotal': order_data.get('subtotal', 0),
                'tax': order_data.get('tax', 0),
                'shipping': order_data.get('shipping', 0),
                'total': order_data.get('total', 0),
                'status': order_data.get('status', 'pending'),
                'payment-method': order_data.get('payment_method', ''),
                'payment-status': order_data.get('payment_status', 'pending'),
                'shipping-method': order_data.get('shipping_method', ''),
                'tracking-number': order_data.get('tracking_number', ''),
                'notes': order_data.get('notes', ''),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_order['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_order,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create order: {e.message}")

    def update_order_status(self, order_id: str, status: str, tracking_number: str = None) -> dict[str, Any]:
        """
        Update order status and tracking information
        
        Args:
            order_id: Webflow item ID
            status: New order status
            tracking_number: Optional tracking number
            
        Returns:
            Updated order data
        """
        if 'orders' not in self.config.collection_ids:
            raise ValueError("Orders collection not configured")

        collection_id = self.config.collection_ids['orders']

        update_data = {
            'fieldData': {
                'status': status,
                'updated-date': datetime.now().isoformat()
            }
        }

        if tracking_number:
            update_data['fieldData']['tracking-number'] = tracking_number

        try:
            result = self.client.update_item(collection_id, order_id, update_data,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [order_id])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update order status: {e.message}")

    def create_customer(self, customer_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new customer
        
        Args:
            customer_data: Customer information
            
        Returns:
            Created customer data
        """
        if 'customers' not in self.config.collection_ids:
            raise ValueError("Customers collection not configured")

        collection_id = self.config.collection_ids['customers']

        webflow_customer = {
            'fieldData': {
                'name': customer_data.get('name', ''),
                'email': customer_data.get('email', ''),
                'phone': customer_data.get('phone', ''),
                'address': customer_data.get('address', ''),
                'city': customer_data.get('city', ''),
                'state': customer_data.get('state', ''),
                'zip-code': customer_data.get('zip_code', ''),
                'country': customer_data.get('country', ''),
                'customer-type': customer_data.get('customer_type', 'individual'),
                'total-orders': customer_data.get('total_orders', 0),
                'total-spent': customer_data.get('total_spent', 0),
                'last-order-date': customer_data.get('last_order_date', ''),
                'preferences': customer_data.get('preferences', ''),
                'notes': customer_data.get('notes', ''),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_customer['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_customer,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create customer: {e.message}")

    def update_inventory(self, inventory_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update inventory levels
        
        Args:
            inventory_data: Inventory information
            
        Returns:
            Created inventory record
        """
        if 'inventory' not in self.config.collection_ids:
            raise ValueError("Inventory collection not configured")

        collection_id = self.config.collection_ids['inventory']

        webflow_inventory = {
            'fieldData': {
                'product-id': inventory_data.get('product_id', ''),
                'product-name': inventory_data.get('product_name', ''),
                'sku': inventory_data.get('sku', ''),
                'quantity': inventory_data.get('quantity', 0),
                'reserved': inventory_data.get('reserved', 0),
                'available': inventory_data.get('available', 0),
                'location': inventory_data.get('location', 'warehouse'),
                'last-updated': datetime.now().isoformat(),
                'notes': inventory_data.get('notes', '')
            }
        }

        webflow_inventory['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_inventory,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update inventory: {e.message}")

    def get_products(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get products from Webflow"""
        if 'products' not in self.config.collection_ids:
            raise ValueError("Products collection not configured")

        collection_id = self.config.collection_ids['products']
        return self.client.get_items(collection_id, limit, offset)

    def get_orders(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get orders from Webflow"""
        if 'orders' not in self.config.collection_ids:
            raise ValueError("Orders collection not configured")

        collection_id = self.config.collection_ids['orders']
        return self.client.get_items(collection_id, limit, offset)

    def get_customers(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get customers from Webflow"""
        if 'customers' not in self.config.collection_ids:
            raise ValueError("Customers collection not configured")

        collection_id = self.config.collection_ids['customers']
        return self.client.get_items(collection_id, limit, offset)

    def get_inventory(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get inventory from Webflow"""
        if 'inventory' not in self.config.collection_ids:
            raise ValueError("Inventory collection not configured")

        collection_id = self.config.collection_ids['inventory']
        return self.client.get_items(collection_id, limit, offset)

    def setup_webhooks(self) -> list[dict[str, Any]]:
        """
        Setup webhooks for KAYA-RATTAN integration
        
        Returns:
            List of created webhooks
        """
        webhooks = []

        for event_type, endpoint_url in self.config.webhook_endpoints.items():
            try:
                webhook_data = {
                    'triggerType': event_type,
                    'url': endpoint_url,
                    'filter': {
                        'collectionId': self.config.collection_ids.get('orders', '')
                    }
                }

                webhook = self.client.create_webhook(self.site_id, webhook_data)
                webhooks.append(webhook)

                print(f"✅ Created webhook for {event_type}")

            except WebflowAPIError as e:
                print(f"❌ Failed to create webhook for {event_type}: {e.message}")

        return webhooks

    def sync_ecommerce_data(self, ecommerce_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync e-commerce data with Webflow
        
        Args:
            ecommerce_data: List of e-commerce records to sync
            
        Returns:
            Sync results
        """
        results = {
            'products_created': 0,
            'orders_created': 0,
            'customers_created': 0,
            'inventory_updated': 0,
            'errors': 0,
            'error_details': []
        }

        for record in ecommerce_data:
            try:
                record_type = record.get('type', 'product')

                if record_type == 'product':
                    self.create_product(record)
                    results['products_created'] += 1
                elif record_type == 'order':
                    self.create_order(record)
                    results['orders_created'] += 1
                elif record_type == 'customer':
                    self.create_customer(record)
                    results['customers_created'] += 1
                elif record_type == 'inventory':
                    self.update_inventory(record)
                    results['inventory_updated'] += 1

            except Exception as e:
                results['errors'] += 1
                results['error_details'].append({
                    'record': record,
                    'error': str(e)
                })

        return results

    def process_order_fulfillment(self, order_id: str, fulfillment_data: dict[str, Any]) -> dict[str, Any]:
        """
        Process order fulfillment
        
        Args:
            order_id: Order ID
            fulfillment_data: Fulfillment information
            
        Returns:
            Fulfillment results
        """
        try:
            # Update order status
            self.update_order_status(
                order_id,
                fulfillment_data.get('status', 'fulfilled'),
                fulfillment_data.get('tracking_number')
            )

            # Update inventory for each item
            items = fulfillment_data.get('items', [])
            for item in items:
                inventory_data = {
                    'product_id': item.get('product_id'),
                    'product_name': item.get('product_name'),
                    'sku': item.get('sku'),
                    'quantity': -item.get('quantity', 0),  # Negative for deduction
                    'location': 'warehouse',
                    'notes': f'Order fulfillment for order {order_id}'
                }
                self.update_inventory(inventory_data)

            return {
                'success': True,
                'order_id': order_id,
                'status': fulfillment_data.get('status', 'fulfilled'),
                'tracking_number': fulfillment_data.get('tracking_number')
            }

        except Exception as e:
            return {
                'success': False,
                'order_id': order_id,
                'error': str(e)
            }

# Factory function
def create_kaya_rattan_service(client: WebflowAPIClient = None) -> KayaRattanWebflowService:
    """
    Create KAYA-RATTAN Webflow service instance
    
    Args:
        client: Optional Webflow API client
        
    Returns:
        KayaRattanWebflowService instance
    """
    if client is None:
        from webflow_api_client import create_webflow_client
        client = create_webflow_client()

    return KayaRattanWebflowService(client)

# Example usage
if __name__ == "__main__":
    try:
        # Create service
        service = create_kaya_rattan_service()

        # Test product creation
        product_data = {
            'name': 'Rattan Dining Chair',
            'description': 'Beautiful handcrafted rattan dining chair',
            'price': 299.99,
            'compare_price': 399.99,
            'sku': 'RAT-DIN-001',
            'category': 'dining',
            'subcategory': 'chairs',
            'material': 'rattan',
            'color': 'natural',
            'dimensions': '24" x 20" x 32"',
            'weight': 15.5,
            'in_stock': True,
            'stock_quantity': 50,
            'images': 'https://example.com/chair1.jpg,https://example.com/chair2.jpg',
            'tags': 'dining,chair,rattan,handcrafted',
            'seo_title': 'Rattan Dining Chair - Handcrafted Furniture',
            'seo_description': 'Premium rattan dining chair for your home'
        }

        product = service.create_product(product_data)
        print(f"✅ Created product: {product['id']}")

        # Test order creation
        order_data = {
            'order_number': 'ORD-2024-001',
            'customer_name': 'John Smith',
            'customer_email': 'john@example.com',
            'customer_phone': '+1234567890',
            'shipping_address': '123 Main St, City, State 12345',
            'billing_address': '123 Main St, City, State 12345',
            'items': 'Rattan Dining Chair x2',
            'subtotal': 599.98,
            'tax': 48.00,
            'shipping': 25.00,
            'total': 672.98,
            'status': 'pending',
            'payment_method': 'credit_card',
            'payment_status': 'paid',
            'shipping_method': 'standard',
            'notes': 'Customer requested expedited shipping'
        }

        order = service.create_order(order_data)
        print(f"✅ Created order: {order['id']}")

        # Test customer creation
        customer_data = {
            'name': 'John Smith',
            'email': 'john@example.com',
            'phone': '+1234567890',
            'address': '123 Main St',
            'city': 'City',
            'state': 'State',
            'zip_code': '12345',
            'country': 'USA',
            'customer_type': 'individual',
            'total_orders': 1,
            'total_spent': 672.98,
            'last_order_date': datetime.now().isoformat(),
            'preferences': 'rattan furniture, natural colors',
            'notes': 'First-time customer'
        }

        customer = service.create_customer(customer_data)
        print(f"✅ Created customer: {customer['id']}")

        # Test inventory update
        inventory_data = {
            'product_id': product['id'],
            'product_name': 'Rattan Dining Chair',
            'sku': 'RAT-DIN-001',
            'quantity': 48,  # Reduced by 2 for the order
            'reserved': 0,
            'available': 48,
            'location': 'warehouse',
            'notes': 'Stock updated after order fulfillment'
        }

        inventory = service.update_inventory(inventory_data)
        print(f"✅ Updated inventory: {inventory['id']}")

        print("\n🎉 KAYA-RATTAN Webflow service test completed successfully!")

    except Exception as e:
        print(f"❌ Test failed: {e}")
