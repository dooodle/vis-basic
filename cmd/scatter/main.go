package main

import (
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
	"text/template"
)

type basicVis interface{}

//Scatter provides the parameters for a 'scatter diagram`. As per the
//reference paper.. "...each point represents an instance of E, and two
//dimensions a1 and a2 are used to plot its coordinates. Optionally; a
//third dimension a3 can be used to colour it. p95, "Towards...." in
//"Conceptual Modelling...."
type Scatter = struct {
	Height   string
	Width    string
	Relation string // E
	X        string // a1
	Y        string // a2
	C        string // a3
}

var serve = flag.String("http", ":8080", "run as http server")
var queryService = flag.String("qh", "", "url for query service eg http://127.0.0.1:31784")

func main() {
	flag.Parse()
	fmt.Println("sdfds", *queryService)
	if *queryService == "" {
		log.Println("please provide a query service")
		flag.Usage()
		os.Exit(1)
	}

	http.HandleFunc("/mondial/economy.csv", func(w http.ResponseWriter, r *http.Request) {
		resp, err := http.Get(*queryService + "/mondial/economy?h=true")
		if err != nil {
			log.Println(err)
			w.WriteHeader(409)
			return
		}
		_, err = io.Copy(w, resp.Body)
		if err != nil {
			log.Println(err)
			w.WriteHeader(409)
			return
		}
		defer resp.Body.Close()
	})

	http.HandleFunc("/basic", func(w http.ResponseWriter, r *http.Request) {
		//w.Header().Set("Content-Type", "image/svg+xml")
		vis := dummy()
		r.ParseForm()
		if x := r.FormValue("x"); x != "" {
			vis.X = x
		}
		if y := r.FormValue("y"); y != "" {
			vis.Y = y
		}
		Basic(w, vis)
	})

	http.HandleFunc("/", simpleFileServer)
	log.Fatal(http.ListenAndServe(*serve, nil))

	flag.Usage()
}

func Basic(w io.Writer, t basicVis) error {
	contents, err := ioutil.ReadFile("scatter.svg")
	if err != nil {
		return err
	}
	tmpl, err := template.New("test").Parse(string(contents))
	if err != nil {
		return err
	}
	err = tmpl.Execute(w, t)
	if err != nil {
		return err
	}
	return nil
}

func dummy() Scatter {
	return Scatter{
		Height:   "500",
		Width:    "500",
		Relation: "economy",
		X:        "inflation",
		Y:        "unemployment",
	}
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
	err = serveFile(w, path.Base(u.String()))
	if err != nil {
		log.Println(err)
		w.WriteHeader(409)
		return
	}
}

//serveFile serves the file to the writer
func serveFile(w io.Writer, name string) error {
	contents, err := ioutil.ReadFile(name)
	if err != nil {
		return err
	}

	w.Write(contents)
	return nil
}