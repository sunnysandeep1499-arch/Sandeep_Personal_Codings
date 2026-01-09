import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Set up the Google Sheets API credentials
scope = ["https://spreadsheets.google.com/feeds","https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('path/to/your/credentials.json', scope)
client = gspread.authorize(creds)

# Open the Google Sheet
sheet = client.open('Your Google Sheet Name').sheet1

# Data to be added
name = details['name']
phone = details['phone']
location = details['location']
praise_points = details['points']

# Append the data to the sheet
sheet.append_row([name, phone, location, praise_points])
