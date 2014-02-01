from flask import Flask, render_template, request, jsonify
from sftp.dirData import DirData

app = Flask(__name__)
app.debug = True # disable in production!

dirData = DirData()

@app.route('/')
def index():
    return render_template('index.html')


def validFields(form, fields):
    for f in fields:
        if f not in form: return False
    return True

@app.route('/login', methods=['POST'])
def login():
    def connect(form):
        if validFields(form, ['username', 'password']):
            return dirData.connect(form['username'], form['password'])
        return False

    if connect(request.form):
        return jsonify({
            "success": True
        })
    
    return jsonify({
        "success": False,
        "error": "Login failed"
    })

@app.route('/logout', methods=['POST'])
def logout():
    if dirData.closeConnect():
        return jsonify({
            "success": True
        })
    
    return jsonify({
        "success": False,
        "error": "Logout failed"
    })


@app.route('/directory', methods=['POST'])
def changeDirectory():
    if validFields(request.form, ['directory']) and dirData.cd(request.form['directory']):
        return getDirectoryJSON()

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })

@app.route('/directory', methods=['GET'])
def getDirectoryJSON():
    return jsonify(dirData.getJSON())




if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)

