from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *
import datetime
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
            con = cnxpool.get_connection()
            cursor = con.cursor(dictionary=True)
            # 建立訂單編號
            now = datetime.datetime.now()
            daytime = datetime.datetime.strptime(str(now), "%Y-%m-%d %H:%M:%S.%f")
            order_id = daytime.strftime("%Y%m%d%H%M%S")
            if (
                data["order"]["contact"]["orderEmail"]
                and data["order"]["contact"]["orderName"]
                and data["order"]["contact"]["orderPhone"]
            ):
                member_id = decoded_token["id"]
                name = data["order"]["contact"]["orderName"]
                email = data["order"]["contact"]["orderEmail"]
                phone = data["order"]["contact"]["orderPhone"]
                total_price = int(data["order"]["totalPrice"])

                order_id = int(order_id)

                cursor.execute(
                    "INSERT INTO orders(member_id, number, name, email, phone, total_price) VALUES(%s,%s,%s,%s,%s,%s)",
                    (member_id, order_id, name, email, phone, total_price),
                )
                con.commit()
                # print(data)
            for i in range(len(data["order"]["trip"]["attraction"])):
                result = [
                    decoded_token["id"],
                    order_id,
                    data["order"]["trip"]["attraction"][i]["id"],
                    data["order"]["trip"]["attraction"][i]["date"],
                    data["order"]["trip"]["attraction"][i]["time"],
                    data["order"]["trip"]["attraction"][i]["price"],
                    data["order"]["trip"]["attraction"][i]["address"],
                    data["order"]["trip"]["attraction"][i]["image"],
                ]
                cursor.execute(
                    "INSERT INTO trip(member_id, number, attractionId, date, time, price, address, image_url) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)",
                    result,
                )
                con.commit()

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
                cursor.execute(
                    "update trip set status=%s where number=%s",
                    option,
                )
                con.commit()
                # 成功後刪除購物車資料
                cursor.execute(
                    "delete from booking where id = %s",
                    (data["order"]["trip"]["attraction"][i]["id"],),
                )
                con.commit()
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
                cursor.execute("delete from trip where number = %s", (order_id,))
                con.commit()
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
    finally:
        cursor.close()
        con.close()


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
