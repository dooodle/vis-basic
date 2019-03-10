package main

import (
	"flag"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"text/template"
)

type Scatter = struct {
	Height string
	Width  string
	x      string
	y      string
	c      string
}

var serve = flag.Bool("http", false, "run as http server")

func main() {
	flag.Parse()
	if *serve {
		http.HandleFunc("/basic", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "image/svg+xml")
			Basic(w)
		})
		log.Fatal(http.ListenAndServe(":8080", nil))
	}
	Basic(os.Stdout)
}

func Basic(w io.Writer) {
	contents, err := ioutil.ReadFile("template.svg")
	if err != nil {
		log.Fatal(err)
	}
	tmpl, err := template.New("test").Parse(string(contents))
	if err != nil {
		log.Fatal(err)
	}
	err = tmpl.Execute(w, initial())
	if err != nil {
		log.Fatal(err)
	}
}

func initial() Scatter {
	return Scatter{Height: "500", Width: "500"}
}