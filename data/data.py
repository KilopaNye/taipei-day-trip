import json
import mysql.connector

con = mysql.connector.connect(
    user="root", password="root123", host="localhost", database="TripSite"
)
cursor = con.cursor()

# with open("taipei-attractions.json", "r", encoding="utf-8") as file:
#     source = json.load(file)
#     data = source["result"]["results"]
# for item in data:
#     if item["MRT"] is None:
#         cursor.execute(
#             "insert into attractions(name, category, description, address, transport, mrt, lat,lng) values(%s,%s,%s,%s,%s,%s,%s,%s)",
#             (item["name"], item["CAT"], item["description"], item["address"], item["direction"], "None", item["latitude"], item["longitude"],),
#         )
#         con.commit()
#     else:    
#         cursor.execute(
#             "insert into attractions(name, category, description, address, transport, mrt, lat,lng) values(%s,%s,%s,%s,%s,%s,%s,%s)",
#             (item["name"], item["CAT"], item["description"], item["address"], item["direction"], item["MRT"], item["latitude"], item["longitude"],),
#         )
#         con.commit()


with open("taipei-attractions.json", "r", encoding="utf-8") as file:
    source = json.load(file)
    datas = source["result"]["results"]
    for i in range(0,len(datas)):
        file=datas[i]["file"]
        data=file.split("https")
        path=[]
        num=i+1
        for x in range(1,len(data)):
            if data[x][-3:]=="jpg" or data[x][-3:]=="JPG" or data[x][-3:]=="png" or data[x][-3:]=="PNG":
                path.append("https"+data[x])
            for item in path:
                cursor.execute(
                "insert into images(image_id, path) values(%s,%s)",(num,item,),)
                con.commit()
        # for x in path:
        #     print(x)