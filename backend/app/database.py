from pymongo import MongoClient
from app.config import MONGODB_URL, DB_NAME, COLLECTION_NAME

client = MongoClient(MONGODB_URL)
db = client[DB_NAME]
tws_collection = db[COLLECTION_NAME]