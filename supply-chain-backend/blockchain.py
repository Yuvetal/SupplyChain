import random
import time
import json
import os
import hashlib
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

SECRET_KEY = b'16byteslongkey!!'
BLOCKCHAIN_FILE = "blockchain.json"
otp_store = {}

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "blockchainDB"
COLLECTION_NAME = "blockchainFiles"

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
collection = db[COLLECTION_NAME]


# ------------------ Encryption / Decryption ------------------
def encrypt_data(data: str) -> str:
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv=SECRET_KEY[:16])
    encrypted = cipher.encrypt(pad(data.encode(), AES.block_size))
    return base64.b64encode(cipher.iv + encrypted).decode()

def decrypt_data(encrypted_data: str):
    try:
        raw = base64.b64decode(encrypted_data)
        iv = raw[:16]
        cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
        decrypted = unpad(cipher.decrypt(raw[16:]), AES.block_size)
        return decrypted.decode()
    except Exception as e:
        print("[ERROR] Decryption failed:", str(e))
        return None


# ------------------ Blockchain Storage ------------------
def save_blockchain(blockchain, filename):
    folder = os.path.dirname(os.path.abspath(filename)) or "."
    os.makedirs(folder, exist_ok=True)

    encrypted = encrypt_data(json.dumps(blockchain, indent=4))

    with open(filename, "w", encoding="utf-8") as f:
        f.write(encrypted)
    print(f"[INFO] Saved '{filename}' locally")

    try:
        with open(filename, "rb") as f:
            file_bytes = f.read()
            encoded = base64.b64encode(file_bytes).decode()

        collection.insert_one({
            "file_name": filename,
            "content_base64": encoded,
            "timestamp": datetime.now(),
            "version": datetime.now().strftime("%Y%m%d_%H%M%S")
        })
        print("[INFO] Blockchain file also stored in MongoDB.")
    except Exception as e:
        print(f"[ERROR] Could not store blockchain.json in MongoDB: {e}")

def load_blockchain(filename):
    if not os.path.exists(filename):
        return []
    try:
        with open(filename, "r", encoding="utf-8") as f:
            encrypted = f.read()
        decrypted = decrypt_data(encrypted)
        return json.loads(decrypted) if decrypted else []
    except Exception as e:
        print(f"[ERROR] Failed to load blockchain: {e}")
        return []


# ------------------ Block & Blockchain Classes ------------------
class Block:
    def __init__(self, index, timestamp, data, previous_hash, parent_hash=None):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.parent_hash = parent_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        content = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.parent_hash}"
        return hashlib.sha256(content.encode()).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "parent_hash": self.parent_hash,
            "hash": self.hash
        }

class Blockchain:
    def __init__(self):
        if not os.path.exists(BLOCKCHAIN_FILE):
            print("[INFO] No blockchain file found. Creating new genesis block...")
            self.chain = [self.create_genesis_block().to_dict()]
            save_blockchain(self.chain, BLOCKCHAIN_FILE)
        else:
            self.chain = load_blockchain(BLOCKCHAIN_FILE)
            if not self.chain:
                print("[WARN] Blockchain file empty/corrupted. Creating new genesis block...")
                self.chain = [self.create_genesis_block().to_dict()]
                save_blockchain(self.chain, BLOCKCHAIN_FILE)
            else:
                print("[INFO] Blockchain loaded successfully.")

    def create_genesis_block(self):
        return Block(0, time.strftime("%Y-%m-%d %H:%M:%S"), "Genesis Block", "0")

    def add_block(self, data, parent_hash=None):
        prev = self.chain[-1]
        new_block = Block(
            len(self.chain),
            time.strftime("%Y-%m-%d %H:%M:%S"),
            data,
            prev["hash"],
            parent_hash
        )
        self.chain.append(new_block.to_dict())
        self.save_blockchain()

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            recomputed = hashlib.sha256(
                f"{curr['index']}{curr['timestamp']}{curr['data']}{curr['previous_hash']}{curr.get('parent_hash')}".encode()
            ).hexdigest()
            if curr["hash"] != recomputed:
                print(f"[ERROR] Block {i} has been tampered!")
                return False
            if curr["previous_hash"] != prev["hash"]:
                print(f"[ERROR] Block {i} is incorrectly linked!")
                return False
        return True

    def save_blockchain(self):
        save_blockchain(self.chain, BLOCKCHAIN_FILE)


