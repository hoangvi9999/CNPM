import random

print("Số nguyên ngẫu nhiên từ 1 đến 100:", random.randint(1, 100))


animals = ['mèo', 'chó', 'hổ', 'sư tử', 'rồng']
chosen_animal = random.choice(animals)
print("Động vật ngẫu nhiên được chọn là:", chosen_animal)


numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
random.shuffle(numbers)
print("Danh sách sau khi xáo trộn:", numbers)


random_float = random.uniform(0, 10)
print("Số thực ngẫu nhiên từ 0 đến 10:", round(random_float, 2))

