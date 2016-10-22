'use strict';
import {M_} from './../../../libs/M_.js';
export class MT_Jobs extends M_.Model {
getDefinition() {
return {
"primaryKey": "jo_id",
"fields":
[
	{
		"primary": true,
		"type": "int",
		"autoincrement": true,
		"name": "jo_id"
	},
	{
		"type": "varchar",
		"name": "jo_name"
	},
	{
		"model": "JobsTypes",
		"name": "jt_id"
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