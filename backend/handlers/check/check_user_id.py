#!/usr/bin/env python
# -*- coding:utf-8 -*-

from db import db_user
import utils


def check_user_id(user_id):
    user_info = db_user.get(user_id)
    if user_info is not False:
        cur_time = utils.cur_timestamp()
        if cur_time <= user_info['expire_time']:
            ok = False
            info = "Account expired"
        else:
            ok = True
            info = ''
    else:
        ok = False
        info = "No such a user"

    return ok, info
