from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *

attractions_system = Blueprint("attractions_system", __name__)
cnxpool = mysql.connector.pooling.MySQLConnectionPool(user="root", password="root123", host="localhost", database="TripSite",pool_name="mypool",pool_size=5)

@attractions_system.route("/api/attraction/<attractionId>")
def attraction_(attractionId):
	try:
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True)
		cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id WHERE attractions.id = %s GROUP BY attractions.id ",(attractionId,),)
		data = cursor.fetchone()
		image = data["images"].split(",")
		result = {
        "id":data['id'],
        "name":data['name'],
        "category":data['category'],
        "description":data['description'],
        "address":data['address'],
        "transport":data['transport'],
        "mrt":data['mrt'],
        "lat":data['lat'],
        "lng":data['lng'],
        "images":image
    }
		if data:
			response = make_response(jsonify({"data":result}), 200)
			response.headers["Content-type"] = "application/json"
			return response
	except:
			if not data:
				return {
				"error": True,
				"message": "景點編號不正確"
				}, 400
			else:
				return {
					"error": True,
					"message": "伺服器內部錯誤"
				}, 500
	finally:
		cursor.close()
		con.close()
		
@attractions_system.route("/api/attractions", methods=["GET"])
def attractions():
	page=int(request.args.get("page", 0))
	keyword = request.args.get('keyword', 0)
	if not keyword:
		try:
			con=cnxpool.get_connection()
			cursor = con.cursor(dictionary=True)
			cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id GROUP BY attractions.id LIMIT %s,%s",(page*12, 12),)
			data = cursor.fetchall()
			results=[]
			for i in range(0,len(data)):
				image = data[i]["images"].split(",")
				result = {
				"id":data[i]['id'],
				"name":data[i]['name'],
				"category":data[i]['category'],
				"description":data[i]['description'],
				"address":data[i]['address'],
				"transport":data[i]['transport'],
				"mrt":data[i]['mrt'],
				"lat":data[i]['lat'],
				"lng":data[i]['lng'],
				"images":image
				}
				results.append(result)
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
		finally:
			cursor.close()
			con.close()
#有keyword
	if keyword:
		try:
			con=cnxpool.get_connection()
			cursor = con.cursor(dictionary=True)
			cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id WHERE attractions.mrt = %s or attractions.name LIKE '%"+ keyword + "%' GROUP BY attractions.id LIMIT %s,%s",(keyword, page*12, 12),)
			data = cursor.fetchall()
			results=[]
			for i in range(0,len(data)):
				image = data[i]["images"].split(",")
				result = {
				"id":data[i]['id'],
				"name":data[i]['name'],
				"category":data[i]['category'],
				"description":data[i]['description'],
				"address":data[i]['address'],
				"transport":data[i]['transport'],
				"mrt":data[i]['mrt'],
				"lat":data[i]['lat'],
				"lng":data[i]['lng'],
				"images":image
				}
				results.append(result)
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
		finally:
			cursor.close()
			con.close()