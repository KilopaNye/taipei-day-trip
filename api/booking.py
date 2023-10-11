from flask import *
from datetime import *
from modules import *
from model import *
from flask import Blueprint


booking_system = Blueprint("booking_system", __name__)

cnxpool=connect_to_pool()


@booking_system.route("/api/booking", methods=["GET"])
def check_booking():
    try:
        decoded_token=decode_jwt()
        if decoded_token["id"]: 
            decoded_token_id = decoded_token["id"]
            source = get_booking(decoded_token_id)
            data = get_booking_attractions(source)
            return jsonify({"data":data}),200
        else:
            return {"error": True, "message": "	未登入系統，拒絕存取"},403
    except Exception as err:
        print(err)
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        },500

@booking_system.route("/api/booking", methods=["POST"])
def insert_booking():
    try:
        data = request.get_json()
        decoded_token=decode_jwt()
        if decoded_token["id"]!=None:
            if data["date"] and data["time"] and data["price"]:
                decoded_token_id = decoded_token["id"]
                insert_booking_info(decoded_token_id, data)
                return {
                    "ok":True
                    },200
            else:
                return {"error": True, "message": "建立失敗，輸入不正確或其他原因"},400
        else:
            return {"error": True, "message": "	未登入系統，拒絕存取"},403
    except Exception as err:
        print(err)
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        },500
    
@booking_system.route("/api/booking", methods=["DELETE"])
def delete_booking():
    try:
        decoded_token=decode_jwt()
        data = request.get_json()
        if decoded_token["id"]!=None:
            decoded_token_id = decoded_token["id"]
            delete_booking_info(decoded_token_id,data)
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
