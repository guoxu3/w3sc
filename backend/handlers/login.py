#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
    user login handler
"""

import tornado.web
import tornado.escape
from lib import encrypt, config, verify
from db import db_session
import utils
import check
import json


class LoginHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def __init__(self, application, request, **kwargs):
        super(LoginHandler, self).__init__(application, request, **kwargs)
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, content-type")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
        self.token = self.get_secure_cookie("access_token")

    def get(self):
        ok, info = check.check_login(self.token)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        if check.check_admin(self.token):
            info = {'is_admin': True}
        else:
            info = {'is_admin': False}
        self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))

    def post(self):
        ok, info = check.check_content_type(self.request)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        user_info = json.loads(self.request.body)
        user_id = user_info['user_id']
        ok, info = check.check_user_id(user_id)
        if not ok:
            self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))
            return

        access_token = encrypt.make_cookie_secret()
        action_time = utils.cur_timestamp()
        session_data = {'access_token': access_token, 'user_id': user_id, 'action_time': action_time,
                        'expire_time': action_time + config.expire_second}

        if db_session.update(session_data):
            self.set_secure_cookie("access_token", access_token)
            self.set_cookie("user_id", user_id)
            ok = True
            info = {}
        else:
            ok = False
            info = u"登陆失败，请联系管理员！"
        self.finish(tornado.escape.json_encode({'ok': ok, 'info': info}))

    def options(self):
        pass


handlers = [
    ('/api/login', LoginHandler),
]
