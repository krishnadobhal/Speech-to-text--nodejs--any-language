from flask import Flask, request, jsonify, render_template, redirect, url_for
import whisper

app = Flask(__name__)
python_port = 5000

@app.route('/upload', methods=['POST'])
def receive_file():
    file_url = request.json.get('fileUrl')

    print(f'Received file URL from Node.js: {file_url}')

    audio_file_path = file_url

    model = whisper.load_model("base")

    result = model.transcribe(audio_file_path,task='translate')

    print(result)
    return jsonify(result=result)


if __name__ == '__main__':
    app.run(port=python_port)
