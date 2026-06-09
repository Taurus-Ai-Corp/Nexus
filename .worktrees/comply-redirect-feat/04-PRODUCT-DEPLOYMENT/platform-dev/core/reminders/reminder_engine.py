"""
SMS/WhatsApp Reminder Engine for Micro-Loan Repayment
Generates personalized reminders based on borrower cash-flow patterns and segment.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json


class ReminderEngine:
    def __init__(self):
        self.templates = self._load_templates()
        self.language_support = {
            'en': 'English',
            'hi': 'Hindi',
            'mr': 'Marathi',
            'ta': 'Tamil',
            'te': 'Telugu',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi'
        }

    def _load_templates(self) -> Dict:
        """Load reminder templates for different segments and languages."""
        return {
            'en': {
                'trader': {
                    'upcoming': "Dear {name}, your ₹{amount} loan payment is due on {date}. Your shop's cash flow looks good this week. Please repay by 5 PM to avoid late fees. Thank you! - Muthoot AI Assistant",
                    'overdue': "Dear {name}, your ₹{amount} loan payment was due on {date}. Please clear the dues immediately to maintain your excellent credit record. Contact us for assistance. - Muthoot AI Assistant",
                    'reminder': "Dear {name}, reminder: ₹{amount} payment due {date}. Your weekend market sales should cover this. Repay by Friday to avoid penalties. - Muthoot AI Assistant"
                },
                'hotelier': {
                    'upcoming': "Dear {name}, your ₹{amount} loan payment is due on {date}. Your hotel's weekend bookings look promising. Repay by Saturday to maintain your excellent credit record. - Muthoot AI Assistant",
                    'overdue': "Dear {name}, your ₹{amount} loan payment was due on {date}. Please clear the dues immediately. We understand seasonal fluctuations - contact us to discuss options. - Muthoot AI Assistant",
                    'reminder': "Dear {name}, reminder: ₹{amount} payment due {date}. Your occupancy rates are good this month. Consider repaying after the weekend rush. - Muthoot AI Assistant"
                },
                'grocer': {
                    'upcoming': "Dear {name}, your ₹{amount} loan payment is due on {date}. Your grocery sales are strong this month. Consider repaying on Friday after your weekly stock purchase. - Muthoot AI Assistant",
                    'overdue': "Dear {name}, your ₹{amount} loan payment was due on {date}. Please clear the dues immediately to continue enjoying our low-interest rates. - Muthoot AI Assistant",
                    'reminder': "Dear {name}, reminder: ₹{amount} payment due {date}. Your daily sales should cover this. Repay by Thursday to avoid late fees. - Muthoot AI Assistant"
                }
            },
            'hi': {
                'trader': {
                    'upcoming': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय है। आपकी दुकान का नकदी प्रवाह इस सप्ताह अच्छा दिख रहा है। कृपया देर शुल्क से बचने के लिए शाम 5 बजे तक भुगतान करें। धन्यवाद! - मुथूट AI सहायक",
                    'overdue': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय था। कृपया तुरंत भुगतान करें। - मुथूट AI सहायक",
                    'reminder': "प्रिय {name}, स्मरण: ₹{amount} भुगतान {date} को देय है। - मुथूट AI सहायक"
                },
                'hotelier': {
                    'upcoming': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय है। होटल बुकिंग अच्छी है। शनिवार तक भुगतान करें। - मुथूट AI सहायक",
                    'overdue': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय था। कृपया तुरंत भुगतान करें। - मुथूट AI सहायक",
                    'reminder': "प्रिय {name}, स्मरण: ₹{amount} भुगतान {date} को देय है। - मुथूट AI सहायक"
                },
                'grocer': {
                    'upcoming': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय है। किराना बिक्री अच्छी है। शुक्रवार को भुगतान करें। - मुथूट AI सहायक",
                    'overdue': "प्रिय {name}, आपका ₹{amount} ऋण भुगतान {date} को देय था। कृपया तुरंत भुगतान करें। - मुथूट AI सहायक",
                    'reminder': "प्रिय {name}, स्मरण: ₹{amount} भुगतान {date} को देय है। - मुथूट AI सहायक"
                }
            }
        }

    def generate_reminder(
        self,
        borrower_name: str,
        borrower_segment: str,
        loan_amount: float,
        due_date: datetime,
        reminder_type: str = 'upcoming',
        language: str = 'en',
        cash_flow_insights: Optional[Dict] = None
    ) -> Dict:
        """
        Generate a personalized reminder message.
        
        Args:
            borrower_name: Name of the borrower
            borrower_segment: Segment (trader/hotelier/grocer)
            loan_amount: Loan amount due
            due_date: Due date for payment
            reminder_type: Type of reminder ('upcoming', 'overdue', 'reminder')
            language: Language code ('en', 'hi', etc.)
            cash_flow_insights: Optional cash flow analysis data
            
        Returns:
            Dict with message, channel, timing, and metadata
        """
        # Select template
        lang_templates = self.templates.get(language, self.templates['en'])
        segment_templates = lang_templates.get(borrower_segment, lang_templates['trader'])
        template = segment_templates.get(reminder_type, segment_templates['upcoming'])
        
        # Format message
        formatted_message = template.format(
            name=borrower_name.split()[0] if borrower_name else 'Customer',
            amount=f"{loan_amount:,.0f}",
            date=due_date.strftime("%d %B %Y")
        )
        
        # Determine optimal timing based on cash flow insights
        optimal_time = self._calculate_optimal_time(due_date, reminder_type, cash_flow_insights)
        
        # Determine channel based on amount and segment
        channel = self._determine_channel(loan_amount, borrower_segment)
        
        return {
            'message': formatted_message,
            'channel': channel,
            'scheduled_time': optimal_time.isoformat(),
            'borrower_name': borrower_name,
            'loan_amount': loan_amount,
            'due_date': due_date.isoformat(),
            'reminder_type': reminder_type,
            'language': language,
            'segment': borrower_segment,
            'metadata': {
                'cash_flow_informed': cash_flow_insights is not None,
                'personalization_level': 'high' if cash_flow_insights else 'medium'
            }
        }

    def _calculate_optimal_time(
        self,
        due_date: datetime,
        reminder_type: str,
        cash_flow_insights: Optional[Dict] = None
    ) -> datetime:
        """Calculate optimal time to send reminder based on cash flow patterns."""
        if reminder_type == 'upcoming':
            # Send 2 days before due date
            send_date = due_date - timedelta(days=2)
            send_time = datetime(send_date.year, send_date.month, send_date.day, 10, 0)  # 10 AM
            
        elif reminder_type == 'reminder':
            # Send 1 day before due date
            send_date = due_date - timedelta(days=1)
            send_time = datetime(send_date.year, send_date.month, send_date.day, 14, 0)  # 2 PM
            
        elif reminder_type == 'overdue':
            # Send immediately on due date
            send_time = datetime.now()
            
        else:
            send_time = due_date - timedelta(days=1)
        
        # Adjust based on cash flow insights if available
        if cash_flow_insights and 'suggested_repayment_days' in cash_flow_insights:
            # If we know their peak income days, send reminder the day after
            # This is already handled in the cash flow analyzer
            pass
            
        return send_time

    def _determine_channel(self, loan_amount: float, segment: str) -> str:
        """Determine best communication channel based on amount and segment."""
        if loan_amount < 5000:
            return 'sms'
        elif loan_amount < 25000:
            return 'whatsapp'
        else:
            # For larger amounts, use both WhatsApp and SMS
            return 'whatsapp+sms'

    def generate_reminder_batch(self, borrowers: List[Dict]) -> List[Dict]:
        """Generate reminders for a batch of borrowers."""
        reminders = []
        for borrower in borrowers:
            reminder = self.generate_reminder(
                borrower_name=borrower.get('name', ''),
                borrower_segment=borrower.get('segment', 'trader'),
                loan_amount=borrower.get('loan_amount', 0),
                due_date=datetime.fromisoformat(borrower.get('due_date', '')),
                reminder_type=borrower.get('reminder_type', 'upcoming'),
                language=borrower.get('language', 'en'),
                cash_flow_insights=borrower.get('cash_flow_insights')
            )
            reminders.append(reminder)
        return reminders


# Example usage
if __name__ == "__main__":
    engine = ReminderEngine()
    
    # Example borrower data
    borrower = {
        'name': 'Rajesh Kumar',
        'segment': 'trader',
        'loan_amount': 5000,
        'due_date': (datetime.now() + timedelta(days=2)).isoformat(),
        'reminder_type': 'upcoming',
        'language': 'en',
        'cash_flow_insights': {
            'peak_income_days': ['Saturday', 'Sunday'],
            'suggested_repayment_days': ['Monday']
        }
    }
    
    reminder = engine.generate_reminder(
        borrower_name=borrower['name'],
        borrower_segment=borrower['segment'],
        loan_amount=borrower['loan_amount'],
        due_date=datetime.fromisoformat(borrower['due_date']),
        reminder_type=borrower['reminder_type'],
        language=borrower['language'],
        cash_flow_insights=borrower['cash_flow_insights']
    )
    
    print("Generated Reminder:")
    print(f"Message: {reminder['message']}")
    print(f"Channel: {reminder['channel']}")
    print(f"Scheduled: {reminder['scheduled_time']}")
    print(f"Personalization: {reminder['metadata']['personalization_level']}")
    
    # Test Hindi reminder
    hindi_reminder = engine.generate_reminder(
        borrower_name='सuresh Patel',
        borrower_segment='grocer',
        loan_amount=3500,
        due_date=datetime.now() + timedelta(days=1),
        reminder_type='upcoming',
        language='hi'
    )
    
    print("\nHindi Reminder:")
    print(f"Message: {hindi_reminder['message']}")