import re

with open("src/data/products.ts", "r", encoding="utf-8") as f:
    text = f.read()

for i in range(1, 17):
    pid = f"prod-{i}"
    # Find block for this pid
    pattern = rf'(id:\s*"{pid}"[\s\S]*?transparentImage:\s*)"[^"]+"'
    text = re.sub(pattern, rf'\1"/furniture-cutouts/{pid}.png"', text)

with open("src/data/products.ts", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated all products with /furniture-cutouts/prod-X.png!")
