from modules import *
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