package main

import (
	"C"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"gopkg.in/mgo.v2/bson"
	"internal/dmos"
	"internal/jsquery"
	"io"
	"os"
)

type Configuration struct {
	dataFile string `json:"dataFile"`
}

var storage = []interface{}{}
var storageFile *os.File

//export Boot
func Boot(journalFileC *C.char) {
	journalFile := C.GoString(journalFileC)
	file, _ := os.OpenFile(journalFile, os.O_RDWR|os.O_CREATE, 0755)
	storageFile = file

	var n int
	var err error
	for err != io.EOF {
		b := make([]byte, 4)
		n, err = storageFile.Read(b)
		if n == 0 {
			continue
		}
		size := binary.LittleEndian.Uint32(b)
		d := make([]byte, size)
		copy(d, b)
		n, err = storageFile.Read(d[4:])
		var data interface{}
		bson.Unmarshal(d, &data)
		storage = append(storage, data)
	}
}

//export Shutdown
func Shutdown() {
	storageFile.Close()
}

//export Store
func Store(str string) {
	var data map[string]interface{}
	json.Unmarshal([]byte(str), &data)
	storage = append(storage, data)
	b, _ := bson.Marshal(data)
	storageFile.Write(b)
}

//export GetAll
func GetAll() *C.char {
	b, _ := json.Marshal(storage)
	return C.CString(string(b))
}

//export Query
func Query(cStr *C.char) *C.char {
	str := C.GoString(cStr)
	var queryAST []interface{}
	json.Unmarshal([]byte(str), &queryAST)
	queryExpr := dmos.QToExpr(queryAST)
	results := []interface{}{}
	for _, data := range storage {
		if queryExpr.F(data).(bool) {
			results = append(results, data)
		}
	}
	b, _ := json.Marshal(results)
	return C.CString(string(b))
}

//export JsQuery
func JsQuery(cStr *C.char) *C.char {
	str := C.GoString(cStr)
	queryExpr, _ := jsquery.JsToExpr(str)
	results := []interface{}{}
	for _, data := range storage {
		if queryExpr.F(data).(bool) {
			results = append(results, data)
		}
	}
	b, _ := json.Marshal(results)
	return C.CString(string(b))
}

func main() {
	fmt.Println("hi")
}
