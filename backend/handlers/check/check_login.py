#!/usr/bin/env python
# -*- coding:utf-8 -*-

from lib import verify


def check_login(token):
    if token:
        if verify.is_expired(token):
            ok = False
            info = u"登陆超时,请重新登陆"
        else:
            ok = True
            info = ""
    else:
        ok = False
        info = u"未登陆，请先登陆"
    return ok, info
