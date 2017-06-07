#!/usr/bin/env python
# -*- coding:utf-8 -*-

from peewee import *
from playhouse.pool import PooledMySQLDatabase
from lib import config

# mysql connection pool
db = PooledMySQLDatabase(
    database=config.dbname,
    host=config.dbhost,
    port=config.dbport,
    user=config.dbuser,
    passwd=config.dbpass,
    charset='utf8',
    max_connections=20,
    stale_timeout=300
)


# base model
class BaseModel(Model):
    class Meta:
        database = db


# task table
class User(BaseModel):
    id = IntegerField()
    user_id = CharField(unique=True)
    parent_id = CharField()
    type = CharField()
    create_time = IntegerField()
    expire_time = IntegerField()
    enabled = BooleanField()
    port = IntegerField(unique=True)
    net_flow = IntegerField()
    remarks = CharField()

    class Meta:
        db_table = 'user'


# session table
class Session(BaseModel):
    id = IntegerField()
    user_id = CharField(unique=True)
    access_token = CharField(unique=True)
    action_time = IntegerField()
    expire_time = IntegerField()

    class Meta:
        db_table = 'session'


