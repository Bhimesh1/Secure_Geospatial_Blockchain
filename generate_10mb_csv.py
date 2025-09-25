# generate_10mb_csv.py
import csv, random, os

OUT = "datasets/10MB_sample.csv"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Roughly 20 bytes/row => 500 000 rows ≈ 10 MB
NUM_ROWS = 500_000

with open(OUT, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["lat","long"])
    for _ in range(NUM_ROWS):
        # random coordinates
        w.writerow([
            f"{random.uniform(-90,90):.6f}",
            f"{random.uniform(-180,180):.6f}"
        ])

print(f"Generated {OUT} with {NUM_ROWS} rows (~{os.path.getsize(OUT)/1024/1024:.2f} MB)")
