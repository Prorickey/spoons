FROM golang:1.23

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -o spoonmaster-app .

EXPOSE 7892

RUN chmod +x spoonmaster-app

CMD ["./spoonmaster-app"]