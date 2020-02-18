FROM scratch
COPY server /
COPY cmd/basic/ /
CMD ["/server","-qh","http://64.227.42.67:31397"]
