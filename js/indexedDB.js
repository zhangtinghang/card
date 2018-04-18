var dbName = 'usersDB',     // 数据库名
    daVer = 14,              // 数据库版本号
    db = '',                // 用于数据库对象
    dbData = [];            // 用于临时存放数据的数组

// 连接数据库
function openDB(callback){
    var request = indexedDB.open(dbName, daVer);
    request.onsuccess = function(e){
        db = e.target.result;
        // 数据库连接成功后渲染表格
        return callback && callback({type:true,message:'success'});
    }
    request.onerror = function(){
        console.log('连接数据库失败');
        return callback && callback({type:false,message:'open fail'});
    }
    request.onupgradeneeded = function(e){ 
        db = e.target.result;
        // 如果不存在对象仓库则创建
        if(!db.objectStoreNames.contains('Cards')){
            var store = db.createObjectStore('Cards',{keyPath: 'uuid', autoIncrement: false});
            store.createIndex('nameIndex','name',{unique: false});
        }
        if(!db.objectStoreNames.contains('Company')){
            var store = db.createObjectStore('Company',{keyPath: 'uuid', autoIncrement: false});
            var idx = store.createIndex('companyIndex','name',{unique: false});
        }
        if(!db.objectStoreNames.contains('Visit')){
            var store = db.createObjectStore('Visit',{keyPath: 'uuid', autoIncrement: false});
            store.createIndex('ownerIndex','owner_uuid',{unique: false});
        }
    }
}

/**
 * 保存数据
 * @param {Object} storeName 要保存到数据库的仓库
 * @param {Object} data 要保存到数据库的数据对象
 * @param {Object} state 要保存到数据库的权限
 */
function saveData(storeName,data,state){
	var state = state ||'readwrite';
	console.log(storeName,data,state)
    var tx = db.transaction(storeName,state);
    var store = tx.objectStore(storeName);
    var req = store.put(data);
    req.onsuccess = function(){
        console.log('成功保存id为'+this.result+'的数据');
    }
}

/**
 * 删除单条数据
 * @param {int} id 要删除的数据主键
 */
function deleteOneData(id){
    var tx = db.transaction('Users','readwrite');
    var store = tx.objectStore('Users');
    var req = store.delete(id);
    req.onsuccess = function(){
        // 删除数据成功之后重新渲染表格
        vm.getData();
    }
}
/**
 * 更新单条数据
 * @param {int} id 要删除的数据主键
 */
function updateOneData(id){
    var tx = db.transaction('Users','readwrite');
    var store = tx.objectStore('Users');
    var req = store.delete(id);
    req.onsuccess = function(){
        // 删除数据成功之后重新渲染表格
        vm.getData();
    }
}
/**
 * 查询单条数据
 * @param {string} 根据uuid查询相关内容
 */
function selectUidData(storeName,id,callback){
    var tx = db.transaction(storeName,'readonly');
    var store = tx.objectStore(storeName);
    var req = store.get(id);
    req.onsuccess = function(){
        return callback && callback(this.result);
    }
}
/**
 * 查询单条数据
 * @param {string} 根据索引查询相关内容
 */
function selectOneData(storeName,indexName,id,callback){
    var tx = db.transaction(storeName,'readonly');
    var store = tx.objectStore(storeName);
    var index = store.index(indexName);
    var onlyRange = IDBKeyRange.only(id);
    var req = index.openCursor(onlyRange);
    var database = [];
    req.onsuccess = function(e){
    	var cursor = e.target.result;
    	if(cursor){
            database.push(cursor.value);
            cursor.continue();
       }else{
            return callback && callback(database);
        }
    	
    }
}
/**
 * 检索全部数据
 * @param {function} callback 回调函数
 */
function searchData(storeName,callback){
	var transaction = db.transaction(storeName, 'readonly');
    var store = transaction.objectStore(storeName);
    var database = [];
    store.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		 if (cursor) {
		 	database.push(cursor.value);
		   cursor.continue();
		}
		else {
			return callback && callback(database);
		}
	};
}