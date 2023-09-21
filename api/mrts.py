from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *

mrts_system = Blueprint("mrts_system", __name__)
cnxpool = mysql.connector.pooling.MySQLConnectionPool(user="root", password="root123", host="localhost", database="TripSite",pool_name="mypool",pool_size=5)

@mrts_system.route("/api/mrts")
def mrt():
	try:
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True) 
		cursor.execute("SELECT mrt FROM attractions GROUP BY mrt ORDER BY COUNT(mrt) DESC LIMIT 40")
		data = cursor.fetchall()
		response=make_response(jsonify({"data":[item['mrt'] for item in data]}), 200)
		response.headers["Content-Type"] = "application/json"
		return response
	except:
		response=make_response(jsonify({"error": True,"message": "伺服器內部錯誤"}), 500)
		response.headers["Content-Type"] = "application/json"
		return response
	finally:
		cursor.close()
		con.close()