import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'id:\s*"(?P<id>[^"]+)",\s*slug:\s*"(?P<slug>[^"]+)",\s*name:\s*"(?P<name>[^"]+)".*?categoryName:\s*"(?P<cat>[^"]+)".*?transparentImage:\s*"(?P<img>[^"]+)"',
    re.DOTALL
)

for m in pattern.finditer(text):
    print(f"{m.group('id')}: {m.group('name')} ({m.group('cat')}) -> {m.group('img')}")
