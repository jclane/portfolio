import os, requests
from dotenv import load_dotenv

project_folder = os.path.expanduser("~/mysite")
load_dotenv(os.path.join(project_folder, ".env"))


def get_weather(zipcode, units):
    url = "https://api.openweathermap.org/data/2.5/weather?" + units + "&zip=" + zipcode + ",US&appid=" + os.environ.get("WEATHER_API")
    response = requests.get(url)
    if "Error" not in response.text:
        rjson = response.json()
        weather = {
          "conditions": rjson["weather"][0]["main"],
          "icon": rjson["weather"][0]["icon"],
          "curr_temp": rjson["main"]["temp"],
          "real_feel": rjson["main"]["feels_like"],
          "temp_min": rjson["main"]["temp_min"],
          "temp_max": rjson["main"]["temp_max"],
          "humidity": rjson["main"]["humidity"]
        }

        return weather
