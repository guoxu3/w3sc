#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
    user handler
"""

import tornado.web
import tornado.escape
from db import db_user
import check
import json
from lib import encrypt
import utils


class UserHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def __init__(self, application, request, **kwargs):
        super(UserHandler, self).__init__(application, request, **kwargs)
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, content-type")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
        self.token = self.get_secure_cookie("access_token")

    def get(self):
        ok, info = check.check_login(self.token)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        user_id = self.get_argument('user_id', None)
        id_type = self.get_argument('id_type', None)
        start = int(self.get_argument('start', 0))
        count = int(self.get_argument('count', 10))
        user_info = db_user.get(user_id, id_type, start, count)

        if user_info is not False:
            ok = True
            info = {'data': user_info, 'count': db_user.row_count(id_type)}
        else:
            ok = False
            info = u'获取用户信息失败'
        self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))

    def post(self):
        ok, info = check.check_login(self.token)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        ok, info = check.check_content_type(self.request)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        body = json.loads(self.request.body)
        action, user_data = body['action'], body['data']
        if action == 'add':
            user_type, expiry_mouth = user_data['user_type'], user_data['expiry_mouth']
            if 'remarks' in user_data:
                remarks = user_data['remarks']
            else:
                remarks = ''
            cur_timestamp = utils.cur_timestamp()
            expiry_timestamp = int(expiry_mouth) * 31 * 60 * 60 * 24 + cur_timestamp
            if user_type == "vip":
                # todo
                user_id = encrypt.make_user_id()
                port = db_user.get_largest_port(is_share=False) + 1
                user_data = {'user_id': user_id, 'create_time': cur_timestamp, 'expire_time': expiry_timestamp,
                             'port': port, 'type': user_type, 'enabled': 1, 'remarks': remarks}
                if db_user.add(user_data):
                    ok = True
                    info = u'新增用户信息成功'
                else:
                    ok = False
                    info = u'新增用户信息失败'
            elif user_type == "normal":
                user_id = encrypt.make_user_id()
                port = db_user.get_largest_port(is_share=False) + 1
                user_data = {'user_id': user_id, 'create_time': cur_timestamp, 'expire_time': expiry_timestamp,
                             'port': port, 'type': user_type, 'enabled': 1, 'remarks': remarks}
                if db_user.add(user_data):
                    count = 0
                    for i in range(1, 6):
                        sub_user_id = encrypt.make_user_id()
                        port = db_user.get_largest_port(is_share=True) + 1
                        sub_user_data = {'user_id': sub_user_id, 'parent_id': user_id, 'create_time': cur_timestamp,
                                         'expire_time': expiry_timestamp,
                                         'port': port, 'type': 'share', 'enabled': 0, 'remarks': ''}
                        if not db_user.add(sub_user_data):
                            count += 1
                    if count == 0:
                        ok = True
                        info = u"新增账户及子账号成功"
                    else:
                        ok = False
                        info = u"新增子账户失败,请检查"
                else:
                    ok = False
                    info = u'新增用户信息失败'
            else:
                ok = False
                info = "不支持的用户类型"
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        if action == 'update_time':
            user_id, add_mouth = user_data['user_id'], user_data['add_mouth']
            user_info = db_user.get(user_id)
            if user_info is not False:
                cur_expire_time = user_info['expire_time']
                cur_time = utils.cur_timestamp()
                if cur_expire_time >= cur_time:
                    new_expire_time = cur_expire_time + int(add_mouth) * 31 * 24 * 60 * 60
                else:
                    new_expire_time = cur_time + int(add_mouth) * 31 * 24 * 60 * 60
                user_data = {'user_id': user_id, 'expire_time': new_expire_time}
                if db_user.update(user_data):
                    sub_id_list = db_user.get_sub_id_list(user_id)
                    if sub_id_list:
                        count = 0
                        for sub_user_id in sub_id_list:
                            sub_user_data = {'user_id': sub_user_id, 'expire_time': new_expire_time}
                            if not db_user.update(sub_user_data):
                                count += 1
                        if count == 0:
                            ok = True
                            info = u"更新账户及子账号过期时间成功"
                        else:
                            ok = False
                            info = u"更新子账户过期时间失败,请检查"
                    else:
                        ok = True
                        info = u'更新用户过期时间成功'
                else:
                    ok = False
                    info = u'更新用户过期时间失败'
            else:
                ok = False
                info = u'获取用户信息失败'
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        ok = False
        info = u'不支持的操作类型'
        self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))

    def delete(self):
        ok, info = check.check_login(self.token)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        user_id = self.get_argument('user_id')
        if db_user.delete(user_id):
            sub_id_list = db_user.get_sub_id_list(user_id)
            if sub_id_list:
                count = 0
                for sub_user_id in sub_id_list:
                    if not db_user.delete(sub_user_id):
                        count += 1
                if count == 0:
                    ok = True
                    info = u"删除用户及子账号成功"
                else:
                    ok = False
                    info = u"删除子账户失败,请检查"
            else:
                ok = True
                info = u'删除用户成功'
        else:
            ok = False
            info = u'删除用户失败'
        self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))

    def options(self):
        pass


handlers = [
    ('/api/user', UserHandler),
]
