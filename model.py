from modules import *
import datetime

cnxpool=connect_to_pool()

def from_id_get_attractions(attractionId):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id WHERE attractions.id = %s GROUP BY attractions.id ",(attractionId,),)
    data = cursor.fetchone()
    cursor.close()
    con.close()
    if data:
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
        return result
    else:
        return False

def get_attractions(page):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id GROUP BY attractions.id LIMIT %s,%s",(page*12, 12),)
    data = cursor.fetchall()
    cursor.close()
    con.close()
    if data:
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
        return data,results
    else:
        return False

def from_keyword_get_attractions(keyword, page):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT attractions.id, attractions.name, attractions.category, attractions.description, attractions.address, attractions.transport, attractions.mrt, attractions.lat, attractions.lng, group_concat(DISTINCT images.path separator ',') AS images FROM attractions INNER JOIN images on attractions.id = images.image_id WHERE attractions.mrt = %s or attractions.name LIKE '%"+ keyword + "%' GROUP BY attractions.id LIMIT %s,%s",(keyword, page*12, 12),)
    data = cursor.fetchall()
    cursor.close()
    con.close()
    if data:
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
        return data,results
    else:
        return False



def order_insert(data,decoded_token_id):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    # 建立訂單編號
    now = datetime.datetime.now()
    daytime = datetime.datetime.strptime(str(now), "%Y-%m-%d %H:%M:%S.%f")
    order_id = daytime.strftime("%Y%m%d%H%M%S")

    member_id = decoded_token_id
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
    cursor.close()
    con.close()
    return order_id

def order_trip_insert(data,decoded_token_id,order_id):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    for i in range(len(data["order"]["trip"]["attraction"])):
        result = [
            decoded_token_id,
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

    cursor.close()
    con.close()
    return True

def tappay_ok(option,data):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute(
    "update trip set status=%s where number=%s",
    option,
    )
    con.commit()
    # 成功後刪除購物車資料
    cursor.execute(
        "delete from booking where id = %s",
        (data["order"]["trip"]["attraction"][0]["id"],),
    )
    con.commit()
    cursor.close()
    con.close()
    return True

def tappay_false_delete_order(order_id):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("delete from trip where number = %s", (order_id,))
    con.commit()
    cursor.close()
    con.close()
    return True

def get_mrts():
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True) 
    cursor.execute("SELECT mrt FROM attractions GROUP BY mrt ORDER BY COUNT(mrt) DESC LIMIT 40")
    data = cursor.fetchall()
    cursor.close()
    con.close()
    return data


def found_user(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT email from members WHERE email = %s",(data['email'],))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source

def register(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("INSERT INTO members(username, email, password) values(%s, %s, %s)",(data['name'],data['email'],data['password']))
    cursor.close()
    con.close()
    con.commit()
    return True

def get_user_info(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT id,email,username,password from members WHERE email = %s and password= %s",(data['email'], data['password']))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source


def get_booking(decoded_token_id):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT * from booking WHERE member_id = %s",(decoded_token_id,))
    source = cursor.fetchall()
    cursor.close()
    con.close()
    return source

def get_booking_attractions(source):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    x=0
    data={}
    for i in source:
        cursor.execute("SELECT attractions.id,attractions.name,attractions.address,images.path from attractions inner join images on attractions.id = images.image_id WHERE attractions.id = %s",(i['attractionId'],))
        sources = cursor.fetchall()
        sourseOne = ({"attraction":sources[0],"date":i["date"],"time":i["time"],"price":i["price"],"id":i["id"]})
        data[x]=sourseOne
        x+=1
    cursor.close()
    con.close()
    return data

def insert_booking_info(decoded_token_id,data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("INSERT INTO booking(member_id,attractionId,date,time,price) VALUES(%s,%s,%s,%s,%s)",(decoded_token_id,data['attractionId'],data["date"],data["time"],data["price"]))
    con.commit()
    cursor.close()
    con.close()
    return True

def delete_booking_info(decoded_token_id,data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("DELETE FROM booking WHERE member_id=%s AND id=%s",(decoded_token_id,data["id"]))
    con.commit()
    cursor.close()
    con.close()
    return True