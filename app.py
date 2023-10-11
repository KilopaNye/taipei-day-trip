from flask import *
from datetime import *
import mysql.connector
from modules import *
from dotenv import *
from api.member import member_system
from api.attractions import attractions_system
from api.mrts import mrts_system
from api.booking import booking_system
from api.order import order_system
from api.thankyou import thankyou_system
load_dotenv()


app = Flask(__name__, static_folder="public")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"
cnxpool = mysql.connector.pooling.MySQLConnectionPool(user="root", password="root123", host="localhost", database="TripSite",pool_name="mypool",pool_size=5)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.json.ensure_ascii = False

app.register_blueprint(member_system)
app.register_blueprint(attractions_system)
app.register_blueprint(mrts_system)
app.register_blueprint(booking_system)
app.register_blueprint(order_system)
app.register_blueprint(thankyou_system)
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(host="0.0.0.0", port=3000, debug=True)