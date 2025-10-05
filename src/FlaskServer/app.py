from flask import Flask, request, jsonify
import os,json,requests, math
from datetime import datetime
from flask_cors import CORS

#Temperature variables
VERY_HOT = 35.0
VERY_COLD = 10.0
VERY_WET = 20.0
VERY_WINDY = 10.0  # m/s

                   
app = Flask(__name__)
CORS(app) 

@app.route('/', methods=['GET', 'POST'])
#Main page from server. not in use
def inicio():
    return("no deberias estar aqui")



@app.route('/weather',methods=['GET', 'POST'])
def weather():
    """
    Recieves parammeters
    """
    data = request.get_json()
    lat = data.get('latitude')
    lng = data.get('longitude')
    date_str = data.get('date')

    # Validate correct values
    try:
        lat = float(lat)
        if not -90 <= lat <= 90:
            return jsonify({"error": "Invalid latitude"}), 400
        lng = float(lng)
        if not -180 <= lng <= 180:
            return jsonify({"error": "Invalid longitude"}), 400
        # Validate date format MM/dd/yyyy
        datetime.strptime(date_str, "%m/%d/%Y")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data types or format"}), 400

    # Get the data
    result = callAPI(lat, lng, date_str)

    # Print the data
    print(result)

    # Return the actual data
    return jsonify(result)

def callAPI(latitude, longitude, date):
    """Calls NASA Power API
    """
    date = datetime.strptime(date,"%m/%d/%Y")
    new_date = date.strftime("%Y/%m/%d")
    
    date = new_date.replace("/", "")
    base_url = r"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,PRECTOTCORR,WS2M,CLOUD_AMT,QV2M,ALLSKY_KT,FROST_DAYS&community=RE&longitude={longitude}&latitude={latitude}&start=20000101&end={date}&format=JSON"
    output = r""
    api_request_url = base_url.format(longitude=longitude, latitude=latitude, date = date)
    response = requests.get(url=api_request_url, verify=True, timeout=30.00)
    content = json.loads(response.content.decode('utf-8'))
    return cleanJASON(content, date)

def cleanJASON(data, date):
    """Cleans previously given JASON into usable data
    """
    last4 = date[-4:]
    filename  = "datos.json"
    for param, fechas in data["properties"]["parameter"].items():
        # We create a new dictionary eith only the dates we want i.e dates that sahere month and date
        nuew_dates = {fecha: valor for fecha, valor in fechas.items() if fecha.endswith(last4)}
        data["properties"]["parameter"][param] = nuew_dates
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(',', ':'))
    return calculateWeather()

def calculateWeather():
    """""
    Calculates the average of diferent weather conditions in an attempt to predict future weather
    """
    with open('datos.json', 'r', encoding='utf-8') as f:
        data_loaded = json.load(f)
    params = data_loaded['properties']['parameter']
    
    temps = []
    winds = []
    hums = []

    #Checks every year
    yearly_data = []
    for date in params['T2M']:
        year = int(date[:4])
        temp = params['T2M'][date]
        wind = params['WS2M'][date]
        dew = params['T2MDEW'][date]
        rh = calculate_rh(temp, dew)
        temps.append(temp)
        winds.append(wind)
        hums.append(rh)
        yearly_data.append({
            'year': year,
            'temperature': temp,
            'humidity': rh
            })
    # Average 
    avg_temp = sum(temps) / len(temps) if temps else 0
    avg_wind = sum(winds) / len(winds) if winds else 0
    avg_hum = sum(hums) / len(hums) if hums else 0

    # If it's in range we determinate the weather condition
    very_hot = avg_temp > VERY_HOT
    very_cold = avg_temp < VERY_COLD
    very_windy = avg_wind > VERY_WINDY
    very_wet = avg_hum > VERY_WET
    
    results = {
        'source': 'NASA POWER datos.json',
        'num_años': len(temps),
        'averages': {
            'temperature_avg': round(avg_temp, 2),
            'wind_avg': round(avg_wind, 2),
            'humidity_avg': round(avg_hum, 2)
            },
            'conditions': {
                'very_hot': very_hot,
                'very_cold': very_cold,
                'very_windy': very_windy,
                'very_wet': very_wet,
            'thresholds': {
                'VERY_HOT': VERY_HOT,
                'VERY_COLD': VERY_COLD,
                'VERY_WINDY': VERY_WINDY,
                'VERY_WET': VERY_WET
                }
            },
        }
    return results


def calculate_rh(temp_c, dewpoint_c):
    """
    Calcula la humedad relativa (%) a partir de temperatura y punto de rocío en grados Celsius.
    Fórmula aproximada para RH.
    """
    if temp_c == dewpoint_c:
        return 100.0
    a = 17.625
    b = 243.04
    rh = 100 * (math.exp((a * dewpoint_c) / (b + dewpoint_c)) / math.exp((a * temp_c) / (b + temp_c)))
    return rh

with open('datos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)




if __name__ == '__main__':
    app.run(debug=True) 
