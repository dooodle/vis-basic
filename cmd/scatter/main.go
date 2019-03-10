package main

import (
	"flag"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
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
			//w.Header().Set("Content-Type", "image/svg+xml")
			Basic(w)
		})

		http.HandleFunc("/", simpleFileServer)
		log.Fatal(http.ListenAndServe(":8080", nil))
	}
	Basic(os.Stdout)
}

func Basic(w io.Writer) {
	contents, err := ioutil.ReadFile("template2.svg")
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

//simpleFileServer implements a very simple file server. It only serves
//files that exist in the current directory. It only uses the base of
//the path and ignores any directories
func simpleFileServer(w http.ResponseWriter, r *http.Request) {
	u, err := url.Parse(r.URL.String())
	if err != nil {
		log.Println(err)
		w.WriteHeader(409)
		return
	}
	serveFile(w, path.Base(u.String()))
}

//serveFile serves the file to the writer
func serveFile(w io.Writer, name string) {
	contents, err := ioutil.ReadFile(name)
	if err != nil {
		log.Fatal(err)
	}

	w.Write(contents)
}