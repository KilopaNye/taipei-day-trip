from datetime import *
import jwt
def jwt_make(id,member_id,email):
	payload = {
		'exp': datetime.now() + timedelta(minutes=10080),
		'username' : member_id,
		'email': email,
		'id':id
	}
	key = '7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0'
	encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
	return encoded_jwt


# def decode_jwt(member_id: int, token: str):
# 	payload= {'user_id':member_id}
# 	key = '7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0'
# 	try:
# 		dncoded_jwt = jwt.decode(token, key, algorithms="HS256")
# 		print(decode_jwt)
# 	except jwt.PyJWTError:
# 		print('token解析失敗')
# 		return False
# 	else:
# 		print(dncoded_jwt)
# 		exp = int(dncoded_jwt.pop('exp'))
# 		if time.time() > exp :
# 			print('已失效')
# 			return False
# 	return payload == dncoded_jwt

