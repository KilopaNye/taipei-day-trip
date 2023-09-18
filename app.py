from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *


app = Flask(__name__, static_folder="public")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"
cnxpool = mysql.connector.pooling.MySQLConnectionPool(user="root", password="root123", host="localhost", database="TripSite",pool_name="mypool",pool_size=5)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.json.ensure_ascii = False
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

@app.route("/api/user", methods=["POST"])
def register():
	try:
		data=request.get_json()
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True)
		cursor.execute("SELECT email from members WHERE email = %s",(data['email'],))
		source = cursor.fetchone()
		if source:
			return {
			"error": True,
			"message": "註冊失敗，重複註冊的Email或其他原因"
			}, 400
		else:
			cursor.execute("INSERT INTO members(username, email, password) values(%s, %s, %s)",
				(data['name'],data['email'],data['password']))
			con.commit()
			return {
				"ok": True
			}, 200
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		con.close()



@app.route("/api/user/auth", methods=["GET"])
def userLoing():
	try:
		data = request.headers["Authorization"]
		scheme, token = data.split()
		decoded_token = jwt.decode(token, key='7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0', algorithms="HS256")
		print(decoded_token)
		if decoded_token:
			return {
				"data":{
					'id':decoded_token["id"],
					'name':decoded_token['username'],
					'email':decoded_token['email']
				}
			}
	except:
		return {
				"data":None
			}


@app.route("/api/user/auth", methods=["PUT"])
def login():
	try:
		data=request.get_json()
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True)
		cursor.execute("SELECT id,email,username,password from members WHERE email = %s and password= %s",(data['email'], data['password']))
		source = cursor.fetchone()
		if source:
			return {
				"token": jwt_make(source['id'],source['username'],source['email'])
			}
		else:
			return {
				"error": True,
				"message": "登入失敗，帳號或密碼錯誤或其他原因"
			}
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		con.close()

@app.route("/api/attraction/<attractionId>")
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

@app.route("/api/mrts")
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

@app.route("/api/attractions", methods=["GET"])
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

app.run(host="0.0.0.0", port=3000, debug=True)