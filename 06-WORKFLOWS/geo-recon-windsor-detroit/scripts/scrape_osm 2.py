#!/usr/bin/env python3
"""
OSM scraper for Windsor-Detroit region.
Reads categories.csv and queries Overpass API for each amenity.
Saves raw JSON per category.
"""
import csv
import json
import os
import time
from urllib import parse, request

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Bounding box covering Windsor ON and Detroit MI (approx)
# min_lat, min_lon, max_lat, max_lon
BBOX = (42.2, -83.3, 42.5, -82.8)

def build_query(amenity):
    """Overpass QL query for nodes/ways with given amenity within bbox."""
    lat_min, lon_min, lat_max, lon_max = BBOX
    q = f"""
[out:json][timeout:25];
(
  node["amenity"="{amenity}"]({lat_min},{lon_min},{lat_max},{lon_max});
  way["amenity"="{amenity}"]({lat_min},{lon_min},{lat_max},{lon_max});
  relation["amenity"="{amenity}"]({lat_min},{lon_min},{lat_max},{lon_max});
);
out center tags;
"""
    return q

def fetch_overpass(query):
    # Use GET request, passing the data as a query parameter
    url = OVERPASS_URL + '?' + parse.urlencode({'data': query})
    req = request.Request(url, method='GET')
    # We can set a User-Agent to be polite
    req.add_header('User-Agent', 'HermesAgent/1.0 (+https://hermes.ai)')
    try:
        with request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except Exception as e:
        print(f"Error fetching Overpass: {e}")
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, '..', 'config', 'categories.csv')
    raw_dir = os.path.join(script_dir, '..', 'raw')
    os.makedirs(raw_dir, exist_ok=True)

    with open(config_path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            category = row['category']
            amenity = row['osm_amenity']
            print(f"Fetching OSM data for {category} (amenity={amenity})...")
            query = build_query(amenity)
            data = fetch_overpass(query)
            if data is None:
                print(f"  Failed to fetch {category}")
                continue
            out_path = os.path.join(raw_dir, f"osm_{category}_{int(time.time())}.json")
            with open(out_path, 'w') as f_out:
                json.dump(data, f_out, indent=2)
            print(f"  Saved {len(data.get('elements', []))} elements to {out_path}")
            # Be nice to the API
            time.sleep(2)

if __name__ == '__main__':
    main()