my_blockchain = Blockchain()


# ------------------ OTP Functions ------------------
def generate_otp():
    return str(random.randint(100000, 999999))


# ------------------ API Routes ------------------
@app.route("/")
def home():
    return "✅ Blockchain Backend Running"


@app.route("/send_otp", methods=["POST"])
def send_otp():
    data = request.get_json()
    phone = data.get("phone_number")

    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    otp = generate_otp()
    otp_store[phone] = otp
    print(f"[DEBUG] OTP for {phone} is {otp}")
    return jsonify({"message": f"OTP sent to {phone} (simulated)."}), 200


@app.route("/verify_otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    phone = data.get("phone_number")
    entered_otp = data.get("otp")

    if otp_store.get(phone) == entered_otp:
        del otp_store[phone]
        return jsonify({"verified": True}), 200
    return jsonify({"verified": False, "error": "Invalid OTP"}), 400


# ------------------ Add Produce Transaction ------------------
@app.route("/add", methods=["POST"])
def add_transaction():
    data = request.get_json()

    batch_id = data.get("batch_id")
    harvest_date = data.get("harvest_date")
    quantity = data.get("quantity")
    cost = data.get("cost")
    sold_to_name = data.get("sold_to_name")
    sold_to_phone = data.get("sold_to_phone")
    parent_hash = data.get("parent_hash")

    if not all([batch_id, harvest_date, quantity, cost, sold_to_name, sold_to_phone]):
        return jsonify({"error": "Missing one or more required fields"}), 400

    transaction = {
        "batch_id": batch_id,
        "harvest_date": harvest_date,
        "quantity": quantity,
        "cost": cost,
        "sold_to": {
            "name": sold_to_name,
            "phone": sold_to_phone
        }
    }

    my_blockchain.add_block(transaction, parent_hash)
    return jsonify({"message": "✅ Produce transaction added", "block": transaction}), 200


# ------------------ View Blockchain ------------------
@app.route("/view", methods=["GET"])
def view_chain():
    simplified_chain = []
    for block in my_blockchain.chain:
        if isinstance(block["data"], dict):
            simplified_chain.append({
                "timestamp": block["timestamp"],
                "batch_id": block["data"].get("batch_id"),
                "harvest_date": block["data"].get("harvest_date"),
                "quantity": block["data"].get("quantity"),
                "cost": block["data"].get("cost"),
                "sold_to": block["data"].get("sold_to"),
                "parent_hash": block.get("parent_hash")
            })
        else:
            simplified_chain.append({
                "timestamp": block["timestamp"],
                "message": block["data"]
            })
    return jsonify(simplified_chain), 200


# ------------------ Get Parent Blocks for Dropdown ------------------
@app.route("/parents/<batch_id>", methods=["GET"])
def get_parent_blocks(batch_id):
    parents = []
    for block in my_blockchain.chain:
        if isinstance(block["data"], dict) and block["data"].get("batch_id") == batch_id:
            parents.append({
                "hash": block.get("hash"),
                "timestamp": block.get("timestamp"),
                "quantity": block["data"].get("quantity"),
                "sold_to": block["data"].get("sold_to")
            })
    return jsonify(parents), 200


# ------------------ Validate Chain ------------------
@app.route("/validate", methods=["GET"])
def validate_chain():
    valid = my_blockchain.is_chain_valid()
    return jsonify({"valid": valid}), 200


# ------------------ Run Server ------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
