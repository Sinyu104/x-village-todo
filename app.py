import os
import json
from flask import Flask,render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import date
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', True)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print(BASE_DIR)


@app.route('/')
def download_file():
    return render_template("./index.html")


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # date_year = db.Column(db.Integer, nullable=True)
    # date_month = db.Column(db.Integer, nullable=True)
    # date_day = db.Column(db.Integer, nullable=True)
    date = db.Column(db.Date, nullable=True)
    things = db.Column(db.Text, nullable=True)

@app.route("/record", methods=['POST'])
def add_record():
    req_data = request.form
    things = req_data['things']
    split_date = req_data['date'].split('-')
    departure_date = date(int(split_date[0]),int(split_date[1]),int(split_date[2]))
    record = Record(date=departure_date, things=things)
    db.session.add(record)
    db.session.commit()
    return 'Create Succeeded', 200

@app.route("/record", methods=['GET'])
def get_record():
    records = Record.query.all()
    records_json = json.dumps(
        [
            {
                'id':record.id,
                'date': str(record.date),
                'things':record.things
            }
            for record in records
        ],
        indent=4,
        ensure_ascii=False
    )
    return records_json , 200



@app.route("/record/<int:record_id>",methods=["DELETE"])
def delete_record(record_id):
    record=Record.query.filter_by(id=record_id).first()
    db.session.delete(record)
    db.session.commit()
    return 'Delete Succeeded', 200


@app.route("/record/<int:record_id>",methods=["PUT"])
def update_record(record_id):
    req_data = request.form
    record = (
        Record.query
       .filter_by(id=record_id).first()
    )
    things = req_data['things']
    split_date = req_data['date'].split('-')
    departure_date = date(int(split_date[0]),int(split_date[1]),int(split_date[2]))
    record.things = things
    record.date = departure_date
    db.session.add(record)
    db.session.commit()
    return 'Put Succeeded', 200