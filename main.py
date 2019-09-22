# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import os
import flask
from flask import request,render_template
from flask import jsonify, make_response
import pickle
import uuid
app = flask.Flask(__name__)
app.config["DEBUG"] = True

with open('logistic_regression_.pkl','rb') as f:
    clf = pickle.load(f) 
    print("Model loaded successfully")


@app.route('/', methods=['POST'])
def home():
    if request.method == 'POST':
        print(type(request.data))
        filename =  str(uuid.uuid4()) + '.wav'
        with open( filename, mode='wb') as f:
            f.write(request.data)
        print("file created")
        conf, nonconf = analyze( filename)
        print("Confidence ............ " + str(conf))
#        os.remove(filename)
        return make_response(jsonify({"confidence":float(conf)}), 200)
    return "Not POST"

@app.route('/uploadfile',methods=['GET','POST'])
def uploadfile():
    if request.method == 'POST':
        f = request.file['file']
        f.save(f.filename)
        return "success"


@app.errorhandler(500)
def internal_error(error):

    return "Internal Server Error",500

@app.errorhandler(404)
def not_found(error):
    return "Not Found",404

    
@app.route('/upload',methods=['POST'])
def upload():
    f = request.files['file']
    f.save("static//"+f.filename)
    conf, nonconf = analyze(f.filename)
    conf=5
    happy=20
    sad=22
    neutral = 30
    disgust=63
    anger = 21
    progressbar = {} 
    progressbar["confidence"] = float(conf)
    progressbar["happy"] = float(happy)
    progressbar["sad"] = float(sad)
    progressbar["neutral"] = float(neutral)
    progressbar["disgust"] = float(disgust)
    progressbar["anger"] = float(anger)
    filePath = "static/"+f.filename
    return render_template('analysis.html', title='Voxers - Analysis', progressbar=progressbar, filePath = filePath)
    

def analyze(filename):
    from confidence_prediction import test_example
    file_name =  filename
    print("here"+filename)
    test_exm = test_example(file_name,clf)
    print(test_exm[0,0], test_exm[0,1])
    return test_exm[0,0], test_exm[0,1]

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(threaded=True, host='0.0.0.0', port=port)
