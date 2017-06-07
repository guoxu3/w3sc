#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
   collect all handlers
"""

from handlers import login, user, admin_login

# Routes
handlers = []
handlers.extend(login.handlers)
handlers.extend(user.handlers)
handlers.extend(admin_login.handlers)
