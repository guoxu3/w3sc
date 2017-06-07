-- task 表，存储task信息
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(40) NOT NULL UNIQUE,
  `parent_id` VARCHAR(40) DEFAULT NULL,
  `type` VARCHAR(40) NOT NULL DEFAULT 'normal',
  `create_time` INT(10) NOT NULL,
  `expire_time` INT(10) NOT NULL,
  `enabled` BOOLEAN DEFAULT FALSE,
  `port` INT(10) UNIQUE,
  `net_flow` INT(20) DEFAULT 0,
  `remarks` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- session表  权限对应关系
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(40) NOT NULL UNIQUE,
  `access_token` VARCHAR(100) NOT NULL UNIQUE,
  `action_time` INT(10) NOT NULL,
  `expire_time` INT(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

