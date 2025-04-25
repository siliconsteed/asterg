from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from timezonefinder import TimezoneFinder
import pytz
import requests
import importlib
import db
import openai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import config
config = importlib.import_module('config')

# Set OpenAI API key
openai.api_key = config.OPENAI_API_KEY

db.init_db()

app = Flask(__name__)
CORS(app)

# Only import swisseph if needed
if config.KUNDLI_MODE == 'swisseph':
    import swisseph as swe
    swe.set_ephe_path('.')

    def get_planet_positions(jd_ut):
        planets = [swe.SUN, swe.MOON, swe.MERCURY, swe.VENUS, swe.MARS, swe.JUPITER, swe.SATURN, swe.RAHU, swe.KETU]
        planet_names = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu']
        positions = {}
        for idx, planet in enumerate(planets):
            lon, lat, dist = swe.calc_ut(jd_ut, planet)[0:3]
            positions[planet_names[idx]] = round(lon, 2)
        return positions

@app.route('/api/kundli', methods=['POST'])
def kundli():
    data = request.json
    dob = data.get('dob')  # 'YYYY-MM-DD'
    tob = data.get('tob')  # 'HH:MM'
    pob = data.get('pob')  # Place of birth (string)
    lat = data.get('lat')  # Latitude (float)
    lon = data.get('lon')  # Longitude (float)

    # Input validation
    if not all([dob, tob, pob, lat, lon]):
        return jsonify({'error': 'Missing one or more required fields: dob, tob, pob, lat, lon'}), 400


    if config.KUNDLI_MODE == 'api':
        # Forward request to FreeAstrologyAPI
        try:
            year, month, date = map(int, dob.split('-'))
            hours, minutes = map(int, tob.split(':'))
            api_payload = {
                "year": year,
                "month": month,
                "date": date,
                "hours": hours,
                "minutes": minutes,
                "seconds": 0,
                "latitude": lat,
                "longitude": lon,
                "timezone": 5.5,  # You may want to compute this dynamically
                "settings": {
                    "observation_point": "topocentric",
                    "ayanamsha": "lahiri"
                }
            }
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': config.API_KEY
            }
            resp = requests.post(config.API_URL, headers=headers, json=api_payload, timeout=10)
            return (resp.text, resp.status_code, resp.headers.items())
        except Exception as e:
            return jsonify({'error': f'API call failed: {str(e)}'}), 500

    # Local swisseph calculation
    # Parse date and time
    dt = datetime.datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")

    # Get timezone
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lng=lon, lat=lat)
    if not timezone_str:
        return jsonify({'error': 'Could not determine timezone'}), 400
    timezone = pytz.timezone(timezone_str)
    dt_local = timezone.localize(dt)
    dt_utc = dt_local.astimezone(pytz.utc)

    # Julian Day in UT
    jd_ut = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute/60.0)

    # Get planet positions
    positions = get_planet_positions(jd_ut)

    return jsonify({
        'planet_positions': positions,
        'input': {
            'dob': dob,
            'tob': tob,
            'pob': pob,
            'lat': lat,
            'lon': lon,
            'timezone': timezone_str
        },
        'mode': 'swisseph'
    })

@app.route('/api/save_chat', methods=['POST'])
def save_chat():
    data = request.json
    messages = data.get('messages', [])
    if not isinstance(messages, list):
        return jsonify({'error': 'messages must be a list'}), 400
    db.save_chat(messages)
    return jsonify({'status': 'success'})

@app.route('/api/get_chats', methods=['GET'])
def get_chats():
    limit = int(request.args.get('limit', 10))
    chats = db.get_chats(limit)
    return jsonify({'chats': chats})

@app.route('/api/openai', methods=['POST'])
def openai_api():
    import traceback
    import sys
    data = request.json
    prompt = data.get('prompt')
    logs = []
    try:
        if not prompt:
            logs.append('Missing prompt in request.')
            return jsonify({'error': 'Missing prompt', 'logs': logs}), 400

        logs.append(f'Using OpenAI API key: {"set" if config.OPENAI_API_KEY else "missing"}')
        logs.append(f'Using Assistant ID: asst_thyd2tCfqb3cAw6TxUkUUmsC')
        openai.api_key = config.OPENAI_API_KEY

        # Step 1: Create a thread
        try:
            thread = openai.beta.threads.create()
            logs.append(f'Thread created: {thread.id}')
        except Exception as e:
            logs.append(f'Error creating thread: {str(e)}')
            return jsonify({'error': f'Error creating thread: {str(e)}', 'logs': logs}), 500

        # Step 2: Add a message
        try:
            openai.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=prompt
            )
            logs.append('Message added to thread.')
        except Exception as e:
            logs.append(f'Error adding message: {str(e)}')
            return jsonify({'error': f'Error adding message: {str(e)}', 'logs': logs}), 500

        # Step 3: Run the assistant
        try:
            run = openai.beta.threads.runs.create(
                thread_id=thread.id,
                assistant_id="asst_thyd2tCfqb3cAw6TxUkUUmsC"
            )
            logs.append(f'Run started: {run.id}')
        except Exception as e:
            logs.append(f'Error starting run: {str(e)}')
            return jsonify({'error': f'Error starting run: {str(e)}', 'logs': logs}), 500

        # Step 4: Wait for the run to complete
        import time
        try:
            while True:
                run_status = openai.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
                logs.append(f'Run status: {run_status.status}')
                if run_status.status == "completed":
                    break
                if run_status.status in ["failed", "cancelled"]:
                    logs.append(f'Run failed or cancelled: {run_status.status}')
                    return jsonify({'error': f'Run status: {run_status.status}', 'logs': logs}), 500
                time.sleep(1)
        except Exception as e:
            logs.append(f'Error polling run status: {str(e)}')
            return jsonify({'error': f'Error polling run status: {str(e)}', 'logs': logs}), 500

        # Step 5: Get the assistant's reply
        try:
            messages = openai.beta.threads.messages.list(thread_id=thread.id)
            logs.append(f'Fetched {len(messages.data)} messages from thread.')
            for msg in reversed(messages.data):
                if msg.role == "assistant":
                    logs.append('Assistant message found.')
                    return jsonify({'result': msg.content[0].text.value, 'logs': logs})
            logs.append('No assistant message found.')
            return jsonify({'error': 'No assistant response found.', 'logs': logs}), 500
        except Exception as e:
            logs.append(f'Error fetching messages: {str(e)}')
            return jsonify({'error': f'Error fetching messages: {str(e)}', 'logs': logs}), 500

    except Exception as e:
        tb = traceback.format_exc()
        logs.append(f'Exception: {str(e)}')
        logs.append(tb)
        return jsonify({'error': str(e), 'logs': logs}), 500

if __name__ == '__main__':
    app.run(debug=True)
