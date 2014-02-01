from flask import Flask, render_template, request, jsonify
import sftp.dirData


app = Flask(__name__)
app.debug = True # disable in production!

dirData = sftp.dirData.DirData()

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
        return jsonify(getDirectoryJSON())

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })

@app.route('/directory', methods=['GET'])
def getDirectoryJSON():
    return jsonify(dirData.getJSON())

@app.route('/directory/<dirname>', methods=['POST'])
def makeDirectory(dirname=None):
    if dirname and dirData.mkdir(dirname):
        return getDirectoryJSON()

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })

@app.route('/directory/<dirname>', methods=['DELETE'])
def deleteDirectory(dirname=None):
    if dirname and dirData.rm(dirname, True):
        return getDirectoryJSON()

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })


@app.route('/file/<filename>', methods=['GET'])
def catFile(filename=None):
    if filename:
        return jsonify(dirData.cat(filename))

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })

@app.route('/file/<filename>', methods=['DELETE'])
def deleteFile(filename=None):
    if filename and dirData.rm(filename, False):
        return getDirectoryJSON()

    return jsonify({
        "success": False,
        "error": "Invalid request"
    })



if __name__ == "__main__":
    app.run(host='0.0.0.0')

