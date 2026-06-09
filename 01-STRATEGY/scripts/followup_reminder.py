#!/usr/bin/env python3
"""
Follow‑up reminder script.
Checks the outreach log for entries where Response is empty and the sent time is older than 2 hours.
Generates a polite nudge message for each and appends them to a follow‑up CSV (or prints them).
Usage: python followup_reminder.py [--send]  # if --send, actually logs the nudge as a new sent message (optional)
"""
import csv
import sys
import os
from datetime import datetime, timedelta

LOG_PATH = '/Users/taurus_ai/Documents/Nexus-Platform/01-STRATEGY/outreach-log_2026-05-11.csv'
FOLLOWUP_LOG_PATH = '/Users/taurus_ai/Documents/Nexus-Platform/01-STRATEGY/followup-log_2026-05-11.csv'
TEMPLATE = """Hi {first_name},

Just wanted to follow up on my note about a quick 2‑minute mockup for {business_name} – a simple, fast site that can help you get more bookings from Google Maps.

When would be a good time to show you?

Best,
[Your Name]
[Your Phone]"""

def parse_datetime(date_str, time_str):
    try:
        return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

def main():
    send_mode = '--send' in sys.argv
    now = datetime.now()
    threshold = now - timedelta(hours=2)
    followups = []
    if not os.path.isfile(LOG_PATH):
        print("Log file not found:", LOG_PATH)
        sys.exit(1)
    with open(LOG_PATH, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('Response', '').strip():
                dt = parse_datetime(row['Date'], row['Time'])
                if dt and dt < threshold:
                    # Build nudge
                    first_name = row['Business Name'].split()[0] if row['Business Name'] else 'there'
                    biz_name = row['Business Name']
                    nudge = TEMPLATE.format(first_name=first_name, business_name=biz_name)
                    followups.append({
                        'date': row['Date'],
                        'original_time': row['Time'],
                        'business_name': biz_name,
                        'category': row['Category'],
                        'phone': row['Phone'],
                        'nudge': nudge
                    })
    if not followups:
        print("No follow‑ups needed at this time.")
        return
    print(f"Found {len(followups)} leads needing a follow‑up (no reply after 2h).")
    for fu in followups:
        print("\n---")
        print(f"Business: {fu['business_name']} ({fu['category']})")
        print(f"Phone: {fu['phone']}")
        print(f"Original contact: {fu['date']} {fu['original_time']}")
        print(f"Nudge message:\n{fu['nudge']}")
        if send_mode:
            # Append to follow-up log (or to main log as a new sent message?)
            # We'll append to a separate follow-up log for tracking.
            file_exists = os.path.isfile(FOLLOWUP_LOG_PATH)
            with open(FOLLOWUP_LOG_PATH, 'a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if not file_exists:
                    writer.writerow(['Date', 'Time', 'Business Name', 'Category', 'Phone', 'Message Sent', 'Response', 'Notes'])
                # Use current time for the follow‑up send
                now_str = now.strftime('%Y-%m-%d %H:%M:%S').split()
                writer.writerow([now_str[0], now_str[1], fu['business_name'], fu['category'], fu['phone'], fu['nudge'], '', 'Follow‑up sent via script'])
            print("(Logged as sent follow‑up)")
    if not send_mode:
        print("\nTo actually log these follow‑ups as sent messages, re‑run with the --send flag.")

if __name__ == '__main__':
    main()