package jsquery

import (
	"errors"
	"github.com/robertkrimen/otto/ast"
	"github.com/robertkrimen/otto/parser"
	"github.com/robertkrimen/otto/token"
	"internal/dmos"
)

func JsToExpr(code string) (dmos.Expr, error) {
	var expr dmos.Expr
	expr = dmos.Expr_true{}

	prog, err := parser.ParseFile(nil, "", code, 0)
	if err != nil {
		return dmos.Expr_false{}, err
	}

	for _, stmt := range prog.Body {
		var astExpr ast.Expression
		switch tStmt := stmt.(type) {
		case *ast.ExpressionStatement:
			astExpr = tStmt.Expression
		default:
			return dmos.Expr_false{}, errors.New("jsquery cannot include a statement")
		}
		expr = dmos.Expr_and{
			Predicates: []dmos.Expr{
				expr,
				AstExprToExpr(astExpr),
			},
		}
	}

	return expr, nil
}

func AstExprToExpr(astExpr ast.Expression) dmos.Expr {
	switch tExpr := astExpr.(type) {
	case *ast.StringLiteral:
		return dmos.Expr_literal{
			Any: tExpr.Value,
		}
	case *ast.NumberLiteral:
		return dmos.Expr_literal{
			Any: tExpr.Value,
		}
	case *ast.Identifier:
		return dmos.Expr_get{
			Keys: []string{
				tExpr.Name,
			},
		}
	case *ast.DotExpression:
		return dmos.Expr_seq{
			Delegates: []dmos.Expr{
				AstExprToExpr(tExpr.Left),
				AstExprToExpr(tExpr.Identifier),
			},
		}
	case *ast.BinaryExpression:
		switch tExpr.Operator {
		case token.EQUAL:
			return dmos.Expr_eq{
				Values: []dmos.Expr{
					AstExprToExpr(tExpr.Left),
					AstExprToExpr(tExpr.Right),
				},
			}
		case token.LOGICAL_AND:
			return dmos.Expr_and{
				Predicates: []dmos.Expr{
					AstExprToExpr(tExpr.Left),
					AstExprToExpr(tExpr.Right),
				},
			}
		case token.LOGICAL_OR:
			return dmos.Expr_or{
				Predicates: []dmos.Expr{
					AstExprToExpr(tExpr.Left),
					AstExprToExpr(tExpr.Right),
				},
			}
		}
	}
	return dmos.Expr_false{}
}
