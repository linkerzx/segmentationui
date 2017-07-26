from flask import Flask, render_template,jsonify
app = Flask(__name__)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/image/<int:height>/<int:width>')
def getImage(height, width):
    import os, sys
    from PIL import Image

    size = height, width
    infile = 'static/google-309741_1280.png'
    outfile = os.path.splitext(infile)[0] + ".thumb.png"
    if infile != outfile:
        try:
            im = Image.open(infile)
            im.thumbnail(size, Image.ANTIALIAS)
            im.save(outfile, "PNG")
        except IOError:
            print "cannot create thumbnail for '%s'" % infile
    from flask import send_file
    return send_file(outfile)

@app.route('/api/segmentation/list/')
def get_segments():
    segment_list = [
        {"id": 223, "name": "2al segment", "description": "some dummy description"},
        {"id": 313, "name": "3ummy second segment", "description": "some 2nd dummy"}]
    #segment_list = []
    import json
    return json.dumps(segment_list)

@app.route('/api/segmentation/edit/', methods=['PUT'])
def edit_segment():
    from flask import request
    import json
    print request.data
    return request.data

@app.route('/api/segmentation/details/<int:id>')
def get_segment_detail(id):
    return """{"segment_desc":{"id":"223","name":"My Test Segment","privacy":"Private","description":"My Test Description"},"segmentConditions":[[{"attribute":"Name","condition":"=","value":"Julien"}]]}"""

@app.route('/api/segmentation/runs/<int:id>')
def get_segment_runs(id):
    return """[{"id": 1, "date": "2017-02-01", "status": "OK"}, {"id": 3, "date":"2017-02-28", "status": "Failed"}]"""

@app.route('/api/customer_profile/attributes/')
def api_customer_profile_attributes():
    params = """[{"name": "Age", "type": "categorical", "list": ["13-18","18-25","25-40","40-80", "81-90"]}, {"name": "Gender", "type": "categorical", "list": ["Male", "Female"]}, {"name": "Income", "type": "numerical"}] """
    return params

@app.route('/api/location/points/')
def get_location_points():
    output = [
                {"name": "First Geo Loc", "description": "Soem Fake Description","lat": 51.505, "long": -0.09, "id": 2},
                {"name": "Second Geo Loc", "description": "Soem Fake 2nd Description","lat": 51.705, "long": -0.092, "id": 5}

            ]
    import json
    return json.dumps(output)

@app.route('/api/location/geofences/')
def get_location_geofences():
    output = [
                {"linked_id": 2, "lat": 51.505, "long": -0.09, "radius": 4000,"id": 4},
                {"linked_id": 5, "lat": 51.705, "long": -0.092, "radius": 350, "id": 8}

            ]
    import json
    return json.dumps(output)


if __name__ == '__main__':
  app.run(debug=True)

