#!/usr/bin/env python3
"""
Log a sent outreach message to the CSV log.
Usage: python log_sent_message.py "Business Name" "Category" "Phone Number" "Message Sent"
Appends a row with current date and time, and empty Response.
"""
import csv
import os
import sys
from datetime import datetime

LOG_PATH = '/Users/taurus_ai/Documents/Nexus-Platform/01-STRATEGY/outreach-log_2026-05-11.csv'

def main():
    if len(sys.argv) != 5:
        print("Usage: python log_sent_message.py \"Business Name\" \"Category\" \"Phone Number\" \"Message Sent\"")
        sys.exit(1)
    business_name = sys.argv[1]
    category = sys.argv[2]
    phone = sys.argv[3]
    message = sys.argv[4]
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%H:%M:%S')
    # Ensure file exists with header
    file_exists = os.path.isfile(LOG_PATH)
    with open(LOG_PATH, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Date', 'Time', 'Business Name', 'Category', 'Phone', 'Message Sent', 'Response', 'Notes'])
        # Escape fields automatically via csv writer
        writer.writerow([date_str, time_str, business_name, category, phone, message, '', ''])
    print(f"Logged message for {business_name} at {date_str} {time_str}")

if __name__ == '__main__':
    main()
