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
	"regexp"
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
	Label    string
	IsLogX   bool
	IsLogY   bool
}

type Bubble = struct {
	Height   string
	Width    string
	Relation string // E
	X        string // a1
	Y        string // a2
	S        string // a3
	C        string // a4
	Label    string
	IsLogX   bool
	IsLogY   bool
}

type Bar = struct {
	Height   string
	Width    string
	Relation string // E
	X        string // a1
	Label    string
	IsLogX   bool
	IsLogY   bool
}

type Line = struct {
	Height   string
	Width    string
	Relation string // E
	Strong   string //k1
	Weak     string //k2
	Measure  string
	Label    string
	IsLogX   bool
	IsLogY   bool
}

type O2mCircle = struct {
	Height   string
	Width    string
	Relation string // E
	One      string //k1
	Many     string //k2
	Measure  string
	Label    string
}

var serve = flag.String("http", ":8080", "run as http server")
var queryService = flag.String("qh", "", "url for query service eg http://127.0.0.1:31784")

func main() {
	flag.Parse()
	fmt.Println("query service:", *queryService)
	if *queryService == "" {
		log.Println("please provide a query service")
		flag.Usage()
		os.Exit(1)
	}

	http.HandleFunc("/basic/mondial/", func(w http.ResponseWriter, r *http.Request) {
		var re = regexp.MustCompile(`/basic/mondial/([\w\-]+).csv$`)
		switch {
		case re.MatchString(r.URL.Path):
			matches := re.FindStringSubmatch(r.URL.Path)
			entity := matches[1]
			query := fmt.Sprintf("%s/mondial/%s?h=true", *queryService, entity)
			log.Println("calling", query)
			resp, err := http.Get(query)
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
		default:
			log.Println("Improper Url: " + r.URL.Path)
			w.WriteHeader(404)
		}
	})

	http.HandleFunc("/weak/mondial/", func(w http.ResponseWriter, r *http.Request) {
		var re = regexp.MustCompile(`/weak/mondial/([\w\-]+).csv$`)
		switch {
		case re.MatchString(r.URL.Path):
			matches := re.FindStringSubmatch(r.URL.Path)
			entity := matches[1]
			query := fmt.Sprintf("%s/mondial/%s?h=true&null=true", *queryService, entity)
			log.Println("calling", query)
			resp, err := http.Get(query)
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
		default:
			log.Println("Improper Url: " + r.URL.Path)
			w.WriteHeader(404)
		}
	})

	http.HandleFunc("/o2m/mondial/", func(w http.ResponseWriter, r *http.Request) {
		var re = regexp.MustCompile(`/o2m/mondial/([\w\-]+).csv$`)
		switch {
		case re.MatchString(r.URL.Path):
			matches := re.FindStringSubmatch(r.URL.Path)
			entity := matches[1]
			query := fmt.Sprintf("%s/mondial/%s?h=true&null=true", *queryService, entity)
			log.Println("calling", query)
			resp, err := http.Get(query)
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
		default:
			log.Println("Improper Url: " + r.URL.Path)
			w.WriteHeader(404)
		}
	})

	http.HandleFunc("/basic/scatter", func(w http.ResponseWriter, r *http.Request) {
		//w.Header().Set("Content-Type", "image/svg+xml")
		log.Println("processing: /basic/scatter")
		vis := dummy()
		r.ParseForm()
		if e := r.FormValue("e"); e != "" {
			vis.Relation = e
		}
		if x := r.FormValue("x"); x != "" {
			vis.X = x
		}
		if logx := r.FormValue("logx"); logx == "true" {
			vis.IsLogX = true
		}
		if y := r.FormValue("y"); y != "" {
			vis.Y = y
		}
		if logy := r.FormValue("logy"); logy == "true" {
			vis.IsLogY = true
		}
		if c := r.FormValue("c"); c != "" {
			vis.C = c
		}
		if label := r.FormValue("label"); label != "" {
			vis.Label = label
		}
		ScatterPlot(w, vis)
	})

	http.HandleFunc("/weak/line", func(w http.ResponseWriter, r *http.Request) {
		//w.Header().Set("Content-Type", "image/svg+xml")
		log.Println("processing: /weak/line")
		vis := dummyWeakLine()
		r.ParseForm()
		if e := r.FormValue("e"); e != "" {
			vis.Relation = e
		}
		if strong := r.FormValue("strong"); strong != "" {
			vis.Strong = strong
		}

		if weak := r.FormValue("weak"); weak != "" {
			vis.Weak = weak
		}

		if n := r.FormValue("n"); n != "" {
			vis.Measure = n
		}

		// if c := r.FormValue("c"); c != "" {
		// 	vis.C = c
		// }
		if label := r.FormValue("label"); label != "" {
			vis.Label = label
		}
		WeakLinePlot(w, vis)
	})

	http.HandleFunc("/o2m/circle", func(w http.ResponseWriter, r *http.Request) {
		//w.Header().Set("Content-Type", "image/svg+xml")
		log.Println("processing: /o2m/circle")
		vis := dummyO2mCircle()
		r.ParseForm()
		if e := r.FormValue("e"); e != "" {
			vis.Relation = e
		}
		if one := r.FormValue("one"); one != "" {
			vis.One = one
		}

		if many := r.FormValue("many"); many != "" {
			vis.Many = many
		}

		if n := r.FormValue("n"); n != "" {
			vis.Measure = n
		}

		// if c := r.FormValue("c"); c != "" {
		// 	vis.C = c
		// }
		if label := r.FormValue("label"); label != "" {
			vis.Label = label
		}
		O2mCirclePlot(w, vis)
	})

	http.HandleFunc("/basic/bubble", func(w http.ResponseWriter, r *http.Request) {

		vis := dummyBubble()
		r.ParseForm()
		if e := r.FormValue("e"); e != "" {
			vis.Relation = e
		}

		if x := r.FormValue("x"); x != "" {
			vis.X = x
		}
		if logx := r.FormValue("logx"); logx == "true" {
			vis.IsLogX = true
		}
		if y := r.FormValue("y"); y != "" {
			vis.Y = y
		}
		if logy := r.FormValue("logy"); logy == "true" {
			vis.IsLogY = true
		}
		if c := r.FormValue("c"); c != "" {
			vis.C = c
		}
		if s := r.FormValue("s"); s != "" {
			vis.S = s
		}
		if label := r.FormValue("label"); label != "" {
			vis.Label = label
		}
		BubblePlot(w, vis)
	})

	http.HandleFunc("/basic/bar", func(w http.ResponseWriter, r *http.Request) {

		vis := dummyBar()
		r.ParseForm()
		if e := r.FormValue("e"); e != "" {
			vis.Relation = e
		}

		if x := r.FormValue("x"); x != "" {
			vis.X = x
		}
		if logx := r.FormValue("logx"); logx == "true" {
			vis.IsLogX = true
		}

		if c := r.FormValue("c"); c != "" {
			vis.C = c
		}
		if s := r.FormValue("s"); s != "" {
			vis.S = s
		}
		if label := r.FormValue("label"); label != "" {
			vis.Label = label
		}
		BarPlot(w, vis)
	})

	http.HandleFunc("/", simpleFileServer)
	log.Fatal(http.ListenAndServe(*serve, nil))

	flag.Usage()
}

