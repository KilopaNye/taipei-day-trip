from flask import *
from datetime import *
import mysql.connector
from modules import *
from flask import Blueprint


member_system = Blueprint("member_system", __name__)
cnxpool=connect_to_pool()

@member_system.route("/api/user", methods=["POST"])
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

@member_system.route("/api/user/auth", methods=["GET"])
def userLoing():
	try:
		decoded_token=decode_jwt()
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

@member_system.route("/api/user/auth", methods=["PUT"])
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