FROM golang:1.23

WORKDIR /app

COPY go.mod go.sum spoonmaster.go ./spoonmaster/
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 7892

CMD ["app"]