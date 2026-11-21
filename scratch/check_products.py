import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'name:\s*["\']([^"\']+)["\'].*?imageCutout:\s*["\']([^"\']+)["\']', text, re.DOTALL)
for m in matches:
    print(f'{m[0]} -> {m[1]}')
