# Kundli Backend (Flask + Swiss Ephemeris)

## Setup Instructions

1. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

2. **Download Swiss Ephemeris data files**
   - Go to: https://www.astro.com/ftp/swisseph/ephe/
   - Download the files: `sepl_18.se1`, `sepl_19.se1`, ... or the full ephemeris set.
   - Place the `.se1` files in the `kundli-backend` directory (or update `app.py` to set the correct path).

3. **Run the backend**
   ```sh
   python app.py
   ```

4. **API Usage**
   - Endpoint: `POST /api/kundli`
   - JSON body:
     ```json
     {
       "dob": "YYYY-MM-DD",
       "tob": "HH:MM",
       "pob": "Place of birth",
       "lat": <latitude>,
       "lon": <longitude>
     }
     ```
   - Returns: Planetary positions and input summary.

---

## Notes
- You must download the Swiss Ephemeris data files for accurate results.
- For production, set `debug=False` in `app.py`.
