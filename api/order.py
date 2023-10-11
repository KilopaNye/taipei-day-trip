from flask import *
from datetime import *
from modules import *
from model import *
import requests
import os
from dotenv import *
load_dotenv()

partner_key = os.getenv('partner_key')

order_system = Blueprint("order_system", __name__)
cnxpool=connect_to_pool()


@order_system.route("/api/orders", methods=["POST"])
def order_booking():
    try:
        data = request.get_json()
        decoded_token=decode_jwt()

        if decoded_token["id"] != None:
            decoded_token_id = decoded_token["id"]
            order_id = order_insert(data,decoded_token_id)
            print(order_id)
            order_trip_insert(data,decoded_token_id,order_id)

            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            orderInfo = {
                "prime": data["prime"],
                "partner_key": "partner_qDoypNWTSpZAMgNG4jVQcyF94pZuBvpvJbSmXqetlzy2Eqpmu5hAl38H",
                "merchant_id": "KilopaNye_CTBC",
                "details": "TapPay Test",
                "amount": data["order"]["totalPrice"],
                "cardholder": {
                    "phone_number": data["order"]["contact"]["orderPhone"],
                    "name": data["order"]["contact"]["orderName"],
                    "email": data["order"]["contact"]["orderEmail"],
                    "address": data["order"]["trip"]["attraction"][0]["address"],
                },
                "remember": True,
            }
            Headers = {
                "Content-Type": "application/json",
                "x-api-key": "partner_qDoypNWTSpZAMgNG4jVQcyF94pZuBvpvJbSmXqetlzy2Eqpmu5hAl38H",
            }
            tappay_response = requests.post(url, headers=Headers, json=orderInfo).json()
            print(tappay_response)
            if tappay_response["status"] == 0:
                option = ["已付款", order_id]
                tappay_ok(option,data)
                return {
                    "data": {
                        "number": order_id,
                        "payment": {
                            "status": tappay_response["status"],
                            "message": "付款成功",
                        },
                    }
                }, 200
            else:
                # 失敗後刪除訂購資料
                tappay_false_delete_order(order_id)
                return {
                    "data": {
                        "number": order_id,
                        "payment": {
                            "status": tappay_response["status"],
                            "message": "付款失敗",
                        },
                    }
                }, 400
        else:
            return {"error": True, "message": "未登入系統，拒絕存取"}, 403
    except Exception as err:
        print(err)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


@order_system.route("/api/orders/<orderNumber>", methods=["GET"])
def thankyou(orderNumber):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        decoded_token=decode_jwt()
        print(decoded_token["id"])
        if decoded_token["id"] != None:
            cursor.execute("select * from trip where number = %s", (orderNumber,))
            source = cursor.fetchall()
            cursor.execute("select * from orders where number = %s", (orderNumber,))
            orderInfo = cursor.fetchone()
            if source:
                print(orderInfo)
                response = make_response(
                    jsonify(
                        {
                            "data": {
                                "number": orderInfo["number"],
                                "totalPrice": orderInfo["total_price"],
                                "trip": {
                                    "attraction":source,
                                },
                                "contact":orderInfo,
                                "status": 1
                            }
                        }
                    ),
                    200,
                )
                response.headers["Content-type"] = "application/json"
                return response
            else:
                response = make_response(jsonify({"data":"null"}),200,)
                response.headers["Content-type"] = "application/json"
                return response
        else:
            return {"error": True, "message": "未登入系統，拒絕存取"}, 403
    except Exception as err:
        print(err)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cursor.close()
        con.close()
