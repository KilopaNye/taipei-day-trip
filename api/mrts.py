from flask import *
from datetime import *
from modules import *
from model import *

mrts_system = Blueprint("mrts_system", __name__)

cnxpool=connect_to_pool()

@mrts_system.route("/api/mrts")
def mrt():
	try:
		data = get_mrts()
		response=make_response(jsonify({"data":[item['mrt'] for item in data]}), 200)
		response.headers["Content-Type"] = "application/json"
		return response
	except:
		response=make_response(jsonify({"error": True,"message": "伺服器內部錯誤"}), 500)
		response.headers["Content-Type"] = "application/json"
		return response