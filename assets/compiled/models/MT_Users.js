'use strict';
import {M_} from './../../../libs/M_.js';
export class MT_Users extends M_.Model {
getDefinition() {
return {
"primaryKey": "us_id",
"fields":
[
	{
		"type": "integer",
		"autoincrement": true,
		"primary": true,
		"name": "us_id"
	},
	{
		"model": "Jobs",
		"name": "jo_id"
	},
	{
		"type": "varchar",
		"defaultsTo": "",
		"index": true,
		"name": "us_name"
	},
	{
		"type": "varchar",
		"defaultsTo": "",
		"index": true,
		"name": "us_firstname"
	},
	{
		"type": "varchar",
		"index": true,
		"name": "us_login"
	},
	{
		"type": "varchar",
		"minLength": 6,
		"name": "us_password"
	},
	{
		"type": "varchar",
		"index": true,
		"name": "us_num"
	},
	{
		"type": "datetime",
		"index": true,
		"name": "createdAt"
	},
	{
		"type": "datetime",
		"index": true,
		"name": "updatedAt"
	}
]
} ;
}} 