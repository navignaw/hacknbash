from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
app.debug = True # disable in production!

#dirData = DirData()

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
            return True # dirData.connect(form['username'], form['password'])
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

    return jsonify({"success": True}) #dirData.closeConnection()


@app.route('/directory', methods=['POST'])
def changeDirectory():

    if validFields(request.form, ['directory']):
        return jsonify({"success": True}) #(dirData.cd(request.form['directory']));

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })

@app.route('/directory', methods=['GET'])
def getDirectoryJSON():
    return jsonify({"success": True}) #(dirData.getJSON())




if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)

