package jsquery

import (
	"fmt"
	"github.com/luci/go-render/render"
	"github.com/robertkrimen/otto/parser"
	"testing"
)

func TestIt(t *testing.T) {
	testJs := `
    ( a == 1 && a == 2 ) || b == 1
  `
	prog, err1 := parser.ParseFile(nil, "", testJs, 0)
	fmt.Println(render.Render(prog.Body))
	fmt.Println(render.Render(err1))

	expr, err2 := JsToExpr(testJs)
	fmt.Println(render.Render(expr))
	fmt.Println(render.Render(err2))
}
