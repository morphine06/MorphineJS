'use strict';
import {M_} from './../../../libs/M_.js';
export class MT_JobsTypes extends M_.Model {
getDefinition() {
return {
"primaryKey": "jt_id",
"fields":
[
	{
		"primary": true,
		"type": "int",
		"autoincrement": true,
		"name": "jt_id"
	},
	{
		"type": "varchar",
		"name": "jt_name"
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