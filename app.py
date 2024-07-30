from flask import Flask, request, jsonify
from g4f.client import Client

app = Flask(__name__)

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    message = data.get('message', '')

    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}],
    )
    return jsonify(response.choices[0].message.content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)