func ScatterPlot(w io.Writer, t basicVis) error {
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

func WeakLinePlot(w io.Writer, t basicVis) error {
	contents, err := ioutil.ReadFile("line.svg")
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

func O2mCirclePlot(w io.Writer, t basicVis) error {
	contents, err := ioutil.ReadFile("cpack.svg")
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

func BubblePlot(w io.Writer, t basicVis) error {
	contents, err := ioutil.ReadFile("bubble.svg")
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

func BarPlot(w io.Writer, t basicVis) error {
	contents, err := ioutil.ReadFile("bar.svg")
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
		Height:   "600",
		Width:    "700",
		Relation: "economy",
		X:        "inflation",
		Y:        "unemployment",
		IsLogX:   false,
		IsLogY:   false,
	}
}

func dummyBubble() Bubble {
	return Bubble{
		Height:   "600",
		Width:    "700",
		Relation: "economy",
		X:        "inflation",
		Y:        "unemployment",
		S:        "gdp",
		IsLogX:   false,
		IsLogY:   false,
	}
}

func dummyBar() Bubble {
	return Bubble{
		Height:   "600",
		Width:    "700",
		Relation: "economy",
		X:        "unemployment",
		IsLogX:   false,
		IsLogY:   false,
	}
}

func dummyWeakLine() Line {
	return Line{
		Height:   "600",
		Width:    "700",
		Relation: "country_population",
		Strong:   "country",
		Weak:     "year",
		Measure:  "population",
		IsLogX:   false,
		IsLogY:   false,
	}
}

func dummyO2mCircle() O2mCircle {
	return O2mCircle{
		Height:   "600",
		Width:    "700",
		Relation: "airport",
		One:      "iata_code",
		Many:     "city",
		Measure:  "population",
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
