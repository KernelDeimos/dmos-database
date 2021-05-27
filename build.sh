node build/generate_go > src_go/internal/dmos/exprs.go
cd src_go
gofmt -w -s .
if [ $(uname -s) = Darwin ]; then
  go build -o dmos.dylib -buildmode=c-shared dmos.go
else
  go build -o dmos.so -buildmode=c-shared dmos.go
fi
cd ..
