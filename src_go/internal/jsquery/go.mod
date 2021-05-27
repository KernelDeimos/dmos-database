module jsquery

go 1.12

require (
	github.com/luci/go-render v0.0.0-20160219211803-9a04cc21af0f
	github.com/robertkrimen/otto v0.0.0-20200922221731-ef014fd054ac
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22 // indirect
	gopkg.in/sourcemap.v1 v1.0.5 // indirect
	internal/dmos v1.0.0
)

replace internal/dmos => ../dmos
