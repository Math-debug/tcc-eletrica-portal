docker build .
tag='mxavier27/tcc-eletrica-portal:latest' && docker build -t $tag . && docker push $tag