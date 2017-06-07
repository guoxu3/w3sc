# 接口描述

--------
##接口返回定义
```
200, 正常情况，通过返回的json中ok字段判断接口错误
403, 权限错误，认证失败或者没有相应操作权限
500, 内部错误，联系相应开发人员和管理人员处理

返回均以json字符串返回，其中以下字段是公共字段，所有接口共享:
1. ok      ->  True | False
2. info    ->  返回信息，正确时为数据，错误时为错误信息
```


##用户接口( /api/user )
#### 获取user信息
```
GET /api/user

argument:
    user_id = 0358c3c78f5211e685855cf9389306a2
    type = normal/share/vip

argument explain:
    user_id (string, 必须) 用户id
    type (string, 必须) 用户类型
   
TIPS:
   

return:
{
    'ok': True,
    'info': {
        'data': 
            {
                'id': 1, 
                'user_id': '0358c3c78f5211e685855cf9389306a2',
                'type': 'normal',
                'create_time': 1480471675,
                'expire_time': 1480471675,
                'port': 10001,
                'net_flow': 100
            }
}
```



##认证接口( /api/auth )
### 认证
```
POST /api/auth

argument:
{  
    'user_id': 'xxxxxxxxxxxxxxxxxxxxx'
	'type': 'normal'
}

argument explain:
    user_id (string, 必须) 用户id
    type (string, 必须) 用户类型
    
    
TIPS:
    

return:
{
    'ok': True,
    'info': 'auth sueecssful'
}
```
