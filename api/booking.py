from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *
from flask import Blueprint

booking_system = Blueprint("booking_system", __name__)
cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    user="root",
    password="root123",
    host="localhost",
    database="TripSite",
    pool_name="mypool",
    pool_size=5,
)


@booking_system.route("/api/booking", methods=["GET"])
def check_booking():
    try:
        data = request.headers["Authorization"]
        scheme, token = data.split()
        decoded_token = jwt.decode(
            token,
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
        if decoded_token["id"]:
            result=[]
            data={}
            con=cnxpool.get_connection()
            cursor = con.cursor(dictionary=True)
            cursor.execute("SELECT * from booking WHERE member_id = %s",(decoded_token['id'],))
            source = cursor.fetchall()
            x=0
            for i in source:
                cursor.execute("SELECT attractions.id,attractions.name,attractions.address,images.path from attractions inner join images on attractions.id = images.image_id WHERE attractions.id = %s",(i['attractionId'],))
                sources = cursor.fetchall()
                sourseOne = ({"attraction":sources[0],"date":i["date"],"time":i["time"],"price":i["price"],"id":i["id"]})
                data[x]=sourseOne
                x+=1
            return jsonify({"data":data}),200
        else:
            return {"error": True, "message": "	未登入系統，拒絕存取"},403
    except:
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        },500
    finally:
        cursor.close()
        con.close()

@booking_system.route("/api/booking", methods=["POST"])
def insert_booking():
    try:
        data_token = request.headers["Authorization"]
        data = request.get_json()
        scheme, token = data_token.split()
        decoded_token = jwt.decode(
            token,
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
        con=cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        if decoded_token["id"]!=None:
            if data["date"] and data["time"] and data["price"]:
                cursor.execute("INSERT INTO booking(member_id,attractionId,date,time,price) VALUES(%s,%s,%s,%s,%s)",(decoded_token["id"],data['attractionId'],data["date"],data["time"],data["price"]))
                con.commit()
                return {
                    "ok":True
                    },200
            else:
                return {"error": True, "message": "建立失敗，輸入不正確或其他原因"},400
        else:
            return {"error": True, "message": "	未登入系統，拒絕存取"},403
    except:
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        },500
    finally:
        cursor.close()
        con.close()

@booking_system.route("/api/booking", methods=["DELETE"])
def delete_booking():
    try:
        data_token = request.headers["Authorization"]
        data = request.get_json()
        scheme, token = data_token.split()
        decoded_token = jwt.decode(
            token,
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
        print(data)
        con=cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        if decoded_token["id"]!=None:
            cursor.execute("DELETE FROM booking WHERE member_id=%s AND id=%s",(decoded_token["id"],data["id"]))
            con.commit()
            return {
                "ok":True
                },200
        else:
            return {"error": True, "message": "未登入系統，拒絕存取"},403
    except:
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        },500
    finally:
        cursor.close()
        con.close()