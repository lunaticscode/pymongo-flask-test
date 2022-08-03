from flask import Blueprint, request, jsonify
from db_init import db
import uuid
bp = Blueprint('account_route', __name__, url_prefix='/account')

@bp.get('/')
def get_account_list():
    try:
        account_list = list(db['account'].find({}, {"_id": False}))
        return jsonify({"data": account_list, "isError": False})
    except ValueError as err:
        print(f'Error(!) {err}')
        return jsonify({"data": [], "isError": True})

@bp.post('/add')
def add_account():
    # print(request.json) # Dictionary 자료형 =>  { 'email': 'asd@naver.com', 'password': 'secretkey' }
    data = request.json

    """
           1) :: data 의 자료형이 Dictionary가 맞지 않는다면,
           2),3) :: data 내부에 'email'이라는 키가 있는지, 그리고 해당 키의 email 값이 비어있다면, 
           4),5) :: data 내부에 'password'이라는 키가 있는지, 그리고 해당 키의 password 값이 비어있다면, 
    """
    if type(data) != dict or \
            'email' not in data or \
            data['email'] == '' or \
            'password' not in data or \
            data['password'] == '':
        return jsonify({"isError": True})


    # 사용자가 입력한 email, password 값의 검사가 끝난 후,
    # uuid 라이브러리를 이용하여 만든 값을 uid 로 부여.
    uid = str(uuid.uuid4())
    email = data['email']
    password = data['password']

    try:
        db['account'].insert_one({"uid": uid, "email": email, "password": password})
        return jsonify({"isError": False})
    except ValueError as err:
        print(f'(!)DB Error {err}')
        return jsonify({"isError": True})

@bp.post('/delete')
def delete_account():
    data = request.json
    if "uid" not in data or data['uid'] == "":
        return jsonify({"isError": True})

    uid = data['uid']
    try:
        db['account'].delete_one({"uid": uid})
        return jsonify({"isError": False})
    except ValueError as err:
        print(f'(!)DB Error \n{err}')
        return jsonify({"isError": True})