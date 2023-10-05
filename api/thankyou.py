from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *

thankyou_system = Blueprint("thankyou_system", __name__)
cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    user="root",
    password="root123",
    host="localhost",
    database="TripSite",
    pool_name="mypool",
    pool_size=5,
)