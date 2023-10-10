from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *
from model import *

attractions_system = Blueprint("attractions_system", __name__)

cnxpool=connect_to_pool()

@attractions_system.route("/api/attraction/<attractionId>")
def attraction_(attractionId):
	try:
		result = from_id_get_attractions(attractionId)
		if result:
			response = make_response(jsonify({"data":result}), 200)
			response.headers["Content-type"] = "application/json"
			return response
		else:
			return {
					"error": True,
					"message": "景點編號不正確"
				}, 400
	except:
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			}, 500
		
@attractions_system.route("/api/attractions", methods=["GET"])
def attractions():
	page=int(request.args.get("page", 0))
	keyword = request.args.get('keyword', 0)
	if not keyword:
		try:
			data,results=get_attractions(page)
			if (len(data)-12)<0:    #不能使用<=判別 一定要小於0才能正確判讀
				nextpage = None
			else:
				nextpage = page+1
			if data:
				response = make_response(jsonify({"nextPage":nextpage,"data":results}), 200)
				response.headers["Content-type"] = "application/json"
				return response
			else:
				response = make_response(jsonify({"nextPage":0,"data":"null"}), 200)
				response.headers["Content-type"] = "application/json"
				return response
		except ValueError:
			response = make_response(jsonify({"nextPage":0,"data":"null"}), 400)
			response.headers["Content-type"] = "application/json"
			return response
		except:
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			}, 500
#有keyword
	if keyword:
		try:
			data,results = from_keyword_get_attractions(keyword, page)
			if (len(data)-12)<0:
				nextpage = None
			else:
				nextpage = page+1
			if data:
				response = make_response(jsonify({"nextPage":nextpage,"data":results}), 200)
				response.headers["Content-type"] = "application/json"
				return response
			else:
				response = make_response(jsonify({"nextPage":nextpage,"data":"null"}), 200)
				response.headers["Content-type"] = "application/json"
				return response
		except:
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			}, 500
