/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./GraphQL.ts":
/*!********************!*\
  !*** ./GraphQL.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Client\": () => (/* binding */ Client),\n/* harmony export */   \"Query\": () => (/* binding */ Query),\n/* harmony export */   \"QueryRow\": () => (/* binding */ QueryRow),\n/* harmony export */   \"QueryRowSingle\": () => (/* binding */ QueryRowSingle),\n/* harmony export */   \"multipleQuery\": () => (/* binding */ multipleQuery),\n/* harmony export */   \"Mutation\": () => (/* binding */ Mutation),\n/* harmony export */   \"mutation\": () => (/* binding */ mutation)\n/* harmony export */ });\n/* harmony import */ var _GraphQL_Url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphQL/Url */ \"./GraphQL/Url.ts\");\n\nclass ResultRows {\n    constructor(rows, allRowsCount = 0) {\n        this.rows = rows;\n        this.allRowsCount = allRowsCount;\n        this.hasName = true;\n        this.hasId = true;\n        this.byNameHash = {};\n        this.byIdHash = {};\n        rows.forEach((row) => {\n            let keys = {};\n            Object.keys(row).forEach((key) => {\n                keys[key] = true;\n            });\n            this.hasName = this.hasName && keys[\"name\"];\n            this.hasId = this.hasId && keys[\"id\"];\n            this.byNameHash[row[\"name\"]] = row;\n            this.byIdHash[row[\"id\"]] = row;\n        });\n    }\n    get(index) {\n        return this.rows[index];\n    }\n    get length() {\n        return this.rows.length;\n    }\n    map(cb) {\n        return this.rows.map(cb);\n    }\n    forEach(cb) {\n        return this.rows.forEach(cb);\n    }\n    filter(cb) {\n        return this.rows.filter(cb);\n    }\n    unshift(row) {\n        return this.rows.unshift(row);\n    }\n    push(row) {\n        return this.rows.push(row);\n    }\n    pop() {\n        return this.rows.pop();\n    }\n    shift() {\n        return this.rows.shift();\n    }\n    getByName(name) {\n        if (!this.hasName) {\n            throw (\"not have name\");\n        }\n        return this.byNameHash[name];\n    }\n    getById(id) {\n        if (!this.hasId) {\n            throw (\"not have id\");\n        }\n        return this.byIdHash[id];\n    }\n}\nclass Client {\n    createQuery(queries) {\n        return `{\"query\" : \"{${queries.map(query => {\n            return query.getQuery();\n        }).join(\",\")}}\"}`;\n    }\n    call(queries, failedCallback = (result) => {\n    }, successCallback = (result) => {\n    }) {\n        const body = this.createQuery(queries);\n        const method = \"POST\";\n        const headers = {\n            'Accept': 'application/json',\n            'Content-Type': 'application/json',\n        };\n        return fetch(_GraphQL_Url__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n            mode: 'cors',\n            credentials: 'include',\n            body, method, headers\n        }).then(response => {\n            return response.json();\n        }).then(result => {\n            const resultRowObjects = {};\n            const maxRowCounts = {};\n            queries.forEach((query) => {\n                if (result[\"data\"] && result[\"data\"][query.queryName] && result[\"data\"][query.queryName][\"errors\"]) {\n                    failedCallback(result);\n                    return;\n                }\n                if (result[\"errors\"]) {\n                    failedCallback(result);\n                    return;\n                }\n                if (result[\"error\"]) {\n                    failedCallback(result);\n                    return;\n                }\n                if (query instanceof QueryRow) {\n                    const rowObject = new ResultRows(result[\"data\"][query.queryName][\"rows\"], result[\"data\"][query.queryName][\"count\"]);\n                    resultRowObjects[query.queryName] = rowObject;\n                    query.successCallback(rowObject, result[\"data\"][query.queryName][\"count\"]);\n                }\n                else {\n                    resultRowObjects[query.queryName] = result[\"data\"][query.queryName];\n                    query.successCallback(result[\"data\"][query.queryName]);\n                }\n            });\n            return Promise.resolve(resultRowObjects);\n        });\n    }\n}\nclass Query extends Client {\n    constructor(queryName, queryArguments, getColumns, successCallback = (result) => {\n    }, failedCallback = (result) => {\n    }) {\n        super();\n        getColumns = getColumns.map((column) => {\n            if (column instanceof Object) {\n                return `${column.name}{${column.children.join(\",\")}}`;\n            }\n            else {\n                return column;\n            }\n        });\n        let query = `{\"query\" : \" {${queryName}(${JSON.stringify(queryArguments).replace(/\\{|}$/g, \"\").replace(/\"([^\"]*?)\":/g, (arg1, arg2) => {\n            return arg2 + \":\";\n        }).replace(/\"/g, '\\\\\"')}){${getColumns.join(\",\")}}}\"}`;\n    }\n}\nclass QueryRow {\n    constructor(queryName, queryArguments, getColumns, successCallback = (row, count) => {\n    }) {\n        this.queryName = queryName;\n        this.queryArguments = queryArguments;\n        this.getColumns = getColumns;\n        this.successCallback = successCallback;\n    }\n    getQuery() {\n        let hasAll = false;\n        let getColumns = this.getColumns.map((column) => {\n            if (column instanceof Object) {\n                return `${column.name}{${column.children.join(\",\")}}`;\n            }\n            else {\n                if (column == \"all\") {\n                    hasAll = true;\n                }\n                return column;\n            }\n        });\n        if (hasAll) {\n            getColumns = getColumns.filter(column => column != \"all\");\n            getColumns.push(...this.getAllColumns());\n            getColumns.push(\"id\");\n        }\n        if (this.hasSortOrder() && !this.queryArguments[\"order\"]) {\n            this.queryArguments[\"order\"] = \"sort_order ASC\";\n        }\n        let s = `${this.queryName}(${JSON.stringify(this.queryArguments).replace(/\\{|}$/g, \"\").replace(/\"([^\"]*?)\":/g, (arg1, arg2) => {\n            return arg2 + \":\";\n        }).replace(/\"/g, '\\\\\"')}){count , rows{${getColumns.join(\",\")}}}`;\n        s = s.replace(/\\(\\)/, \"\");\n        return s;\n    }\n}\nclass QueryRowSingle {\n    constructor(queryName, queryArguments, getColumns, successCallback = (row) => {\n    }) {\n        this.queryName = queryName;\n        this.queryArguments = queryArguments;\n        this.getColumns = getColumns;\n        this.successCallback = successCallback;\n    }\n    getQuery() {\n        let hasAll = false;\n        let getColumns = this.getColumns.map((column) => {\n            if (column instanceof Object) {\n                return `${column.name}{${column.children.join(\",\")}}`;\n            }\n            else {\n                if (column == \"all\") {\n                    hasAll = true;\n                }\n                return column;\n            }\n        });\n        if (hasAll) {\n            getColumns = this.getAllColumns();\n            getColumns.push(\"id\");\n        }\n        return `${this.queryName}(${JSON.stringify(this.queryArguments).replace(/\\{|}$/g, \"\").replace(/\"([^\"]*?)\":/g, (arg1, arg2) => {\n            return arg2 + \":\";\n        }).replace(/\"/g, '\\\\\"')}){${getColumns.join(\",\")}}`;\n    }\n}\nfunction multipleQuery(failedCallback, ...queries) {\n    return new Client().call(queries.filter(query => !!query), failedCallback);\n}\nclass Mutation extends Client {\n    constructor(queryName, queryArguments, getColumns, successCallback = (result) => {\n    }, failedCallback = (result) => {\n    }) {\n        super();\n        this.queryName = queryName;\n        this.queryArguments = queryArguments;\n        this.getColumns = getColumns;\n        this.successCallback = successCallback;\n        getColumns.push(\"errors\");\n        this.call([this], failedCallback);\n    }\n    createQuery() {\n        return `{\"query\" : \"mutation{${this.queryName} ( input: ${JSON.stringify(this.queryArguments).replace(/\"([^\"]*?)\":/g, (arg1, arg2) => {\n            return arg2 + \":\";\n        }).replace(/\"/g, '\\\\\"')} ){${this.getColumns.join(\",\")} } }\"}`;\n    }\n}\nclass MutationForAsync extends Client {\n    constructor(queryName, queryArguments, getColumns, successCallback = (result) => {\n    }, failedCallback = (result) => {\n    }) {\n        super();\n        this.queryName = queryName;\n        this.queryArguments = queryArguments;\n        this.getColumns = getColumns;\n        this.successCallback = successCallback;\n    }\n    createQuery() {\n        return `{\"query\" : \"mutation{${this.queryName} ( input: ${JSON.stringify(this.queryArguments).replace(/\"([^\"]*?)\":/g, (arg1, arg2) => {\n            return arg2 + \":\";\n        }).replace(/\"/g, '\\\\\"')} ){${this.getColumns.join(\",\")} } }\"}`;\n    }\n}\nfunction mutation(queryName, queryArguments, getColumns, successCallback = (result) => {\n}, failedCallback = (result) => {\n}) {\n    getColumns.push(\"errors\");\n    const mutation = new MutationForAsync(queryName, queryArguments, getColumns, successCallback, failedCallback);\n    mutation.call([mutation], failedCallback);\n}\n\n\n//# sourceURL=webpack://client/./GraphQL.ts?");

