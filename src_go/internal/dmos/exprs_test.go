package dmos

import (
	"fmt"
	"testing"
)

func TestIt(t *testing.T) {
	data := map[string]interface{}{
		"text": "hello",
	}
	query := []interface{}{
		"eq",
		[]interface{}{
			"literal",
			"hello",
		},
		[]interface{}{
			"get",
			"text",
		},
	}
	fmt.Println("Yay")
	fmt.Println(data)
	fmt.Println(query)

	expr := QToExpr(query)
	fmt.Println(expr)
	result := expr.F(data)
	fmt.Println(result)
}
