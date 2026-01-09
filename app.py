from flask import Flask, request
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)

# Set up the Google Sheets API credentials
scope = ["https://spreadsheets.google.com/feeds","https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('path/to/your/credentials.json', scope)
client = gspread.authorize(creds)

@app.route('/submitToGoogleSheets', methods=['POST'])
def submit_to_google_sheets():
    details = request.json
    sheet = client.open('Your Google Sheet Name').sheet1
    sheet.append_row([details['name'], details['phone'], details['location'], details['points']])
    return {'status': 'success'}, 200

if __name__ == '__main__':
    app.run(port=3000)