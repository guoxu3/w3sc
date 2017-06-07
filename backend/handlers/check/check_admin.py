#!/usr/bin/env python
# -*- coding:utf-8 -*-

from db import db_session


def check_admin(token):
    session_info = db_session.get(token)
    if session_info['user_id'] == 'admin':
        return True
    else:
        return False
