# grant_access.py

import requests

data = {
    "data_id": "b6e0e230f2b5b42987363d1e58c24ecb",  # <- your stored data ID
    "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3"  # <- your own account address
}

res = requests.post("http://127.0.0.1:8001/api/blockchain/access/grant", json=data)
print(res.status_code)
print(res.json())