/***/ }),

/***/ "./GraphQL/Queries.ts":
/*!****************************!*\
  !*** ./GraphQL/Queries.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Books\": () => (/* binding */ Books),\n/* harmony export */   \"Book\": () => (/* binding */ Book)\n/* harmony export */ });\n/* harmony import */ var _GraphQL__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../GraphQL */ \"./GraphQL.ts\");\n\nclass Books extends _GraphQL__WEBPACK_IMPORTED_MODULE_0__.QueryRow {\n    constructor(queryArguments, getColumns, successCallback = (row) => { }) {\n        super('books', queryArguments, getColumns, successCallback);\n    }\n    getAllColumns() {\n        return ['title', \"author\"];\n    }\n    hasSortOrder() {\n        return false;\n    }\n}\nclass Book extends _GraphQL__WEBPACK_IMPORTED_MODULE_0__.QueryRowSingle {\n    constructor(queryArguments, getColumns, successCallback = (row) => { }) {\n        super('book', queryArguments, getColumns, successCallback);\n    }\n    getAllColumns() {\n        return ['title', \"author\"];\n    }\n    hasSortOrder() {\n        return false;\n    }\n}\n\n\n//# sourceURL=webpack://client/./GraphQL/Queries.ts?");

/***/ }),

/***/ "./GraphQL/Url.ts":
/*!************************!*\
  !*** ./GraphQL/Url.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"http://localhost:4000\");\n\n\n//# sourceURL=webpack://client/./GraphQL/Url.ts?");

/***/ }),

/***/ "./Run.ts":
/*!****************!*\
  !*** ./Run.ts ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _GraphQL_Queries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphQL/Queries */ \"./GraphQL/Queries.ts\");\n/* harmony import */ var _GraphQL__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GraphQL */ \"./GraphQL.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\nconsole.log(\"11111111111111\");\nfunction hoge() {\n    return __awaiter(this, void 0, void 0, function* () {\n        console.log(\"aaaaaaaaaaaaaa\");\n        const state = yield (0,_GraphQL__WEBPACK_IMPORTED_MODULE_1__.multipleQuery)((e) => {\n        }, new _GraphQL_Queries__WEBPACK_IMPORTED_MODULE_0__.Books({}, [\n            \"title\",\n            \"author\",\n        ]));\n        console.log(\"bbbbbbbbbbbbbb\");\n        console.log(state);\n    });\n}\nconsole.log(\"22222222222222\");\nhoge();\nconsole.log(\"33333333333333\");\n\n\n//# sourceURL=webpack://client/./Run.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./Run.ts");
/******/ 	
/******/ })()
;