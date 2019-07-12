
/**
 * 브라우저 기반 indexedDB를 사용하는 라이브러리입니다.
 * 메신저의 주고 받는 내용을 사용자의 로컬 저장소에 남기는 방식을 사용합니다.
 * 
 */

//use global variable
var my_database_version;

function getDatabaseVersion(db_name){
    /**
     * db_name의 데이터베이스의 버전을 가져옵니다.
     */
    let request = window.indexedDB.open(db_name);
    // let version = event.target.result.version;
    request.onsuccess = function(event){
        let version = event.target.result.version;
        my_database_version = version;
        console.log("데이터베이스 연결 성공");
        console.log("version ->", my_database_version);   
    }
}


function createDatabase(database_name){
    let request = window.indexedDB.open(database_name, 1);
    let db;

    request.onsuccess = function(event){
        console.log('[onsucess]', request.result);
        db = event.target.result;// === request.result
    };

    request.onerror = function(event){
        console.log('[onerror]', request.error);
    }
    
}

function createChatRoomStore(db_name, store_name, current_version){
    /**
     * 스키마를 변경할때 버전업됩니다.
     */
    let request = window.indexedDB.open(db_name, current_version+1);
    
    request.onupgradeneeded = function(event){
        console.log('데이터베이스의 버전이 변경되었습니다.');
        let store = event.target.result.createObjectStore(store_name, {keyPath: 'id', autoIncrement : true });
        store.createIndex('products_id_unique',  'id', {unique: true});

        store.transaction.oncomplete = function(event){
            console.log('객체 저장 트랜잭션이 완료되었습니다.');
        }
    }
};

function saveMessageToIndexedDatabase(db_name, store_name, current_version, message){
    let request = window.indexedDB.open(db_name, current_version);
    
    request.onsuccess = function(event){
        console.log("데이터 베이스 연결성공.");
        let db = request.result;
        let transaction = db.transaction([store_name], "readwrite");
        let store = transaction.objectStore(store_name);
        let obj_request = store.add(message);

        transaction.onsuccess = function(event){
            console.log("트랜잭션이 성공했씁니다.");
        }
        obj_request.onsuccess = function(event){
            console.log("메시지 저장이 성공했습니다.");
        }
    }
}

function getChatRoomFromIndexedDatabase(db_name, store_name, current_version){
    let request = window.indexedDB.open(db_name, current_version);

    request.onsuccess = function(event){
        console.log("데이터 베이스 연결 성공");
        let db = event.target.result;
        let transaction = db.transaction([store_name], "readonly");
        let store = transaction.objectStore(store_name);
        // let obj_request = store.get();
        store.openCursor().onsuccess = function(event){
            console.log('cursor open success');

            let cursor = event.target.result;
            if (cursor) {
                console.log(cursor.value);
                // console.log("Name for SSN " + cursor.key + " is " + cursor.value.message);
                cursor.continue();
              }
              else {
                console.log("No more entries!");
              }
        }

    }


}