# Remove previous proto files
rm -rf ./src/grpc_generated_protos/*

# Compile all .proto files
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./src/grpc_generated_protos/ --grpc_out=grpc_js:./src/grpc_generated_protos/ ./protos/*.proto
