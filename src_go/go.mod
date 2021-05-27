module dmos-main

go 1.12

require (
	github.com/mitchellh/mapstructure v1.4.1 // indirect
	gopkg.in/mgo.v2 v2.0.0-20190816093944-a6b53ec6cb22
	internal/dmos v1.0.0
	internal/jsquery v1.0.0
)

replace internal/dmos => ./internal/dmos

replace internal/jsquery => ./internal/jsquery
