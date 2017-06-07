#!/usr/bin/env python
# -*- coding:utf-8 -*-
"""
    user table operation
"""

from peewee import *
from _db_init import *
from lib.logger import log


def row_count():
    try:
        count = User.select().count()
    except Exception:
        log.exception('exception')
        return 0
    else:
        return count


def get(user_id=None, start=0, count=10):
    if user_id:
        try:
            info = User.select().where(User.user_id == user_id).get()
        except Exception:
            log.exception('exception')
            return False
        else:
            return info.__dict__['_data']
    else:
        data_list = []
        try:
            for info in User.select().order_by(User.id).offset(start).limit(count):
                data_list.append(info.__dict__['_data'])
        except Exception:
            log.exception('exception')
            return False
        else:
            return data_list


def get_sub_id_list(parent_id):
    data_list = []
    try:
        for info in User.select().where(User.parent_id == parent_id):
            data_list.append(info.__dict__['_data']['user_id'])
    except Exception:
        log.exception('exception')
        return False
    else:
        return data_list


def add(user_dict):
    user = User()
    for key in user_dict:
        setattr(user, key, user_dict[key])
    try:
        user.save()
    except Exception:
        log.exception('exception')
        return False
    else:
        return True


def update(user_dict):
    user = User.get(user_id=user_dict['user_id'])
    for key in user_dict:
        if key != 'user_id':
            setattr(user, key, user_dict[key])
    try:
        user.save()
    except Exception:
        log.exception('exception')
        return False
    else:
        return True


def delete(user_id):
    del_data = (User
                .delete()
                .where(User.user_id == user_id))
    try:
        del_data.execute()
    except Exception:
        log.exception('exception')
        return False
    else:
        if get(user_id):
            return False
        else:
            return True


# 获取最大的端口号，分享账户从20000开始，其他账户从10000开始
def get_largest_port(is_share=False):
    if is_share:
        try:
            info = User.select(User.port).where(User.type == 'share').order_by(User.port.desc()).limit(1).get()
        except:
            return 10000
        else:
            return info.__dict__['_data']['port']
    else:
        try:
            info = User.select(User.port).where(User.type != 'share').order_by(User.port.desc()).limit(1).get()
        except:
            return 20000
        else:
            return info.__dict__['_data']['port']
