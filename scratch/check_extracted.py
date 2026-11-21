from PIL import Image

for name in ['sofa-anna.png', 'dining-table-walnut.png', 'lounge-chair-avery.png', 'dining-chair-lena.png']:
    img = Image.open(f'public/bestsellers/{name}')
    print(f"{name}: size={img.size}, bbox={img.getbbox()}")
