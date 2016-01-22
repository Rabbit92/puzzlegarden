<?php

// The sitewide hashkey, do not change this because its used for passwords!
// This is for other hash keys... Not sure yet
define('HASH_GENERAL_KEY', 'MixitUp200');

// This is for database passwords only
define('HASH_PASSWORD_KEY', 'catsFLYhigh2000miles');

//url images
define('PROTOCOL',stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://');
define('PATH_IMAGE', $_SERVER['DOCUMENT_ROOT'] . '/rootme/images/');
define('URL_IMAGE', PROTOCOL . $_SERVER['SERVER_NAME'] . '/rootme/images/');
define('PATH_AUDIO', $_SERVER['DOCUMENT_ROOT'] . '/rootme/audio/');
define('URL_AUDIO', PROTOCOL . $_SERVER['SERVER_NAME'] . '/rootme/audio/');
define('RES_PASS', PROTOCOL . $_SERVER['SERVER_NAME'] . '/rootme/resPass');

//email from
define('EMAIL_FROM', 'rootz@gmail.com');

//app message
define('ERROR_DB', 'error_db');
define('ERROR_POST', 'error_post');
define('SUCCESS', 'success');
define('NOT_FOUND', 'not_found');
define('INSUFICIENT_COINS', 'insuficient_coins');
define('ERROR_EMAIL', 'error_email');
define('REG_S', 'register_successfully');
define('ERROR_INSERT', 'error_insert');
define('ERROR_EXIST', 'error_exist');
define('ERROR_WRONG', 'error_wrong');
define('ERROR', 'error');
define('ERROR_TRY_AGAIN', 'error_try_again');
define('NAME_EXIST', 'name_exist');
define('VOICE_NOT_EXIST', 'voice_not_exist');
define('VOICE_EXIST', 'voice_exist');
define('VOICE_EMPTY', 'voice_empty');
define('EVENT_EXIST', 'event_exist');

//social array
define('SOCIAL', '{"facebook":"1", "snapchat":"2", "linkedln":"3", "twitter":"4", "instagram":"5", "tumblr":"6", "youtube":"7", "friend":"8", "follow":"9"}' );





