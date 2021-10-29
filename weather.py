import os, requests
from dotenv import load_dotenv

def get_weather(zipcode, units):
    url = "https://api.openweathermap.org/data/2.5/weather?" + units + "&zip=" + zipcode + ",US&appid=" + os.environ.get("WEATHER_API")
    response = requests.get(url)
    if "Error" not in response.text:
        rjson = response.json()
        weather = {
          "conditions": rjson["weather"][0]["main"],
          "conditions_id": rjson["weather"][0]["id"],
          "icon": rjson["weather"][0]["icon"],
          "curr_temp": round(rjson["main"]["temp"]),
          "real_feel": round(rjson["main"]["feels_like"]),
          "temp_min": round(rjson["main"]["temp_min"]),
          "temp_max": round(rjson["main"]["temp_max"]),
          "humidity": rjson["main"]["humidity"],
          "location": rjson["name"]
        }

        return weather
