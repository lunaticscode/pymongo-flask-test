from db_init import db
import uuid
from faker import Faker
from faker.providers import internet
fake = Faker()
fake.add_provider(internet)
def exec():
    for i in range(50):
        uid = str(uuid.uuid4())
        print(uid)
        name = fake.name()
        email = fake.email()
        account_data = {
            "_id": uid,
            "uid": uid,
            "name": name,
            "email": email,
        }
        db['account'].insert_one(account_data)
exec()