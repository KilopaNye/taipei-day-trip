from flask import *
from datetime import *
import mysql.connector
import jwt
from modules import *

thankyou_system = Blueprint("thankyou_system", __name__)
cnxpool=connect_to_pool()