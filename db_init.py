import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv() # .env 파일을 읽어온다.
db_connect = MongoClient(os.environ.get("MONGODB_URI")) # os.environ.get("MONGODB_URI") => .env 파일 내부에서 MONGODB_URI 의 값을 가져온다.
db = db_connect.local
